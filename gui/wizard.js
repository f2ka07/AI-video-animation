// Video Processing Wizard

let currentStep = 1;
let currentCourseId = null; // Will be set by loadCourses()
let courses = [];
let workflowStatus = null; // Global workflow status for single audio generation
let currentAudioMode = 'per-slide'; // 'per-slide' or 'per-module'
let courseHasSceneComponents = false; // Whether course has pre-built scene components
let stepStatus = {
    1: { complete: false, locked: false },
    2: { complete: false, locked: true },
    3: { complete: false, locked: true },
    4: { complete: false, locked: true }
};

// Custom Modal (replaces confirm dialogs)
function showModal(title, message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">${escapeHtml(title)}</div>
            <div class="modal-body">${escapeHtml(message)}</div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="modal-btn modal-btn-primary">Confirm</button>
            </div>
        </div>
    `;
    
    const confirmBtn = overlay.querySelector('.modal-btn-primary');
    const cancelBtn = overlay.querySelector('.modal-btn-secondary');
    
    confirmBtn.onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    cancelBtn.onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
    
    document.body.appendChild(overlay);
}

// Toast Notification (replaces alert dialogs)
function showToast(message, type = 'info', duration = 5000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const title = type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Info';
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideInRight 0.3s reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Finalize video - run all final steps and open Remotion
async function finalizeVideo() {
    const finalizeBtn = document.getElementById('finalize-video-btn');
    if (finalizeBtn) {
        finalizeBtn.disabled = true;
        finalizeBtn.textContent = 'Finalizing...';
    }
    
    try {
        // Get current module from URL or use current course's first module
        const urlParams = new URLSearchParams(window.location.search);
        let moduleNumber = urlParams.get('module');
        const courseId = urlParams.get('course') || currentCourseId;
        
        // If no module in URL, try to get from course
        if (!moduleNumber && courseId) {
            try {
                const modulesResponse = await fetch(`/api/modules?course=${courseId}`);
                const modulesData = await modulesResponse.json();
                if (modulesData.modules && modulesData.modules.length > 0) {
                    moduleNumber = modulesData.modules[0].moduleNumber.toString();
                }
            } catch (e) {
                console.error('Error fetching modules:', e);
            }
        }
        
        if (!moduleNumber) {
            showToast('No module specified. Please select a segment first.', 'error');
            return;
        }
        
        // Run finalize steps in correct order (Audio → Measure → Remotion Files)
        // Modules depend on audioDuration.ts, so audio must be generated/measured first
        // NOTE: Existing audio files are NOT regenerated to avoid costs
        showToast('Finalizing video... (existing audio files will be skipped)', 'info');
        
        // Step 1: Generate and measure audio (if needed)
        // This uses the alternating workflow: generate → measure for each slide
        // Existing audio files are skipped to avoid regeneration costs
        const audioResponse = await fetch('/api/generate-and-measure-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                course: courseId, 
                moduleRange: moduleNumber.toString() 
            })
        });
        if (!audioResponse.ok) {
            const errorData = await audioResponse.json().catch(() => ({}));
            throw new Error(`Audio generation/measurement failed: ${errorData.error || audioResponse.statusText}`);
        }
        
        // Wait for streaming to complete
        const reader = audioResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
        }
        
        // Step 2: Check if word timings exist (REQUIRED for finalization)
        const statusCheck = await fetch(`/api/module-status?moduleNumber=${moduleNumber}&course=${courseId}`);
        const statusData = await statusCheck.json();
        
        if (!statusData.canFinalize) {
            if (statusData.missingTimings && statusData.missingTimings.length > 0) {
                throw new Error(
                    `Cannot finalize: Word timings are missing for ${statusData.missingTimings.length} slide(s). ` +
                    `Complete Step 4 (Word Timings) in the processing wizard first. ` +
                    `Without word timings, animations will not sync with audio.`
                );
            }
            const parts = [];
            if (statusData.missingAudioFiles && statusData.missingAudioFiles.length > 0) {
                parts.push(`missing audio: ${statusData.missingAudioFiles.join(', ')}`);
            }
            if (statusData.missingAudioDurations && statusData.missingAudioDurations.length > 0) {
                parts.push(`missing durations: ${statusData.missingAudioDurations.join(', ')}`);
            }
            if (statusData.hasModuleFiles === false) {
                parts.push('module files not generated');
            }
            const detail = parts.length > 0 ? ` (${parts.join('; ')})` : '';
            throw new Error(
                `Cannot finalize: Module is not ready. Complete all steps (1-4) before finalizing.${detail}`
            );
        }
        
        // Step 3: Align diagram phases to narration (generate animation specs from word timings, copy SVGs)
        if (courseId) {
            const alignResponse = await fetch('/api/align-diagram-phases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId })
            });
            if (!alignResponse.ok) {
                const alignErr = await alignResponse.json().catch(() => ({}));
                console.warn('Align diagram phases skipped or failed:', alignErr.error || alignResponse.statusText);
            }
        }
        
        // Step 4: Generate Remotion composition files (FINAL STEP)
        // This creates ModuleX.tsx and ModuleXConfig.ts - the Remotion files needed for rendering
        // Modules use getAudioDuration() which requires audioDuration.ts to exist
        // IMPORTANT: Include audioMode to use the correct generator (scene-based vs slide-based)
        
        // Ensure we have the current audio mode (fetch if not loaded)
        let audioMode = currentAudioMode || 'per-slide';
        if (!currentAudioMode) {
            try {
                const settingsResponse = await fetch('/api/voice-settings');
                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json();
                    audioMode = settings.audioMode || 'per-slide';
                    currentAudioMode = audioMode; // Update global variable
                }
            } catch (e) {
                console.warn('Could not fetch audio mode, using default:', e);
            }
        }
        
        // For per-module mode, generate ALL modules, not just one
        // For per-slide mode, generate the specified module
        let moduleRangeToGenerate = moduleNumber;
        if (audioMode === 'per-module') {
            // Generate all modules (1-6) for the course
            moduleRangeToGenerate = '1-6';
            console.log(`[finalizeVideo] Per-module mode: generating all modules (1-6) for course ${courseId}`);
        } else {
            console.log(`[finalizeVideo] Per-slide mode: generating module ${moduleNumber} for course ${courseId}`);
        }
        
        console.log(`[finalizeVideo] Sending request: course=${courseId}, moduleRange=${moduleRangeToGenerate}, audioMode=${audioMode}`);
        
        const genResponse = await fetch('/api/generate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                course: courseId, 
                moduleRange: moduleRangeToGenerate,
                audioMode: audioMode // Use current audio mode setting
            })
        });
        if (!genResponse.ok) {
            const errorData = await genResponse.json().catch(() => ({}));
            throw new Error(`Remotion file generation failed: ${errorData.error || genResponse.statusText}`);
        }
        
        // Step 5: Activate the course in Remotion (register it with Remotion system)
        // This copies timings to public/timings/, updates moduleContent.ts, etc.
        console.log('[finalizeVideo] Activating course in Remotion system...');
        try {
            const activateResponse = await fetch(`/api/courses/${courseId}/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!activateResponse.ok) {
                const activateError = await activateResponse.json().catch(() => ({}));
                console.warn('[finalizeVideo] Activation warning:', activateError.error || activateResponse.statusText);
                // Don't fail finalization if activation has issues - files are already generated
                showToast('Remotion files created! Course activation had warnings - check console.', 'warning');
            } else {
                const activateData = await activateResponse.json();
                console.log('[finalizeVideo] Course activated:', activateData.message);
                showToast('Remotion files created! Course activated and ready for rendering. Opening Remotion Studio...', 'success');
            }
        } catch (activateErr) {
            console.warn('[finalizeVideo] Activation error (non-fatal):', activateErr);
            showToast('Remotion files created! Activation had issues - files are ready but may need manual activation.', 'warning');
        }
        
        // Open Remotion Studio with the segment
        setTimeout(() => {
            window.location.href = `http://localhost:3000?composition=module-${moduleNumber}`;
        }, 1500);
        
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        if (finalizeBtn) {
            finalizeBtn.disabled = false;
            finalizeBtn.textContent = 'Finalize Video';
        }
    }
}

// Render video to MP4
async function renderVideo() {
    const renderBtn = document.getElementById('render-video-btn');
    const progressDiv = document.getElementById('render-progress');
    const statusText = document.getElementById('render-status-text');
    const progressBar = document.getElementById('render-progress-bar');
    const progressPercent = document.getElementById('render-progress-percent');
    const detailsDiv = document.getElementById('render-details');
    const downloadLink = document.getElementById('download-video-link');
    const moduleSelector = document.getElementById('render-module-select');
    
    // Get module from dropdown selector
    const moduleNumber = moduleSelector ? moduleSelector.value : null;
    
    if (!moduleNumber) {
        showToast('Please select a module to render.', 'error');
        return;
    }
    
    if (renderBtn) {
        renderBtn.disabled = true;
        renderBtn.textContent = 'Rendering...';
    }
    
    progressDiv.style.display = 'block';
    statusText.textContent = 'Starting video render...';
    progressBar.style.width = '0%';
    progressPercent.textContent = '';
    detailsDiv.innerHTML = '';
    downloadLink.style.display = 'none';
    
    const details = [];
    
    function updateRenderDetails() {
        if (detailsDiv) {
            const recent = details.slice(-10);
            detailsDiv.innerHTML = recent.map(d => `<div style="margin-bottom: 4px; padding: 4px 0; border-bottom: 1px solid var(--border);">${d}</div>`).join('');
            detailsDiv.scrollTop = detailsDiv.scrollHeight;
        }
    }
    
    try {
        const response = await fetch('/api/render-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moduleNumber: parseInt(moduleNumber) })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let renderCompleted = false;
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        
                        switch (data.type) {
                            case 'start':
                                statusText.textContent = data.message;
                                details.push(`[START] ${data.message}`);
                                updateRenderDetails();
                                break;
                                
                            case 'progress':
                                statusText.textContent = data.message;
                                
                                // Use server-provided percent if available (more accurate)
                                if (data.percent !== undefined) {
                                    progressBar.style.width = `${data.percent}%`;
                                    progressPercent.textContent = `${data.percent}%`;
                                    // Color code by phase
                                    switch (data.phase) {
                                        case 'bundling':
                                            progressBar.style.background = 'var(--warning, #f59e0b)';
                                            break;
                                        case 'copying':
                                            progressBar.style.background = 'var(--info, #3b82f6)';
                                            break;
                                        case 'rendering':
                                            progressBar.style.background = 'var(--primary, #6366f1)';
                                            break;
                                        case 'encoding':
                                            progressBar.style.background = 'var(--secondary, #8b5cf6)';
                                            break;
                                        case 'complete':
                                            progressBar.style.background = 'var(--success, #22c55e)';
                                            break;
                                        default:
                                            progressBar.style.background = 'var(--primary, #6366f1)';
                                    }
                                    // Only add phase transitions to details (not every % update)
                                    // Progress bar already shows percentage - details should be minimal
                                    if (data.percent === 100 || (data.percent % 25 === 0 && data.percent > 0)) {
                                        details.push(`${data.phase}: ${data.percent}%`);
                                        updateRenderDetails();
                                    }
                                } else {
                                    // Fallback: Try to extract progress percentage from message
                                    const percentMatch = data.message.match(/(\d+)%/);
                                    if (percentMatch) {
                                        const percent = parseInt(percentMatch[1]);
                                        progressBar.style.width = `${percent}%`;
                                        progressPercent.textContent = `${percent}%`;
                                    }
                                    details.push(data.message);
                                    updateRenderDetails();
                                }
                                break;
                                
                            case 'warning':
                                details.push(`⚠️ ${data.message}`);
                                updateRenderDetails();
                                break;
                                
                            case 'error':
                                details.push(`❌ ${data.message}`);
                                updateRenderDetails();
                                showToast(`Render error: ${data.message}`, 'error');
                                break;
                                
                            case 'done':
                                renderCompleted = true;
                                if (data.success) {
                                    statusText.textContent = '✓ Render Complete!';
                                    progressBar.style.width = '100%';
                                    progressBar.style.background = 'var(--success)';
                                    progressPercent.textContent = '100%';
                                    details.push(`✅ ${data.message}`);
                                    
                                    // Display validation results if available
                                    if (data.validation) {
                                        const validation = data.validation;
                                        if (validation.valid) {
                                            details.push(`✓ Validation: Video file is valid`);
                                        } else {
                                            details.push(`⚠ Validation: ${validation.errors.length} error(s) found`);
                                        }
                                        
                                        if (validation.errors && validation.errors.length > 0) {
                                            validation.errors.forEach(err => {
                                                details.push(`❌ ${err}`);
                                            });
                                        }
                                        
                                        if (validation.warnings && validation.warnings.length > 0) {
                                            validation.warnings.forEach(warn => {
                                                details.push(`⚠️ ${warn}`);
                                            });
                                        }
                                        
                                        if (validation.checks) {
                                            if (validation.checks.slideCount) {
                                                details.push(`📊 Slides: ${validation.checks.slideCount}`);
                                            }
                                            if (validation.checks.expectedDuration) {
                                                details.push(`⏱ Expected duration: ${validation.checks.expectedDuration.toFixed(1)}s`);
                                            }
                                            if (validation.checks.fileSize) {
                                                details.push(`📦 File size: ${validation.checks.fileSize.sizeMB}MB`);
                                            }
                                        }
                                    }
                                    
                                    if (data.downloadUrl) {
                                        downloadLink.href = data.downloadUrl;
                                        downloadLink.style.display = 'inline-block';
                                        downloadLink.textContent = `Download MP4 (${(data.fileSize / 1024 / 1024).toFixed(1)}MB)`;
                                    }
                                    
                                    updateRenderDetails();
                                    
                                    // Show validation status in toast
                                    if (data.validation && !data.validation.valid) {
                                        showToast('Video rendered but validation found issues. Check details below.', 'warning');
                                    } else {
                                        showToast('Video rendered successfully!', 'success');
                                    }
                                } else {
                                    statusText.textContent = '✗ Render Failed';
                                    progressBar.style.background = 'var(--error)';
                                    details.push(`❌ ${data.message}`);
                                    updateRenderDetails();
                                    showToast(`Render failed: ${data.message}`, 'error');
                                }
                                
                                if (renderBtn) {
                                    renderBtn.disabled = false;
                                    renderBtn.textContent = 'Render Video to MP4';
                                }
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e, line);
                    }
                }
            }
        }
        
        // Handle stream end without proper done event
        if (!renderCompleted) {
            statusText.textContent = 'Stream ended - check if video was saved';
            if (renderBtn) {
                renderBtn.disabled = false;
                renderBtn.textContent = 'Render Video to MP4';
            }
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        statusText.textContent = 'Render Failed';
        progressBar.style.background = 'var(--error)';
        
        if (renderBtn) {
            renderBtn.disabled = false;
            renderBtn.textContent = 'Render Video to MP4';
        }
    }
}

// Generate preview modules (fixed durations, no audio) and open Remotion Studio
async function viewSegmentsInRemotion() {
    const btn = document.getElementById('view-segments-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Preparing...';
    }
    try {
        const response = await fetch('/api/generate-preview-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course: currentCourseId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data.details || `HTTP ${response.status}`);
        }
        showToast(data.message || 'Preview modules generated', 'success');
        window.open('http://localhost:3000', '_blank', 'noopener,noreferrer');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'View Segments in Remotion';
        }
    }
}

// Batch render all modules in the course (for overnight rendering)
async function renderCourse() {
    const renderCourseBtn = document.getElementById('render-course-btn');
    const progressDiv = document.getElementById('batch-render-progress');
    const statusText = document.getElementById('batch-render-status');
    const modulesList = document.getElementById('batch-modules-list');
    
    if (renderCourseBtn) {
        renderCourseBtn.disabled = true;
        renderCourseBtn.textContent = 'Rendering Course...';
    }
    
    progressDiv.style.display = 'block';
    statusText.textContent = 'Starting batch render...';
    modulesList.innerHTML = '';
    
    const moduleStatus = {}; // Track each module's status
    
    function updateModulesList() {
        const items = Object.entries(moduleStatus).map(([mod, status]) => {
            let icon = '';
            let color = 'var(--muted)';
            if (status.state === 'complete') {
                icon = '[OK]';
                color = 'var(--success)';
            } else if (status.state === 'failed') {
                icon = '[FAIL]';
                color = 'var(--error)';
            } else if (status.state === 'rendering') {
                icon = '[...]';
                color = 'var(--primary)';
            } else {
                icon = '[ ]';
            }
            const duration = status.duration ? ` (${status.duration}s)` : '';
            return `<div style="color: ${color}; padding: 4px 0;">${icon} Module ${mod}${duration}</div>`;
        });
        modulesList.innerHTML = items.join('');
    }
    
    try {
        const response = await fetch('/api/render-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                course: currentCourseId,
                concurrency: 4,
                scale: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        
                        switch (data.type) {
                            case 'start':
                                statusText.textContent = data.message;
                                break;
                                
                            case 'module_start':
                                moduleStatus[data.module] = { state: 'rendering' };
                                statusText.textContent = `Rendering Module ${data.module}...`;
                                updateModulesList();
                                break;
                                
                            case 'module_complete':
                                moduleStatus[data.module] = { 
                                    state: 'complete', 
                                    duration: data.duration 
                                };
                                updateModulesList();
                                break;
                                
                            case 'progress':
                                // Update current module's progress
                                if (data.module && moduleStatus[data.module]) {
                                    moduleStatus[data.module].lastProgress = data.message;
                                }
                                break;
                                
                            case 'done':
                                if (data.success) {
                                    statusText.textContent = 'All modules rendered successfully!';
                                    showToast('Batch render complete!', 'success');
                                } else {
                                    statusText.textContent = 'Batch render completed with errors';
                                    showToast('Some modules failed to render', 'warning');
                                }
                                
                                if (renderCourseBtn) {
                                    renderCourseBtn.disabled = false;
                                    renderCourseBtn.textContent = 'Render Entire Course';
                                }
                                break;
                                
                            case 'error':
                                showToast(`Batch error: ${data.message}`, 'error');
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsing batch SSE:', e);
                    }
                }
            }
        }
    } catch (error) {
        showToast(`Batch render error: ${error.message}`, 'error');
        statusText.textContent = 'Batch render failed';
        
        if (renderCourseBtn) {
            renderCourseBtn.disabled = false;
            renderCourseBtn.textContent = 'Render Entire Course';
        }
    }
}

// Get course ID from URL or localStorage (loadCourses will validate and set if invalid)
const urlParams = new URLSearchParams(window.location.search);
currentCourseId = urlParams.get('course') || localStorage.getItem('currentCourse') || null;
console.log(`[wizard] Initial courseId: ${currentCourseId}`);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('[wizard] DOMContentLoaded - starting initialization');
    loadCourses().then(() => {
        console.log('[wizard] Courses loaded, currentCourseId:', currentCourseId);
        
        // Set course selector to current course
        const courseSelector = document.getElementById('course-selector');
        if (courseSelector) {
            courseSelector.value = currentCourseId || '';
            console.log('[wizard] Course selector value set to:', courseSelector.value);
            
            // Add change handler if not already present (HTML already has onchange, but this ensures it works)
            if (!courseSelector.hasAttribute('data-handler-attached')) {
                courseSelector.addEventListener('change', function() {
                    console.log('[wizard] Course selector changed to:', this.value);
                    changeCourse(this.value);
                });
                courseSelector.setAttribute('data-handler-attached', 'true');
            }
        } else {
            console.warn('[wizard] Course selector element not found');
        }
        
        // Only load selectors if a course is selected
        if (currentCourseId) {
            console.log('[wizard] Loading selectors for course:', currentCourseId);
            checkAllSteps().then(() => {
                updateUI();
            });
            updateUI();
            loadRenderModuleSelector();
            loadUploadSlideSelector();
            loadSplitModuleSelector();
            loadImageSlideSelector();
            initVoiceSettings();
        } else {
            console.log('[wizard] No course selected, skipping selector loading');
            // Still update UI and initialize voice settings even without a course
            updateUI();
            initVoiceSettings();
        }
    }).catch(error => {
        console.error('[wizard] Error initializing wizard:', error);
        // Show error in course selector if it exists
        const courseSelector = document.getElementById('course-selector');
        if (courseSelector) {
            courseSelector.innerHTML = '<option value="">Error loading videos - check console</option>';
        }
        // Still try to update UI
        updateUI();
    });
});

// Load modules for the render selector dropdown
async function loadRenderModuleSelector() {
    const selector = document.getElementById('render-module-select');
    if (!selector) return;
    
    if (!currentCourseId) {
        selector.innerHTML = '<option value="">Select a video first</option>';
        return;
    }
    
    try {
        const response = await fetch(`/api/modules?course=${currentCourseId}`);
        if (!response.ok) throw new Error('Failed to fetch modules');
        
        const data = await response.json();
        const modules = data.modules || [];
        
        if (modules.length === 0) {
            selector.innerHTML = '<option value="">No modules found</option>';
            return;
        }
        
        selector.innerHTML = modules.map(m => 
            `<option value="${m.moduleNumber}">Module ${m.moduleNumber}: ${m.title}</option>`
        ).join('');
    } catch (e) {
        console.error('Error loading modules for render selector:', e);
        selector.innerHTML = '<option value="">Error loading modules</option>';
    }
}

// Load courses
async function loadCourses() {
    try {
        // In processing wizard, load ALL courses (active + archived) so user can select any video
        const isProcessingWizard = window.location.pathname.includes('processing-wizard.html') || 
                                   window.location.href.includes('processing-wizard.html');
        const apiUrl = isProcessingWizard ? '/api/courses?status=all' : '/api/courses';
        
        console.log('[wizard] Loading courses from:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to load courses: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        courses = data.courses || [];
        console.log('[wizard] Loaded', courses.length, 'courses');
        
        const selector = document.getElementById('course-selector');
        const noCoursesPlaceholder = document.getElementById('no-active-courses');
        const wizardContent = document.getElementById('wizard-content');
        
        if (courses.length === 0) {
            // No courses - show placeholder, hide wizard
            if (selector) selector.innerHTML = '<option value="">No videos found</option>';
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'block';
            if (wizardContent) wizardContent.style.display = 'none';
            currentCourseId = null;
        } else {
            // Has courses - show wizard
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'none';
            if (wizardContent) wizardContent.style.display = 'block';
            
            // Set current course if not set or not in list (BEFORE building selector)
            if (!currentCourseId || !courses.find(c => c.id === currentCourseId)) {
                currentCourseId = courses[0].id;
                localStorage.setItem('currentCourse', currentCourseId);
            }
            
            if (selector) {
                // Group courses by status for better UX
                const activeCourses = courses.filter(c => c.status === 'active');
                const archivedCourses = courses.filter(c => c.status === 'archived');
                
                let options = '<option value="">Select a video...</option>';
                
                if (activeCourses.length > 0) {
                    if (archivedCourses.length > 0) {
                        options += '<optgroup label="Active Videos">';
                    }
                    activeCourses.forEach(c => {
                        options += `<option value="${c.id}" ${c.id === currentCourseId ? 'selected' : ''}>${c.title}</option>`;
                    });
                    if (archivedCourses.length > 0) {
                        options += '</optgroup>';
                    }
                }
                
                if (archivedCourses.length > 0) {
                    if (activeCourses.length > 0) {
                        options += '<optgroup label="Archived Videos">';
                    }
                    archivedCourses.forEach(c => {
                        options += `<option value="${c.id}" ${c.id === currentCourseId ? 'selected' : ''}>${c.title} (Archived)</option>`;
                    });
                    if (activeCourses.length > 0) {
                        options += '</optgroup>';
                    }
                }
                
                selector.innerHTML = options;
                
                // Trigger change event if course is auto-selected to load all selectors
                if (currentCourseId && currentCourseId === courses[0].id) {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        changeCourse(currentCourseId);
                    }, 100);
                }
            }
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        if (selector) {
            selector.innerHTML = '<option value="">Error loading videos</option>';
        }
    }
}

// Change course
function changeCourse(courseId) {
    if (!courseId) {
        return;
    }
    
    currentCourseId = courseId;
    localStorage.setItem('currentCourse', currentCourseId);
    
    // Reset step status and recheck
    stepStatus = {
        1: { complete: false, locked: false },
        2: { complete: false, locked: true },
        3: { complete: false, locked: true },
        4: { complete: false, locked: true }
    };
    
    // Go back to step 1
    currentStep = 1;
    
    // Recheck all steps for new course and reload all selectors
    checkAllSteps().then(() => {
        // Reload all selectors after course change
        Promise.all([
            loadRenderModuleSelector(),
            loadUploadSlideSelector(),
            loadSplitModuleSelector(),
            loadImageSlideSelector()
        ]).catch(error => {
            console.error('Error reloading selectors:', error);
        });
    }).catch(error => {
        console.error('Error checking steps:', error);
        // Still try to load selectors even if checkAllSteps fails
        Promise.all([
            loadRenderModuleSelector(),
            loadUploadSlideSelector(),
            loadSplitModuleSelector(),
            loadImageSlideSelector()
        ]).catch(err => {
            console.error('Error reloading selectors:', err);
        });
    });
    updateUI();
}

// Check status of all steps
async function checkAllSteps() {
    try {
        // Get module number from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const moduleNumber = urlParams.get('module');
        
        // Check workflow status - get detailed status per module
        const response = await fetch(`/api/workflow-status?course=${currentCourseId}`);
        const data = await response.json();
        
        // Store globally for single audio generation
        workflowStatus = data;
        populateSingleAudioModules();
        
        // Reload module selectors after workflow status is loaded
        loadSplitModuleSelector();
        
        // If specific module in URL, check that module's status
        let moduleStatus = null;
        if (moduleNumber) {
            moduleStatus = data.modules.find(m => m.moduleNumber === parseInt(moduleNumber));
        } else if (data.modules.length > 0) {
            // Use first module if no specific module
            moduleStatus = data.modules[0];
        }
        
        if (moduleStatus) {
            // Use module-specific status for accurate checking
            stepStatus[1].complete = moduleStatus.moduleGenerated || false;
            
            // Step 2: Check if audio is complete
            // More lenient: if audioComplete matches audioTotal, OR if there are any audio files at all
            const audioCountMatch = moduleStatus.audioComplete === moduleStatus.audioTotal && moduleStatus.audioTotal > 0;
            const hasAnyAudio = (moduleStatus.audioComplete > 0) || (moduleStatus.audioFiles && moduleStatus.audioFiles.length > 0);
            stepStatus[2].complete = audioCountMatch || hasAnyAudio;
            
            stepStatus[3].complete = moduleStatus.audioMeasured || false;
            stepStatus[4].complete = moduleStatus.timingsExtracted || false;
        } else {
            // Fallback to summary status if no module found
            stepStatus[1].complete = data.summary.modulesGenerated > 0;
            
            // Step 2: More lenient check - if any audio files exist, consider it complete
            const summaryMatch = data.summary.audioFilesGenerated === data.summary.totalAudioFiles && data.summary.totalAudioFiles > 0;
            const hasAnyAudioInSummary = data.summary.audioFilesGenerated > 0;
            // Also check if any module has audio
            const hasAnyModuleAudio = data.modules.some(m => (m.audioComplete > 0) || (m.audioFiles && m.audioFiles.length > 0));
            stepStatus[2].complete = summaryMatch || hasAnyAudioInSummary || hasAnyModuleAudio;
            
            // For step 3, check if any modules have measured audio
            stepStatus[3].complete = data.modules.some(m => m.audioMeasured) || false;
            stepStatus[4].complete = data.modules.some(m => m.timingsExtracted) || false;
        }
        
        // REMOVED: Step locking - all steps are always accessible
        // Users can work on any step independently. Only final video rendering is blocked.
        stepStatus[1].locked = false;
        stepStatus[2].locked = false;
        stepStatus[3].locked = false;
        stepStatus[4].locked = false;
        
        // Debug logging to help diagnose issues
        if (window.location.search.includes('debug=true')) {
            console.log('[Step Status]', {
                step1: { complete: stepStatus[1].complete, locked: stepStatus[1].locked },
                step2: { complete: stepStatus[2].complete, locked: stepStatus[2].locked,
                         audioComplete: moduleStatus && moduleStatus.audioComplete, audioTotal: moduleStatus && moduleStatus.audioTotal },
                step3: { complete: stepStatus[3].complete, locked: stepStatus[3].locked },
                step4: { complete: stepStatus[4].complete, locked: stepStatus[4].locked }
            });
        }

        hideWorkflowError();
        updateUI();
    } catch (error) {
        console.error('Error checking steps:', error);
        stepStatus[1].locked = false;
        stepStatus[2].locked = !stepStatus[1].complete && !stepStatus[2].complete;
        stepStatus[3].locked = !stepStatus[2].complete && !stepStatus[3].complete;
        stepStatus[4].locked = !stepStatus[3].complete && !stepStatus[4].complete;
        showWorkflowError(error && error.message ? error.message : 'Could not load step status. Check that a course is selected and the server is running.');
        updateUI();
    }
}

function showWorkflowError(message) {
    const card = document.getElementById('workflow-error-card');
    const text = document.getElementById('workflow-error-text');
    if (card && text) {
        text.textContent = message;
        card.style.display = 'block';
    }
}

function hideWorkflowError() {
    const card = document.getElementById('workflow-error-card');
    if (card) card.style.display = 'none';
}

function retryCheckSteps() {
    hideWorkflowError();
    checkAllSteps();
}

// Update UI based on step status
function updateUI() {
    const stepLabels = {
        1: 'Generate Segments',
        2: 'Generate Audio',
        3: 'Measure Audio',
        4: 'Extract Timings'
    };

    // Update step indicators and show incomplete/complete state clearly
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        const status = stepStatus[i];
        if (!indicator) continue;

        indicator.classList.remove('active', 'complete', 'locked');

        if (i === currentStep && !status.locked) {
            indicator.classList.add('active');
        } else if (status.complete) {
            indicator.classList.add('complete');
            const circle = indicator.querySelector('.step-circle');
            if (circle) circle.textContent = '\u2713'; // check
            status.locked = false;
        } else if (status.locked) {
            indicator.classList.add('locked');
        }

        const labelEl = indicator.querySelector('.step-label');
        if (labelEl) {
            const base = stepLabels[i] || `Step ${i}`;
            if (status.complete) {
                labelEl.textContent = base + ' (Complete)';
            } else if (status.locked) {
                labelEl.textContent = base + ' (Locked)';
            } else {
                labelEl.textContent = base + ' (Incomplete)';
            }
        }
    }
    
    // Update step content visibility
    for (let i = 1; i <= 4; i++) {
        const content = document.getElementById(`step-${i}`);
        if (i === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    }
    
    // Load selectors when steps are shown
    if (currentCourseId) {
        if (currentStep === 1) {
            loadImageSlideSelector();
            loadUploadSlideSelector();
        } else if (currentStep === 2) {
            loadUploadSlideSelector();
            populateSingleAudioSlides();
        }
    }
    
    // Update step info and buttons
    updateStepInfo(1);
    updateStepInfo(2);
    updateStepInfo(3);
    updateStepInfo(4);
    
    // Show status: basicPreview (Steps 1-3) vs fullyAnimated (Steps 1-4)
    const basicPreview = stepStatus[1].complete && stepStatus[2].complete && stepStatus[3].complete;
    const fullyAnimated = basicPreview && stepStatus[4].complete;
    const readyForRemotion = basicPreview; // Legacy support
    
    const completionMsg = document.getElementById('completion-message');
    const readyMsg = document.getElementById('ready-for-remotion');
    
    if (fullyAnimated) {
        if (completionMsg) completionMsg.style.display = 'block';
        if (readyMsg) readyMsg.style.display = 'none';
    } else if (readyForRemotion) {
        if (completionMsg) completionMsg.style.display = 'none';
        if (readyMsg) readyMsg.style.display = 'block';
    } else {
        if (completionMsg) completionMsg.style.display = 'none';
        if (readyMsg) readyMsg.style.display = 'none';
    }
}

// Build progress summary from workflowStatus so each step shows what makes it complete/incomplete
function getStepProgressSummary(stepNum) {
    const w = workflowStatus;
    if (!w || !w.modules || w.modules.length === 0) {
        return { text: 'Checking...', percent: 0 };
    }
    const totalModules = w.modules.length;
    const summary = w.summary || {};
    switch (stepNum) {
        case 1: {
            const done = summary.modulesGenerated || 0;
            const total = summary.totalModules || totalModules;
            const pct = total ? Math.round((done / total) * 100) : 0;
            if (done >= total && total > 0) {
                return { text: 'Complete – ' + total + ' module' + (total !== 1 ? 's' : '') + ' have segment files', percent: 100 };
            }
            return { text: 'Incomplete – ' + done + ' of ' + total + ' modules have segment files', percent: pct };
        }
        case 2: {
            const done = summary.audioFilesGenerated || 0;
            const total = summary.totalAudioFiles || 0;
            const pct = total ? Math.round((done / total) * 100) : 0;
            if (done >= total && total > 0) {
                return { text: 'Complete – ' + total + ' audio files generated', percent: 100 };
            }
            return { text: 'Incomplete – ' + done + ' of ' + total + ' audio files generated', percent: pct };
        }
        case 3: {
            const measured = w.modules.filter(m => m.audioMeasured).length;
            const pct = totalModules ? Math.round((measured / totalModules) * 100) : 0;
            if (measured >= totalModules && totalModules > 0) {
                return { text: 'Complete – ' + totalModules + ' module' + (totalModules !== 1 ? 's' : '') + ' measured', percent: 100 };
            }
            return { text: 'Incomplete – ' + measured + ' of ' + totalModules + ' modules have audio measured', percent: pct };
        }
        case 4: {
            const extracted = w.modules.filter(m => m.timingsExtracted).length;
            const pct = totalModules ? Math.round((extracted / totalModules) * 100) : 0;
            if (extracted >= totalModules && totalModules > 0) {
                return { text: 'Complete – ' + totalModules + ' module' + (totalModules !== 1 ? 's' : '') + ' have word timings', percent: 100 };
            }
            return { text: 'Incomplete – ' + extracted + ' of ' + totalModules + ' modules have word timings', percent: pct };
        }
        default:
            return { text: 'Checking...', percent: 0 };
    }
}

function updateStepInfo(stepNum) {
    const status = stepStatus[stepNum];
    const statusText = document.getElementById(`step-${stepNum}-status-text`);
    const btn = document.getElementById(`step-${stepNum}-btn`);
    const info = document.getElementById(`step-${stepNum}-info`);
    
    // Return early if statusText element doesn't exist
    if (!statusText) {
        console.warn(`Step ${stepNum} status text element not found`);
        return;
    }

    // Update progress block (same pattern as Step 1) so every step shows what makes it complete/incomplete
    const progressEl = document.getElementById(`step-${stepNum}-progress`);
    const progressBar = document.getElementById(`step-${stepNum}-progress-bar`);
    const progressInfo = progressEl ? progressEl.querySelector('.progress-info') : null;
    if (progressEl && progressInfo) {
        const sum = getStepProgressSummary(stepNum);
        progressInfo.textContent = sum.text;
        progressInfo.style.color = sum.percent >= 100 ? 'var(--success)' : 'var(--text-muted)';
        if (progressBar) {
            progressBar.style.width = sum.percent + '%';
            progressBar.className = 'segment-progress-bar' + (sum.percent >= 100 ? ' success' : '');
        }
        progressEl.style.borderColor = sum.percent >= 100 ? 'var(--success)' : 'var(--border)';
    }
    
    // Completed steps should never be locked - allow regeneration
    if (status.complete) {
        // Force unlock completed steps
        status.locked = false;
        statusText.textContent = '✓ Complete';
        statusText.style.color = 'var(--success)';
        statusText.style.fontWeight = '600';
        if (info) {
            info.style.background = 'rgba(16, 185, 129, 0.1)';
            info.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            info.style.opacity = '1';
        }
        if (btn) {
            btn.disabled = false;
            // Show "Regenerate" option but with clear indication it's already done
            btn.textContent = stepNum === 1 ? 'Regenerate Segments' : (stepNum === 2 ? 'Regenerate Audio' : (stepNum === 3 ? 'Re-measure Audio' : 'Re-extract Timings'));
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    } else if (status.locked) {
        // Check if step is locked due to dependencies (only for incomplete steps)
        const requiredStep = stepNum - 1;
        statusText.textContent = `Locked - Complete Step ${requiredStep} first`;
        statusText.style.color = 'var(--text-muted)';
        statusText.style.fontWeight = 'normal';
        if (info) {
            info.style.background = 'var(--surface)';
            info.style.border = '1px solid var(--border)';
            info.style.opacity = '0.6';
        }
        if (btn) {
            btn.disabled = true;
            btn.textContent = stepNum === 1 ? 'Generate Segments' : 
                             (stepNum === 2 ? 'Generate Audio' : 
                              (stepNum === 3 ? 'Measure Audio' : 'Extract Timings'));
            btn.classList.remove('btn-primary', 'btn-secondary');
            btn.classList.add('btn-secondary');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    } else {
        statusText.textContent = stepNum === 1 ? 'Ready - Generate segment files' : 
                                  (stepNum === 2 ? 'Ready - Generate audio files' : 
                                   (stepNum === 3 ? 'Ready - Measure audio durations' : 
                                    'Ready - Extract word timings'));
        statusText.style.color = 'var(--warning)';
        statusText.style.fontWeight = 'normal';
        if (info) {
            info.style.background = 'var(--surface-light)';
            info.style.border = 'none';
            info.style.opacity = '1';
        }
        if (btn) {
            btn.disabled = false;
            btn.textContent = stepNum === 1 ? 'Generate Segment Files' : 
                             (stepNum === 2 ? 'Generate ALL Audio (Bulk)' : 
                              (stepNum === 3 ? 'Measure Audio' : 'Extract Timings'));
            btn.classList.remove('btn-secondary');
            if (stepNum === 2) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-warning');
            } else {
                btn.classList.add('btn-primary');
            }
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }
}

// Navigate to step
function goToStep(stepNum) {
    // Prevent navigation to locked steps
    if (stepStatus[stepNum] && stepStatus[stepNum].locked) {
        const requiredStep = stepNum - 1;
        showToast(`Step ${stepNum} is locked. Complete Step ${requiredStep} first.`, 'warning');
        // Navigate to the required step instead
        if (stepStatus[requiredStep] && !stepStatus[requiredStep].locked) {
            stepNum = requiredStep;
        } else {
            return; // Can't navigate anywhere
        }
    }
    // Allow navigation to any step - the step itself will check if prerequisites are met
    // This allows users to see what's needed even if previous steps aren't complete
    currentStep = stepNum;
    updateUI();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Allow clicking on step indicators to navigate (if unlocked)
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        if (indicator) {
            indicator.style.cursor = 'pointer';
            indicator.addEventListener('click', () => {
                if (!stepStatus[i].locked) {
                    goToStep(i);
                }
            });
        }
    }
});

// Reset button states after operation
function resetButton(btnId, originalText) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Validate module content for missing properties
async function validateContent() {
    const statusEl = document.getElementById('validate-content-status');
    const btn = document.getElementById('validate-content-btn');
    
    if (!currentCourseId) {
        showStatus(statusEl, 'error', 'Please select a video first.');
        return;
    }
    
    if (!statusEl) {
        console.error('validate-content-status element not found');
        return;
    }
    
    if (!btn) {
        console.error('validate-content-btn element not found');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Validating...';
    statusEl.style.display = 'block';
    showStatus(statusEl, 'loading', 'Checking all slides for missing properties...');

    try {
        const response = await fetch('/api/validate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course: currentCourseId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        btn.disabled = false;
        btn.textContent = 'Validate Content';
        
        if (data.hasIssues) {
            // Parse the output to show issues
            const output = data.output || '';
            const issueCount = (output.match(/Module \d+:/g) || []).length;
            showStatus(statusEl, 'error', `Found ${issueCount} slide(s) with missing properties. Check console for details.`);
            console.log('Content validation issues:\n', output);
        } else {
            showStatus(statusEl, 'success', 'All slides have required properties.');
        }
    } catch (error) {
        btn.disabled = false;
        btn.textContent = 'Validate Content';
        showStatus(statusEl, 'error', `Error: ${error.message}`);
        console.error('Validation error:', error);
    }
}

// Execute Step 1: Generate Modules
async function executeStep1() {
    // Check if already complete - don't regenerate unless user explicitly wants to
    if (stepStatus[1].complete) {
        showModal(
            'Regenerate Segments?',
            'Segment files are already generated. Regenerate them?',
            () => executeStep1Confirmed()
        );
        return;
    }
    executeStep1Confirmed();
}

async function executeStep1Confirmed() {
    const statusEl = document.getElementById('step-1-status');
    const progressEl = document.getElementById('step-1-progress');
    const progressBar = document.getElementById('step-1-progress-bar');
    const progressInfo = progressEl ? progressEl.querySelector('.progress-info') : null;
    const btn = document.getElementById('step-1-btn');

    btn.disabled = true;
    btn.textContent = 'Generating...';

    const modeText = currentAudioMode === 'per-module' ? 'scene-based modules' : 'slide-based modules';
    showProgressOverlay(1, 'Step 1: Generate Segment Files', `Generating ${modeText}...`, 'indeterminate');

    if (progressEl) {
        progressEl.style.display = 'block';
        progressEl.style.borderColor = 'var(--primary)';
    }
    if (progressBar) {
        progressBar.className = 'segment-progress-bar indeterminate';
        progressBar.style.width = '40%';
    }
    if (progressInfo) {
        progressInfo.textContent = `Generating ${modeText}...`;
        progressInfo.style.color = 'var(--primary)';
    }
    if (statusEl) {
        statusEl.style.display = 'none';
    }

    try {
        const response = await fetch('/api/generate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course: currentCourseId,
                audioMode: currentAudioMode
            })
        });

        const data = await response.json();

        if (data.error) {
            if (progressBar) {
                progressBar.className = 'segment-progress-bar error';
                progressBar.style.width = '100%';
            }
            if (progressInfo) {
                progressInfo.textContent = `Error: ${data.error}`;
                progressInfo.style.color = 'var(--error)';
            }
            if (progressEl) progressEl.style.borderColor = 'var(--error)';
            showStatus(statusEl, 'error', `Error: ${data.error}`);
            if (statusEl) statusEl.style.display = 'block';
            checkAllSteps().then(() => updateUI());
        } else {
            if (progressBar) {
                progressBar.className = 'segment-progress-bar success';
                progressBar.style.width = '100%';
            }
            const successMsg = currentAudioMode === 'per-module'
                ? 'Scene-based modules generated! Uses pre-built Intro/Diagram/Recap components.'
                : 'Slide-based modules (ModuleX.tsx) generated successfully!';
            if (progressInfo) {
                progressInfo.textContent = 'Done!';
                progressInfo.style.color = 'var(--success)';
            }
            if (progressEl) progressEl.style.borderColor = 'var(--success)';
            showStatus(statusEl, 'success', successMsg);
            if (statusEl) statusEl.style.display = 'block';

            await checkAllSteps();
            updateUI();

            if (!stepStatus[2].complete) {
                setTimeout(() => goToStep(2), 2000);
            }
        }
    } catch (error) {
        if (progressBar) {
            progressBar.className = 'segment-progress-bar error';
            progressBar.style.width = '100%';
        }
        if (progressInfo) {
            progressInfo.textContent = `Error: ${error.message}`;
            progressInfo.style.color = 'var(--error)';
        }
        if (progressEl) progressEl.style.borderColor = 'var(--error)';
        showStatus(statusEl, 'error', `Error: ${error.message}`);
        if (statusEl) statusEl.style.display = 'block';
        checkAllSteps().then(() => updateUI());
    } finally {
        hideProgressOverlay();
        btn.disabled = false;
        btn.textContent = 'Generate Segment Files';
    }
}

// Execute Step 2: Generate Audio - with cost preview
async function executeStep2() {
    // REMOVED: Step locking check - steps are always accessible
    // Use workflow status to show what will be generated
    if (!workflowStatus || !workflowStatus.modules) {
        await checkAllSteps();
    }
    
    let totalSlides = 0;
    let existingAudio = 0;
    let missingAudio = 0;
    
    if (workflowStatus && workflowStatus.modules) {
        workflowStatus.modules.forEach(mod => {
            if (mod.audioFiles) {
                mod.audioFiles.forEach(af => {
                    totalSlides++;
                    if (af.exists && af.size > 0) {
                        existingAudio++;
                    } else {
                        missingAudio++;
                    }
                });
            }
        });
    }
    
    // If all audio exists, warn about regeneration costs
    if (missingAudio === 0 && existingAudio > 0) {
        showModal(
            'All Audio Already Exists',
            `All ${existingAudio} audio files already exist. No new files will be generated (cost: $0).\n\nTo regenerate specific files, use "Generate Single Audio" with "Force regenerate" checked.`,
            () => {
                showToast(`No files to generate. Use single audio generation to replace specific files.`, 'info');
            }
        );
        return;
    }
    
    // Show cost preview before generating
    const estimatedCost = (missingAudio * 0.015).toFixed(3); // Rough estimate: ~$0.015 per audio
    showModal(
        'Generate Missing Audio?',
        `Audio Status:\n- Existing: ${existingAudio} files (will be SKIPPED)\n- Missing: ${missingAudio} files (will be GENERATED)\n\nEstimated cost: ~$${estimatedCost}\n\nProceed with generation?`,
        () => executeStep2Confirmed()
    );
}

async function executeStep2Confirmed() {
    
    const statusEl = document.getElementById('step-2-status');
    const btn = document.getElementById('step-2-btn');
    const progressEl = document.getElementById('step-2-progress');
    
    btn.disabled = true;
    btn.textContent = 'Generating...';
    showStatus(statusEl, 'loading', 'Starting audio generation...');
    showProgressOverlay(2, 'Step 2: Generate Audio', 'Preparing...', 0);

    const progressBar = document.getElementById('step-2-progress-bar');
    const progressInfo = progressEl ? progressEl.querySelector('.progress-info') : null;
    if (progressEl) {
        progressEl.style.borderColor = 'var(--primary)';
        if (progressInfo) progressInfo.textContent = 'Preparing...';
        if (progressInfo) progressInfo.style.color = 'var(--primary)';
    }
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.className = 'segment-progress-bar';
    }

    try {
        const voiceSelector = document.getElementById('voice-selector');
        const selectedVoice = voiceSelector ? voiceSelector.value : 'andy';
        
        // Use streaming endpoint for progress updates (force: false = skip existing, never overwrite)
        const response = await fetch('/api/generate-and-measure-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                course: currentCourseId, 
                voice: selectedVoice,
                provider: currentVoiceProvider,
                force: false
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let totalSlides = 0;
        let generated = 0;
        let skipped = 0;
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        
                        switch (data.type) {
                            case 'start':
                                totalSlides = data.total || 0;
                                showStatus(statusEl, 'loading', `Generating audio for ${totalSlides} slides...`);
                                updateProgressOverlay(`Generating audio for ${totalSlides} slides...`, 0);
                                break;
                                
                            case 'module':
                                if (progressInfo) {
                                    progressInfo.textContent = `Module ${data.module}: ${data.title}`;
                                }
                                updateProgressOverlay(`Module ${data.module}: ${data.title}`, data.percent);
                                break;
                                
                            case 'generate':
                                generated++;
                                btn.textContent = `Generating ${data.current}/${data.total}...`;
                                showStatus(statusEl, 'loading', data.message);
                                if (data.percent !== undefined && progressBar) {
                                    progressBar.style.width = `${data.percent}%`;
                                }
                                updateProgressOverlay(data.message, data.percent);
                                if (progressInfo) {
                                    progressInfo.textContent = `Generating ${data.current}/${data.total}: ${data.slide}`;
                                }
                                break;
                                
                            case 'skip':
                                skipped++;
                                if (totalSlides > 0 && progressBar) {
                                    const progress = Math.round(((generated + skipped) / totalSlides) * 100);
                                    progressBar.style.width = `${progress}%`;
                                }
                                updateProgressOverlay(`Skipped ${data.slide} (already exists)`, totalSlides > 0 ? Math.round(((generated + skipped) / totalSlides) * 100) : undefined);
                                if (progressInfo) {
                                    progressInfo.textContent = `Skipped ${data.slide} (already exists)`;
                                }
                                break;
                                
                            case 'complete':
                                // Individual slide complete
                                break;
                                
                            case 'error':
                                console.error('Audio generation error:', data.message);
                                break;
                                
                            case 'done':
                                hideProgressOverlay();
                                if (data.success) {
                                    showStatus(statusEl, 'success', `Audio complete! Generated: ${generated}, Skipped: ${skipped}`);
                                    if (progressBar) {
                                        progressBar.style.width = '100%';
                                        progressBar.className = 'segment-progress-bar success';
                                    }
                                    if (progressInfo) {
                                        progressInfo.textContent = `Complete: ${generated} generated, ${skipped} skipped`;
                                        progressInfo.style.color = 'var(--success)';
                                    }
                                    if (progressEl) progressEl.style.borderColor = 'var(--success)';
                                } else {
                                    showStatus(statusEl, 'error', data.message || 'Audio generation failed');
                                    showToast('Run "Generate ALL Audio" again to generate only the remaining (missing) files.', 'info');
                                }
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsing SSE:', e);
                    }
                }
            }
        }
        
        // Refresh status and update UI
        await checkAllSteps();
        updateUI();
        
        // Auto-advance to next incomplete step
        if (!stepStatus[3].complete) {
            setTimeout(() => goToStep(3), 2000);
        }
        
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
        await checkAllSteps();
        updateUI();
    } finally {
        hideProgressOverlay();
        btn.disabled = false;
        btn.textContent = 'Generate Audio';
    }
}

// Execute Step 3: Measure Audio - no API cost, just local file measurement
async function executeStep3() {
    // This step has NO API cost - just reads local WAV files
    // Check if already complete
    if (stepStatus[3].complete) {
        showModal(
            'Re-measure Audio?',
            'Audio durations are already measured. Re-measure? (No cost - local file reading only)',
            () => executeStep3Confirmed()
        );
        return;
    }
    executeStep3Confirmed();
}

async function executeStep3Confirmed() {
    
    const statusEl = document.getElementById('step-3-status');
    const btn = document.getElementById('step-3-btn');
    const progressEl = document.getElementById('step-3-progress');
    const progressBar = document.getElementById('step-3-progress-bar');
    const progressInfo = progressEl ? progressEl.querySelector('.progress-info') : null;
    
    btn.disabled = true;
    btn.textContent = 'Measuring...';
    showStatus(statusEl, 'loading', 'Measuring audio durations...');
    showProgressOverlay(3, 'Step 3: Measure Audio', 'Measuring audio durations...', 'indeterminate');
    if (progressEl) progressEl.style.borderColor = 'var(--primary)';
    if (progressInfo) {
        progressInfo.textContent = 'Measuring audio durations...';
        progressInfo.style.color = 'var(--primary)';
    }
    if (progressBar) {
        progressBar.className = 'segment-progress-bar indeterminate';
        progressBar.style.width = '40%';
    }
    
    try {
        const response = await fetch(`/api/measure-audio?course=${currentCourseId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
            await checkAllSteps();
            updateUI();
        } else {
            showStatus(statusEl, 'success', 'Audio durations measured!');
            if (progressBar) {
                progressBar.className = 'segment-progress-bar success';
                progressBar.style.width = '100%';
            }
            if (progressInfo) {
                progressInfo.textContent = 'Complete – audio durations measured';
                progressInfo.style.color = 'var(--success)';
            }
            if (progressEl) progressEl.style.borderColor = 'var(--success)';
            await checkAllSteps();
            updateUI();
            if (!stepStatus[4].complete) {
                setTimeout(() => goToStep(4), 2000);
            }
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
        await checkAllSteps();
        updateUI();
    } finally {
        hideProgressOverlay();
        btn.disabled = false;
        btn.textContent = '2. Measure Audio';
    }
}

// Load modules for split audio selector
async function loadSplitModuleSelector() {
    const splitModuleSelector = document.getElementById('split-module-selector');
    if (!splitModuleSelector) return;
    
    if (!currentCourseId) {
        splitModuleSelector.innerHTML = '<option value="">Select a video first</option>';
        return;
    }
    
    try {
        const response = await fetch(`/api/modules?course=${currentCourseId}`);
        if (!response.ok) throw new Error('Failed to fetch modules');
        
        const data = await response.json();
        const modules = data.modules || [];
        
        splitModuleSelector.innerHTML = '<option value="">Select module...</option>';
        for (const mod of modules) {
            const option = document.createElement('option');
            option.value = mod.moduleNumber;
            option.textContent = `Module ${mod.moduleNumber}: ${mod.title || 'Untitled'}`;
            splitModuleSelector.appendChild(option);
        }
        
        // Update split button state when module or slide name changes
        const splitSlideName = document.getElementById('split-slide-name');
        if (splitSlideName) {
            const updateSplitButton = () => {
                const btn = document.getElementById('split-audio-btn');
                const fileInput = document.getElementById('split-audio-file-input');
                if (btn && fileInput) {
                    btn.disabled = !(splitModuleSelector.value && splitSlideName.value.trim() && fileInput.files[0]);
                }
            };
            splitModuleSelector.addEventListener('change', updateSplitButton);
            splitSlideName.addEventListener('input', updateSplitButton);
        }
    } catch (e) {
        console.error('Error loading modules for split selector:', e);
        splitModuleSelector.innerHTML = '<option value="">Error loading modules</option>';
    }
}

// Load slides for upload selector
async function loadUploadSlideSelector() {
    const selector = document.getElementById('upload-slide-selector');
    if (!selector) return;
    
    if (!currentCourseId) {
        selector.innerHTML = '<option value="">Select a video first</option>';
        return;
    }
    
    selector.innerHTML = '<option value="">Loading slides...</option>';
    
    try {
        const response = await fetch(`/api/modules?course=${currentCourseId}`);
        if (!response.ok) throw new Error('Failed to fetch modules');
        
        const data = await response.json();
        const modules = data.modules || [];
        
        let options = '<option value="">Select slide...</option>';
        for (const mod of modules) {
            // Fetch slide details for each module
            try {
                const slideResponse = await fetch(`/api/slide-statuses?course=${currentCourseId}&module=${mod.moduleNumber}`);
                if (!slideResponse.ok) continue;
                
                const slideData = await slideResponse.json();
                const slides = slideData.slides || [];
                
                for (const slide of slides) {
                    options += `<option value="${mod.moduleNumber}-${slide.name}">Module ${mod.moduleNumber}: ${slide.name}</option>`;
                }
            } catch (e) {
                console.error('Error loading slides for module', mod.moduleNumber, e);
            }
        }
        selector.innerHTML = options;
    } catch (e) {
        console.error('Error loading modules for upload selector:', e);
        selector.innerHTML = '<option value="">Error loading slides</option>';
    }
}

// Export scripts to text file for manual audio generation
async function exportScripts() {
    const courseId = currentCourseId || 'default';
    
    try {
        showToast('Preparing scripts export...', 'info');
        
        // Trigger download by navigating to the export URL
        const url = `/api/export-scripts?course=${encodeURIComponent(courseId)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const error = await response.json();
            showToast(`Export failed: ${error.error}`, 'error');
            return;
        }
        
        // Get the blob and create download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `scripts-${courseId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        showToast('Scripts exported successfully!', 'success');
    } catch (error) {
        showToast(`Export failed: ${error.message}`, 'error');
    }
}

// Current voice provider
let currentVoiceProvider = 'openai';

// Initialize voice settings on page load
async function initVoiceSettings() {
    try {
        const response = await fetch('/api/voice-settings');
        if (response.ok) {
            const settings = await response.json();
            currentVoiceProvider = settings.provider || 'openai';
            currentAudioMode = settings.audioMode || 'per-slide';
            
            // Update voice provider radio buttons
            const openaiRadio = document.getElementById('provider-openai');
            const runpodRadio = document.getElementById('provider-runpod');
            const minimaxRadio = document.getElementById('provider-minimax');
            if (openaiRadio) openaiRadio.checked = currentVoiceProvider === 'openai';
            if (runpodRadio) runpodRadio.checked = currentVoiceProvider === 'runpod';
            if (minimaxRadio) minimaxRadio.checked = currentVoiceProvider === 'minimax';
            updateProviderStyles();
            
            // Update audio mode radio buttons
            const slideRadio = document.getElementById('audio-mode-slide');
            const moduleRadio = document.getElementById('audio-mode-module');
            if (slideRadio) slideRadio.checked = currentAudioMode === 'per-slide';
            if (moduleRadio) moduleRadio.checked = currentAudioMode === 'per-module';
            updateAudioModeStyles();
            updateAudioModeInfo();
            
            // Show/hide scene components section
            const sceneSection = document.getElementById('scene-components-section');
            if (sceneSection) {
                sceneSection.style.display = currentAudioMode === 'per-module' ? 'block' : 'none';
                if (currentAudioMode === 'per-module') {
                    checkSceneComponents();
                }
            }
            
            // Load voices for current provider
            await loadVoicesForProvider(currentVoiceProvider);
        }
        
        // Also populate single audio module dropdown (async now)
        populateSingleAudioModules().catch(err => console.error('Failed to populate audio dropdowns:', err));
    } catch (error) {
        console.error('Failed to load voice settings:', error);
    }
}

// Handle provider change
async function handleProviderChange(provider) {
    currentVoiceProvider = provider;
    updateProviderStyles();
    
    // Save provider preference
    try {
        await fetch('/api/voice-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider })
        });
    } catch (error) {
        console.error('Failed to save provider:', error);
    }
    
    // Load voices for new provider
    await loadVoicesForProvider(provider);
}

// Update provider label styles
function updateProviderStyles() {
    const openaiLabel = document.getElementById('provider-openai-label');
    const runpodLabel = document.getElementById('provider-runpod-label');
    const minimaxLabel = document.getElementById('provider-minimax-label');
    
    if (openaiLabel) openaiLabel.style.borderColor = currentVoiceProvider === 'openai' ? 'var(--primary)' : 'var(--border)';
    if (runpodLabel) runpodLabel.style.borderColor = currentVoiceProvider === 'runpod' ? 'var(--primary)' : 'var(--border)';
    if (minimaxLabel) minimaxLabel.style.borderColor = currentVoiceProvider === 'minimax' ? 'var(--primary)' : 'var(--border)';
}

// Handle audio mode change (per-slide vs per-module)
function handleAudioModeChange(mode) {
    currentAudioMode = mode;
    updateAudioModeStyles();
    updateAudioModeInfo();
    
    // Show/hide scene components section
    const sceneSection = document.getElementById('scene-components-section');
    if (sceneSection) {
        sceneSection.style.display = mode === 'per-module' ? 'block' : 'none';
        if (mode === 'per-module') {
            checkSceneComponents();
        }
    }
    
    // Save preference
    try {
        fetch('/api/voice-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioMode: mode })
        });
    } catch (error) {
        console.error('Failed to save audio mode:', error);
    }
}

// Update audio mode label styles
function updateAudioModeStyles() {
    const slideLabel = document.getElementById('audio-mode-slide-label');
    const moduleLabel = document.getElementById('audio-mode-module-label');
    
    if (slideLabel) slideLabel.style.borderColor = currentAudioMode === 'per-slide' ? 'var(--primary)' : 'var(--border)';
    if (moduleLabel) moduleLabel.style.borderColor = currentAudioMode === 'per-module' ? 'var(--primary)' : 'var(--border)';
}

// Update audio mode info text
function updateAudioModeInfo() {
    const infoEl = document.getElementById('audio-mode-info');
    if (!infoEl) return;
    
    if (currentAudioMode === 'per-slide') {
        infoEl.innerHTML = '<strong>Per Slide:</strong> Uses generic animated slides. Good for most courses.';
        infoEl.style.background = 'rgba(59, 130, 246, 0.1)';
    } else {
        infoEl.innerHTML = '<strong>Per Module:</strong> Uses custom scene components (Intro, Diagram1-3, Recap). Requires pre-built scenes in course folder.';
        infoEl.style.background = 'rgba(16, 185, 129, 0.1)';
    }
}

// Check if course has pre-built scene components
async function checkSceneComponents() {
    const statusEl = document.getElementById('scene-components-status');
    if (!statusEl || !currentCourseId) return;
    
    statusEl.innerHTML = 'Checking for scene components...';
    
    try {
        const response = await fetch(`/api/check-scene-components?course=${currentCourseId}`);
        const data = await response.json();
        
        if (data.hasScenes) {
            courseHasSceneComponents = true;
            statusEl.innerHTML = `<span style="color: #10b981;">Found ${data.sceneCount} scene components for ${data.moduleCount} modules.</span>`;
        } else {
            courseHasSceneComponents = false;
            statusEl.innerHTML = `<span style="color: #f59e0b;">No scene components found. Per-module mode will use default scenes.</span>`;
        }
    } catch (error) {
        statusEl.innerHTML = `<span style="color: #ef4444;">Error checking scenes: ${error.message}</span>`;
    }
}

// Load voices for a provider
async function loadVoicesForProvider(provider) {
    try {
        const response = await fetch(`/api/voices?provider=${provider}`);
        if (!response.ok) throw new Error('Failed to load voices');
        
        const data = await response.json();
        const selector = document.getElementById('voice-selector');
        
        if (selector) {
            selector.innerHTML = '';
            
            data.voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.id;
                option.textContent = voice.isCustom ? 
                    `${voice.name} (Custom)` : 
                    `${voice.name}`;
                if (voice.id === data.defaultVoice) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load voices:', error);
        showToast('Failed to load voices', 'error');
    }
}

// Test the selected voice
async function testSelectedVoice() {
    const selector = document.getElementById('voice-selector');
    const statusEl = document.getElementById('voice-test-status');
    const audioEl = document.getElementById('voice-test-audio');
    
    if (!selector || !selector.value) {
        showToast('Please select a voice first', 'error');
        return;
    }
    
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<span style="color: var(--text-muted);">Testing voice...</span>';
    
    try {
        const response = await fetch('/api/voices/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                voiceId: selector.value,
                provider: currentVoiceProvider
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (result.audioData) {
                // Play the audio
                const audioSrc = `data:audio/wav;base64,${result.audioData}`;
                audioEl.src = audioSrc;
                audioEl.style.display = 'block';
                audioEl.play();
                statusEl.innerHTML = '<span style="color: var(--success);">Voice test successful! Playing audio...</span>';
            } else {
                statusEl.innerHTML = `<span style="color: var(--success);">${result.message || 'Voice is valid!'}</span>`;
            }
        } else {
            statusEl.innerHTML = `<span style="color: var(--error);">Test failed: ${result.error}</span>`;
        }
    } catch (error) {
        statusEl.innerHTML = `<span style="color: var(--error);">Test failed: ${error.message}</span>`;
    }
}

// Add a custom voice
async function addCustomVoice() {
    const idInput = document.getElementById('custom-voice-id');
    const nameInput = document.getElementById('custom-voice-name');
    const statusEl = document.getElementById('custom-voice-status');
    
    const voiceId = idInput.value.trim();
    const voiceName = nameInput.value.trim();
    
    if (!voiceId) {
        statusEl.innerHTML = '<span style="color: var(--error);">Voice ID is required</span>';
        return;
    }
    
    statusEl.innerHTML = '<span style="color: var(--text-muted);">Testing voice before adding...</span>';
    
    try {
        // First test the voice
        const testResponse = await fetch('/api/voices/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                voiceId: voiceId,
                provider: currentVoiceProvider
            })
        });
        
        const testResult = await testResponse.json();
        
        if (!testResult.success) {
            statusEl.innerHTML = `<span style="color: var(--error);">Voice test failed: ${testResult.error}</span>`;
            return;
        }
        
        // If test passes, add the voice
        const addResponse = await fetch('/api/voices/custom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: voiceId,
                name: voiceName || voiceId,
                provider: currentVoiceProvider
            })
        });
        
        const addResult = await addResponse.json();
        
        if (addResult.success) {
            statusEl.innerHTML = '<span style="color: var(--success);">Voice added successfully!</span>';
            idInput.value = '';
            nameInput.value = '';
            
            // Reload voices
            await loadVoicesForProvider(currentVoiceProvider);
            showToast('Custom voice added!', 'success');
        } else {
            statusEl.innerHTML = `<span style="color: var(--error);">${addResult.error}</span>`;
        }
    } catch (error) {
        statusEl.innerHTML = `<span style="color: var(--error);">Failed to add voice: ${error.message}</span>`;
    }
}

// Load slides for image upload selector
async function loadImageSlideSelector() {
    const selector = document.getElementById('image-slide-selector');
    if (!selector) return;
    
    if (!currentCourseId) {
        selector.innerHTML = '<option value="">Select a video first</option>';
        return;
    }
    
    selector.innerHTML = '<option value="">Loading slides...</option>';
    
    try {
        // Get all modules for the current course
        const response = await fetch(`/api/modules?course=${currentCourseId}`);
        if (!response.ok) {
            throw new Error(`Failed to load modules: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        selector.innerHTML = '<option value="">Select slide...</option>';
        
        if (!data.modules || data.modules.length === 0) {
            selector.innerHTML = '<option value="">No modules found</option>';
            return;
        }
        
        for (const mod of data.modules) {
            // Get slide details for this module
            const statusResponse = await fetch(`/api/slide-statuses?course=${currentCourseId}&module=${mod.moduleNumber}`);
            if (!statusResponse.ok) continue;
            
            const statusData = await statusResponse.json();
            
            // Add optgroup for module
            const optgroup = document.createElement('optgroup');
            optgroup.label = `Module ${mod.moduleNumber}: ${mod.title}`;
            
            for (const slide of statusData.slides) {
                // Only show content slides (not title or code)
                if (slide.type === 'content-single' || slide.type === 'content-two-card') {
                    const option = document.createElement('option');
                    option.value = `${mod.moduleNumber}-${slide.name}`;
                    const hasImage = slide.imageSrc && !slide.imageSrc.includes('placeholder');
                    option.textContent = `${slide.name}${hasImage ? ' [has image]' : ''}`;
                    optgroup.appendChild(option);
                }
            }
            
            if (optgroup.children.length > 0) {
                selector.appendChild(optgroup);
            }
        }
        
        if (selector.options.length === 1) {
            selector.innerHTML = '<option value="">No content slides found</option>';
        }
    } catch (error) {
        console.error('Failed to load slides for image selector:', error);
        selector.innerHTML = '<option value="">Failed to load slides</option>';
    }
}

// Handle image file upload
async function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const selector = document.getElementById('image-slide-selector');
    const statusEl = document.getElementById('image-upload-status');
    const slideValue = selector.value;
    
    if (!slideValue) {
        statusEl.innerHTML = '<span style="color: var(--error);">Please select a slide first.</span>';
        input.value = '';
        return;
    }
    
    const [moduleNumber, slideName] = slideValue.split('-');
    
    statusEl.innerHTML = `<span style="color: var(--primary);">Uploading ${file.name}...</span>`;
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('moduleNumber', moduleNumber);
    formData.append('slideName', slideName);
    formData.append('courseId', currentCourseId);
    
    try {
        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.error) {
            statusEl.innerHTML = `<span style="color: var(--error);">Error: ${data.error}</span>`;
        } else {
            statusEl.innerHTML = `<span style="color: var(--success);">Image uploaded: ${data.imageSrc}. Click "Generate Segment Files" to apply.</span>`;
            // Refresh the selector to show updated status
            await loadImageSlideSelector();
        }
    } catch (error) {
        statusEl.innerHTML = `<span style="color: var(--error);">Upload failed: ${error.message}</span>`;
    }
    
    input.value = '';
}

// Handle audio file upload
// Handle split audio file selection
function handleSplitAudioUpload(input) {
    const file = input.files[0];
    const moduleSelector = document.getElementById('split-module-selector');
    const slideNameInput = document.getElementById('split-slide-name');
    const splitBtn = document.getElementById('split-audio-btn');
    
    if (!file) {
        if (splitBtn) splitBtn.disabled = true;
        return;
    }
    
    const statusEl = document.getElementById('split-audio-status');
    statusEl.style.display = 'block';
    statusEl.innerHTML = `<span style="color: var(--primary);">Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>`;
    
    // Enable split button if module and slide name are provided
    if (splitBtn && moduleSelector && slideNameInput) {
        splitBtn.disabled = !(moduleSelector.value && slideNameInput.value.trim());
    }
}

// Split audio file into chunks
async function splitAudioFile() {
    const fileInput = document.getElementById('split-audio-file-input');
    const file = fileInput.files[0];
    const moduleSelector = document.getElementById('split-module-selector');
    const slideNameInput = document.getElementById('split-slide-name');
    const chunkSizeInput = document.getElementById('split-chunk-size');
    const statusEl = document.getElementById('split-audio-status');
    const resultsEl = document.getElementById('split-audio-results');
    const splitBtn = document.getElementById('split-audio-btn');
    
    if (!file) {
        showToast('Please select an audio file first', 'error');
        return;
    }
    
    if (!moduleSelector.value) {
        showToast('Please select a module', 'error');
        return;
    }
    
    if (!slideNameInput.value.trim()) {
        showToast('Please enter a slide name', 'error');
        return;
    }
    
    const moduleNumber = moduleSelector.value;
    const slideName = slideNameInput.value.trim();
    const chunkSize = parseInt(chunkSizeInput.value) || 10;
    const courseId = currentCourseId || 'default';
    const autoCreateSlides = document.getElementById('auto-create-slides').checked;
    
    // Disable button and show loading
    splitBtn.disabled = true;
    splitBtn.textContent = 'Splitting...';
    statusEl.style.display = 'block';
    statusEl.innerHTML = `<span style="color: var(--primary);">Splitting audio file into ${chunkSize}-second chunks...</span>`;
    resultsEl.style.display = 'none';
    document.getElementById('split-audio-actions').style.display = 'none';
    
    try {
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('chunkSize', chunkSize);
        formData.append('courseId', courseId);
        formData.append('moduleNumber', moduleNumber);
        formData.append('slideName', slideName);
        formData.append('autoCreateSlides', autoCreateSlides);
        
        const response = await fetch('/api/split-audio', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to split audio');
        }
        
        // Show success
        statusEl.innerHTML = `<span style="color: var(--success);">✓ Successfully split audio into ${data.chunks.length} chunks!</span>`;
        
        // Show results
        resultsEl.style.display = 'block';
        let resultsHtml = `
            <div style="margin-top: 12px; padding: 12px; background: var(--surface-light); border-radius: 8px; border: 1px solid var(--border);">
                <strong style="display: block; margin-bottom: 8px;">Generated Files:</strong>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                    ${data.chunks.map(chunk => `<li>${chunk}</li>`).join('')}
                </ul>
        `;
        
        if (data.slidesCreated) {
            resultsHtml += `
                <div style="margin-top: 12px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; font-size: 12px; color: var(--success);">
                    <strong>✓ Auto-created ${data.slidesCreated} slides in moduleContent.ts</strong>
                </div>
            `;
            // Show action buttons
            document.getElementById('split-audio-actions').style.display = 'block';
        } else if (data.warning) {
            resultsHtml += `
                <div style="margin-top: 12px; padding: 8px; background: rgba(245, 158, 11, 0.1); border-radius: 6px; font-size: 12px; color: var(--warning);">
                    <strong>⚠ ${data.warning}</strong>
                </div>
            `;
        } else {
            resultsHtml += `
                <div style="margin-top: 12px; padding: 8px; background: rgba(99, 102, 241, 0.1); border-radius: 6px; font-size: 12px; color: var(--text-muted);">
                    <strong>Next steps:</strong> Add slides to moduleContent.ts for each chunk, then extract word timings.
                </div>
            `;
        }
        
        resultsHtml += `</div>`;
        resultsEl.innerHTML = resultsHtml;
        
        showToast(`Successfully created ${data.chunks.length} audio chunks${data.slidesCreated ? ` and ${data.slidesCreated} slides` : ''}`, 'success');
        
        // Reset file input
        fileInput.value = '';
        splitBtn.disabled = true;
        splitBtn.textContent = 'Split Audio';
        
    } catch (error) {
        console.error('Split audio error:', error);
        statusEl.innerHTML = `<span style="color: var(--error);">✗ Error: ${error.message}</span>`;
        showToast(`Failed to split audio: ${error.message}`, 'error');
        splitBtn.disabled = false;
        splitBtn.textContent = 'Split Audio';
    }
}

// Regenerate modules from moduleContent.ts
async function regenerateModules() {
    const btn = document.getElementById('regenerate-modules-btn');
    const statusEl = document.getElementById('split-audio-actions-status');
    const moduleSelector = document.getElementById('split-module-selector');
    const moduleNumber = moduleSelector ? moduleSelector.value : null;
    
    btn.disabled = true;
    btn.textContent = 'Regenerating...';
    statusEl.textContent = 'Regenerating module files...';
    
    try {
        const response = await fetch('/api/regenerate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                moduleRange: moduleNumber ? moduleNumber.toString() : undefined,
                courseId: currentCourseId 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to regenerate modules');
        }
        
        statusEl.innerHTML = `<span style="color: var(--success);">✓ Modules regenerated successfully!</span>`;
        showToast('Modules regenerated successfully', 'success');
        
        // Refresh workflow status
        await checkAllSteps();
    } catch (error) {
        console.error('Regenerate modules error:', error);
        statusEl.innerHTML = `<span style="color: var(--error);">✗ Error: ${error.message}</span>`;
        showToast(`Failed to regenerate modules: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Regenerate Modules';
    }
}

// Extract word timings
async function extractTimings() {
    const btn = document.getElementById('extract-timings-btn');
    const statusEl = document.getElementById('split-audio-actions-status');
    const moduleSelector = document.getElementById('split-module-selector');
    const moduleNumber = moduleSelector ? moduleSelector.value : null;
    
    btn.disabled = true;
    btn.textContent = 'Extracting...';
    statusEl.textContent = 'Extracting word timings (this may take a few minutes)...';
    
    try {
        // Get selected method
        const methodSelector = document.getElementById('timing-method-selector');
        const method = methodSelector ? methodSelector.value : 'gentle';
        
        const response = await fetch('/api/extract-timings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                moduleRange: moduleNumber ? moduleNumber.toString() : undefined,
                courseId: currentCourseId,
                method: method
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to extract timings');
        }
        
        statusEl.innerHTML = `<span style="color: var(--success);">✓ Word timings extracted successfully!</span>`;
        showToast('Word timings extracted successfully', 'success');
        
        // Refresh workflow status
        await checkAllSteps();
    } catch (error) {
        console.error('Extract timings error:', error);
        statusEl.innerHTML = `<span style="color: var(--error);">✗ Error: ${error.message}</span>`;
        showToast(`Failed to extract timings: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Extract Word Timings';
    }
}

// Measure audio durations
async function measureAudioDurations() {
    const btn = document.getElementById('measure-audio-btn');
    const statusEl = document.getElementById('split-audio-actions-status');
    
    btn.disabled = true;
    btn.textContent = 'Measuring...';
    statusEl.textContent = 'Measuring audio durations...';
    
    try {
        const response = await fetch('/api/measure-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course: currentCourseId })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to measure audio');
        }
        
        statusEl.innerHTML = `<span style="color: var(--success);">✓ Audio durations measured successfully!</span>`;
        showToast('Audio durations measured successfully', 'success');
        
        // Refresh workflow status
        await checkAllSteps();
    } catch (error) {
        console.error('Measure audio error:', error);
        statusEl.innerHTML = `<span style="color: var(--error);">✗ Error: ${error.message}</span>`;
        showToast(`Failed to measure audio: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Measure Audio Durations';
    }
}

async function handleAudioUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const selector = document.getElementById('upload-slide-selector');
    const statusEl = document.getElementById('upload-status');
    const slideValue = selector.value;
    
    if (!slideValue) {
        statusEl.innerHTML = '<span style="color: var(--error);">Please select a slide first.</span>';
        input.value = '';
        return;
    }
    
    const [moduleNumber, slideName] = slideValue.split('-');
    const targetFileName = `module${moduleNumber}-${slideName}.wav`;
    
    statusEl.innerHTML = `<span style="color: var(--primary);">Uploading ${file.name}...</span>`;
    
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('moduleNumber', moduleNumber);
    formData.append('slideName', slideName);
    formData.append('courseId', currentCourseId);
    
    try {
        const response = await fetch('/api/upload-audio', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.error) {
            statusEl.innerHTML = `<span style="color: var(--error);">Error: ${data.error}</span>`;
        } else {
            statusEl.innerHTML = `<span style="color: var(--success);">Saved to ${currentCourseId}/${targetFileName}</span>`;
            // Refresh step status
            await checkAllSteps();
            updateUI();
        }
    } catch (error) {
        statusEl.innerHTML = `<span style="color: var(--error);">Upload failed: ${error.message}</span>`;
    }
    
    input.value = '';
}

// Validate and convert audio files (fix MP3s renamed to .wav) - with streaming progress
async function validateAudio() {
    const statusEl = document.getElementById('validate-audio-status');
    const btn = document.getElementById('validate-audio-btn');
    const measureBtn = document.getElementById('step-3-btn');
    const measureHint = document.getElementById('measure-hint');
    
    btn.disabled = true;
    btn.textContent = 'Validating...';
    statusEl.style.display = 'block';
    statusEl.innerHTML = `
        <div style="margin-bottom: 8px;">Scanning audio files...</div>
        <div class="progress-bar-container" style="height: 8px; background: var(--surface); border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
            <div id="validate-progress-bar" style="height: 100%; width: 0%; background: var(--primary); transition: width 0.3s ease;"></div>
        </div>
        <div id="validate-current-file" style="font-size: 12px; color: var(--text-muted);"></div>
    `;

    try {
        const response = await fetch('/api/validate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let converted = 0;
        let total = 0;
        let success = false;
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                
                try {
                    const data = JSON.parse(line.slice(6));
                    const progressBar = document.getElementById('validate-progress-bar');
                    const currentFile = document.getElementById('validate-current-file');
                    
                    if (data.type === 'start') {
                        if (currentFile) currentFile.textContent = data.message;
                    } else if (data.type === 'info') {
                        if (currentFile) currentFile.textContent = data.message;
                        if (data.total) total = data.total;
                    } else if (data.type === 'progress') {
                        if (progressBar) progressBar.style.width = `${data.percent}%`;
                        if (currentFile) currentFile.textContent = data.message;
                    } else if (data.type === 'done') {
                        success = data.success;
                        converted = data.converted || 0;
                        total = data.total || 0;
                        if (progressBar) progressBar.style.width = '100%';
                    } else if (data.type === 'error') {
                        throw new Error(data.message);
                    }
                } catch (parseError) {
                    console.error('Failed to parse SSE data:', parseError);
                }
            }
        }
        
        btn.disabled = false;
        btn.textContent = '1. Validate Audio';
        
        if (success) {
            // Enable measure button on successful validation
            if (measureBtn) {
                measureBtn.disabled = false;
                measureBtn.title = 'Measure audio durations';
            }
            if (measureHint) {
                measureHint.style.display = 'none';
            }
            
            if (converted > 0) {
                showStatus(statusEl, 'success', `Validated ${total} files, converted ${converted} to WAV. Now click "Measure Audio".`);
            } else {
                showStatus(statusEl, 'success', `All ${total} audio files are valid WAV format. Click "Measure Audio" to continue.`);
            }
        } else {
            showStatus(statusEl, 'error', 'Validation failed. Check console for details.');
        }
    } catch (error) {
        btn.disabled = false;
        btn.textContent = '1. Validate Audio';
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Execute Step 4: Extract Timings with progress tracking
async function executeStep4() {
    // Check if step is locked
    if (stepStatus[4].locked) {
        showToast('Step 4 is locked. Complete Step 3 first.', 'warning');
        goToStep(3);
        return;
    }
    // Use workflow status to show what will be extracted
    if (!workflowStatus || !workflowStatus.modules) {
        await checkAllSteps();
    }
    
    let totalSlides = 0;
    let hasTimings = 0;
    let needsTimings = 0;
    
    if (workflowStatus && workflowStatus.modules) {
        workflowStatus.modules.forEach(mod => {
            if (mod.audioFiles) {
                mod.audioFiles.forEach(af => {
                    if (af.exists && af.size > 0) {
                        totalSlides++;
                        // Check if this slide has timings (simplified check)
                        if (mod.timingsExtracted) {
                            hasTimings++;
                        } else {
                            needsTimings++;
                        }
                    }
                });
            }
        });
    }
    
    // Get selected method
    const methodSelector = document.getElementById('timing-method-selector');
    const method = methodSelector ? methodSelector.value : 'gentle';
    const methodName = method === 'gentle' ? 'Gentle' : 'Whisper';
    
    // If all timings exist, warn about re-extraction
    if (stepStatus[4].complete) {
        const costMsg = method === 'whisper' 
            ? `Re-extracting will use the Whisper API and incur costs (~$0.006/minute of audio).`
            : `Re-extracting will use Gentle forced alignment (requires Gentle server running).`;
        showModal(
            'Timings Already Extracted',
            `Word timings are already extracted for all ${hasTimings} slides.\n\n${costMsg}\n\nTo fix specific slides, consider using single audio regeneration instead.`,
            () => executeStep4Confirmed()
        );
        return;
    }
    
    // Show estimate before extraction
    const estimatedMinutes = needsTimings * 0.5; // ~30 sec average per slide
    let estimateMsg = `This uses ${methodName} to extract word-level timing from audio.\n\nSlides to process: ${needsTimings}\nEstimated time: ${Math.ceil(estimatedMinutes)} minutes`;
    if (method === 'whisper') {
        const estimatedCost = (estimatedMinutes * 0.006).toFixed(3);
        estimateMsg += `\nEstimated cost: ~$${estimatedCost}`;
    } else {
        estimateMsg += `\n(Requires Gentle server running at http://localhost:8765)`;
    }
    estimateMsg += `\n\nProceed?`;
    showModal(
        'Extract Word Timings?',
        estimateMsg,
        () => executeStep4Confirmed()
    );
}

async function executeStep4Confirmed() {
    
    const statusEl = document.getElementById('step-4-status');
    const btn = document.getElementById('step-4-btn');
    
    btn.disabled = true;
    btn.textContent = 'Extracting...';

    const progressEl = document.getElementById('step-4-progress');
    const progressInfo = progressEl ? progressEl.querySelector('.progress-info') : null;
    const progressBarEl = document.getElementById('step-4-progress-bar');
    const detailsEl = document.getElementById('step-4-details');
    if (progressEl) progressEl.style.borderColor = 'var(--primary)';
    if (progressInfo) {
        progressInfo.textContent = 'Starting...';
        progressInfo.style.color = 'var(--primary)';
    }
    if (progressBarEl) progressBarEl.style.width = '0%';
    if (detailsEl) {
        detailsEl.style.display = 'block';
        detailsEl.innerHTML = '';
    }

    const methodSelector = document.getElementById('timing-method-selector');
    const method = methodSelector ? methodSelector.value : 'gentle';
    const methodName = method === 'gentle' ? 'Gentle' : 'Whisper';
    showStatus(statusEl, 'loading', `Extracting word timings using ${methodName}... This may take 1-3 minutes per slide.`);
    showProgressOverlay(4, 'Step 4: Extract Word Timings', `Extracting word timings using ${methodName}...`, 0);
    
    let processedCount = 0;
    let totalCount = 0;
    const details = [];
    
    try {
        // Get selected method
        const methodSelector = document.getElementById('timing-method-selector');
        const method = methodSelector ? methodSelector.value : 'gentle';
        
        const response = await fetch('/api/extract-timings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course: currentCourseId, method: method })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        
                        switch (data.type) {
                            case 'start':
                            case 'progress':
                                updateProgressOverlay(data.message, undefined);
                                if (progressInfo) progressInfo.textContent = data.message;
                                break;
                                
                            case 'module':
                                updateProgressOverlay(`Module ${data.module}: ${data.title}`, undefined);
                                if (progressInfo) progressInfo.textContent = `Module ${data.module}: ${data.title}`;
                                details.push('[module] ' + (data.message || ''));
                                updateDetails();
                                break;
                                
                            case 'slide':
                                processedCount++;
                                if (data.total) totalCount = data.total;
                                const progress = totalCount ? (processedCount / totalCount) * 100 : Math.min(processedCount * 3, 90);
                                const slideMsg = `Processing: ${data.slide} (Module ${data.module})${totalCount ? ' – ' + processedCount + '/' + totalCount + ' slides' : ''}`;
                                updateProgressOverlay(slideMsg, progress);
                                if (progressInfo) {
                                    progressInfo.textContent = slideMsg;
                                }
                                if (progressBarEl) progressBarEl.style.width = `${progress}%`;
                                details.push('[slide] ' + (data.message || ''));
                                updateDetails();
                                break;
                                
                                case 'complete':
                                    details.push('[ok] ' + (data.message || ''));
                                    if (data.words && progressBarEl) {
                                        const progress = totalCount ? (processedCount / totalCount) * 100 : Math.min(processedCount * 5, 95);
                                        progressBarEl.style.width = `${progress}%`;
                                    }
                                    updateDetails();
                                    break;
                                
                            case 'warning':
                                details.push('[warn] ' + (data.message || ''));
                                updateDetails();
                                break;
                                
                            case 'summary':
                                details.push('[summary] ' + (data.message || ''));
                                updateDetails();
                                break;
                                
                            case 'error':
                                details.push('[error] ' + (data.message || ''));
                                updateDetails();
                                showStatus(statusEl, 'error', data.message);
                                break;
                                
                            case 'done':
                                hideProgressOverlay();
                                btn.disabled = false;
                                btn.textContent = 'Extract Word Timings';
                                if (data.success) {
                                    showStatus(statusEl, 'success', 'Word timings extracted successfully!');
                                    if (progressInfo) {
                                        progressInfo.textContent = 'Complete – ' + processedCount + ' slides processed';
                                        progressInfo.style.color = 'var(--success)';
                                    }
                                    if (progressBarEl) {
                                        progressBarEl.style.width = '100%';
                                        progressBarEl.className = 'segment-progress-bar success';
                                    }
                                    if (progressEl) progressEl.style.borderColor = 'var(--success)';
                                    details.push('[done] ' + (data.message || ''));
                                    updateDetails();
                                    await checkAllSteps();
                                    updateUI();
                                } else {
                                    showStatus(statusEl, 'error', data.message);
                                    await checkAllSteps();
                                    updateUI();
                                }
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e, line);
                    }
                }
            }
        }
    } catch (error) {
        hideProgressOverlay();
        btn.disabled = false;
        btn.textContent = 'Extract Word Timings';
        showStatus(statusEl, 'error', `Error: ${error.message}`);
        await checkAllSteps();
        updateUI();
    }
    
    function updateDetails() {
        if (detailsEl) {
            // Keep last 15 items for better visibility
            const recent = details.slice(-15);
            detailsEl.innerHTML = recent.map(d => `<div style="margin-bottom: 4px; padding: 4px 0; border-bottom: 1px solid var(--border);">${d}</div>`).join('');
            detailsEl.scrollTop = detailsEl.scrollHeight;
        }
    }
}

// Check if timings are already extracted
async function checkTimingsStatus() {
    try {
        const response = await fetch(`/api/check-timings?course=${currentCourseId}`);
        const data = await response.json();
        return data.hasTimings || false;
    } catch (error) {
        return false;
    }
}

// Progress overlay (all 4 steps) - avoids layout disruption
function showProgressOverlay(stepNum, title, message, percentOrIndeterminate) {
    const overlay = document.getElementById('step-progress-overlay');
    const titleEl = document.getElementById('step-progress-overlay-title');
    const messageEl = document.getElementById('step-progress-overlay-message');
    const barEl = document.getElementById('step-progress-overlay-bar');
    if (!overlay || !titleEl || !messageEl || !barEl) return;
    titleEl.textContent = title || 'Step ' + stepNum;
    messageEl.textContent = message || 'Preparing...';
    if (percentOrIndeterminate === 'indeterminate' || percentOrIndeterminate === undefined) {
        barEl.classList.add('indeterminate');
        barEl.style.width = '40%';
    } else {
        barEl.classList.remove('indeterminate');
        barEl.style.width = (typeof percentOrIndeterminate === 'number' ? percentOrIndeterminate : 0) + '%';
    }
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
}
function updateProgressOverlay(message, percent) {
    const messageEl = document.getElementById('step-progress-overlay-message');
    const barEl = document.getElementById('step-progress-overlay-bar');
    if (messageEl && message !== undefined) messageEl.textContent = message;
    if (barEl && typeof percent === 'number') {
        barEl.classList.remove('indeterminate');
        barEl.style.width = percent + '%';
    }
}
function hideProgressOverlay() {
    const overlay = document.getElementById('step-progress-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

// Utility function
function showStatus(element, type, message) {
    if (!element) return;
    element.textContent = message;
    element.className = `step-status ${type}`;
    element.style.display = 'block';
}

// Populate single audio slide dropdown (flat list like upload selector)
async function populateSingleAudioSlides() {
    const slideSelect = document.getElementById('single-audio-slide-selector');
    const uploadSelect = document.getElementById('upload-slide-selector');
    if (!slideSelect && !uploadSelect) return;
    
    if (!currentCourseId) {
        if (slideSelect) slideSelect.innerHTML = '<option value="">Select a video first</option>';
        if (uploadSelect) uploadSelect.innerHTML = '<option value="">Select a video first</option>';
        return;
    }
    
    // If workflowStatus not loaded, fetch it
    if (!workflowStatus || !workflowStatus.modules) {
        try {
            await checkAllSteps();
        } catch (error) {
            console.error('Failed to load workflow status for dropdowns:', error);
            if (slideSelect) slideSelect.innerHTML = '<option value="">Error loading slides</option>';
            if (uploadSelect) uploadSelect.innerHTML = '<option value="">Error loading slides</option>';
            return;
        }
    }
    
    if (slideSelect) slideSelect.innerHTML = '<option value="">Loading slides...</option>';
    if (uploadSelect) uploadSelect.innerHTML = '<option value="">Loading slides...</option>';
    
    let totalSlides = 0;
    let existingAudio = 0;
    let missingAudio = 0;
    
    const modules = (workflowStatus && workflowStatus.modules) ? workflowStatus.modules : [];
    
    // If no modules in workflowStatus, fetch from API using slide-statuses (more reliable)
    if (modules.length === 0) {
        try {
            const response = await fetch(`/api/modules?course=${currentCourseId}`);
            if (!response.ok) throw new Error('Failed to fetch modules');
            
            const data = await response.json();
            if (data.modules && data.modules.length > 0) {
                if (slideSelect) slideSelect.innerHTML = '<option value="">Select slide...</option>';
                if (uploadSelect) uploadSelect.innerHTML = '<option value="">Select slide...</option>';
                
                // Fetch slide details for each module using slide-statuses API (same as loadUploadSlideSelector)
                for (const mod of data.modules) {
                    try {
                        const slideResponse = await fetch(`/api/slide-statuses?course=${currentCourseId}&module=${mod.moduleNumber}`);
                        if (!slideResponse.ok) continue;
                        
                        const slideData = await slideResponse.json();
                        const slides = slideData.slides || [];
                        
                        for (const slide of slides) {
                            totalSlides++;
                            const optionText = `Module ${mod.moduleNumber}: ${slide.name}`;
                            const optionValue = `${mod.moduleNumber}:${slide.name}`;
                            
                            if (slideSelect) {
                                const option = document.createElement('option');
                                option.value = optionValue;
                                option.textContent = optionText;
                                slideSelect.appendChild(option);
                            }
                            
                            if (uploadSelect) {
                                const option = document.createElement('option');
                                option.value = optionValue;
                                option.textContent = optionText;
                                uploadSelect.appendChild(option);
                            }
                        }
                    } catch (e) {
                        console.error('Error loading slides for module', mod.moduleNumber, e);
                    }
                }
                return;
            }
        } catch (error) {
            console.error('Failed to fetch modules for dropdowns:', error);
            if (slideSelect) slideSelect.innerHTML = '<option value="">Error loading slides</option>';
            if (uploadSelect) uploadSelect.innerHTML = '<option value="">Error loading slides</option>';
            return;
        }
    }
    
    if (slideSelect) slideSelect.innerHTML = '<option value="">Select slide...</option>';
    if (uploadSelect) uploadSelect.innerHTML = '<option value="">Select slide...</option>';
    
    // Populate from workflowStatus.modules - use audioFiles if available, otherwise fetch slide names
    for (const m of modules) {
        if (m.audioFiles && m.audioFiles.length > 0) {
            // Use audioFiles array which has slide info
            m.audioFiles.forEach(slide => {
                totalSlides++;
                const option = document.createElement('option');
                option.value = `${m.moduleNumber}:${slide.name}`;
                const hasAudio = slide.exists && slide.size > 0;
                if (hasAudio) {
                    existingAudio++;
                    option.textContent = `Module ${m.moduleNumber}: ${slide.name} [has audio]`;
                    option.style.color = '#10b981';
                } else {
                    missingAudio++;
                    option.textContent = `Module ${m.moduleNumber}: ${slide.name} [MISSING]`;
                    option.style.color = '#ef4444';
                }
                if (slideSelect) slideSelect.appendChild(option);
                if (uploadSelect) {
                    const uploadOption = option.cloneNode(true);
                    uploadSelect.appendChild(uploadOption);
                }
            });
        } else {
            // If no audioFiles, fetch slides from slide-statuses API
            try {
                const slideResponse = await fetch(`/api/slide-statuses?course=${currentCourseId}&module=${m.moduleNumber}`);
                if (slideResponse.ok) {
                    const slideData = await slideResponse.json();
                    const slides = slideData.slides || [];
                    slides.forEach(slide => {
                        totalSlides++;
                        missingAudio++; // No audio files yet
                        const option = document.createElement('option');
                        option.value = `${m.moduleNumber}:${slide.name}`;
                        option.textContent = `Module ${m.moduleNumber}: ${slide.name} [MISSING]`;
                        option.style.color = '#ef4444';
                        if (slideSelect) slideSelect.appendChild(option);
                        if (uploadSelect) {
                            const uploadOption = option.cloneNode(true);
                            uploadSelect.appendChild(uploadOption);
                        }
                    });
                }
            } catch (e) {
                console.error('Error loading slides for module', m.moduleNumber, e);
            }
        }
    }
    
    // Update step 2 status text with summary
    const statusText = document.getElementById('step-2-status-text');
    if (statusText) {
        if (totalSlides === 0) {
            statusText.textContent = 'No slides found. Complete Step 1 first.';
            statusText.style.color = 'var(--text-muted)';
        } else if (missingAudio === 0) {
            statusText.innerHTML = `<span style="color: #10b981;">All ${existingAudio} audio files exist (no generation needed)</span>`;
        } else if (existingAudio === 0) {
            statusText.innerHTML = `<span style="color: #ef4444;">${missingAudio} audio files need to be generated</span>`;
        } else {
            statusText.innerHTML = `<span style="color: #10b981;">${existingAudio} exist</span> | <span style="color: #ef4444;">${missingAudio} missing</span> - Only missing files will be generated`;
        }
    }
}

// Legacy function for compatibility
async function populateSingleAudioModules() {
    await populateSingleAudioSlides();
    // Also ensure split module selector is loaded
    await loadSplitModuleSelector();
}

// Generate audio for single slide
async function generateSingleSlideAudio() {
    const slideSelect = document.getElementById('single-audio-slide-selector');
    const selectedValue = slideSelect?.value;
    const force = document.getElementById('single-audio-force')?.checked || false;
    
    if (!selectedValue) {
        showToast('Please select a slide', 'warning');
        return;
    }
    
    // Parse module:slide format
    const [moduleNumber, slideName] = selectedValue.split(':');
    if (!moduleNumber || !slideName) {
        showToast('Invalid slide selection', 'error');
        return;
    }
    
    const statusEl = document.getElementById('single-audio-status');
    if (statusEl) {
        statusEl.style.display = 'block';
        const providerName = currentVoiceProvider === 'openai' ? 'OpenAI' : 
                            currentVoiceProvider === 'minimax' ? 'MiniMax' : 
                            currentVoiceProvider === 'runpod' ? 'RunPod' : currentVoiceProvider;
        statusEl.innerHTML = `<span style="color: var(--text-muted);">Generating with ${providerName}... Module ${moduleNumber}, Slide: ${slideName}</span>`;
    }
    
    // Get selected voice
    const voiceSelector = document.getElementById('voice-selector');
    const selectedVoice = voiceSelector ? voiceSelector.value : 'onyx';
    
    try {
        const response = await fetch('/api/generate-audio-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                moduleNumber: parseInt(moduleNumber), 
                slideName,
                force,
                voice: selectedVoice,
                provider: currentVoiceProvider
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            if (statusEl) statusEl.innerHTML = `<span style="color: var(--error);">Error: ${data.error}</span>`;
            showToast(`Error: ${data.error}`, 'error');
        } else if (data.skipped) {
            if (statusEl) statusEl.innerHTML = '<span style="color: var(--warning);">Audio already exists. Check "Force regenerate" to overwrite.</span>';
            showToast('Audio already exists', 'info');
        } else {
            const sizeKB = data.size ? Math.round(data.size / 1024) : 0;
            if (statusEl) statusEl.innerHTML = `<span style="color: var(--success);">Audio generated: ${slideName} (${sizeKB}KB)</span>`;
            showToast(`Audio generated: ${slideName}`, 'success');
            
            // Refresh workflow status and slide list
            setTimeout(() => {
                checkAllSteps();
            }, 1000);
        }
    } catch (error) {
        if (statusEl) statusEl.innerHTML = `<span style="color: var(--error);">Error: ${error.message}</span>`;
        showToast(`Error: ${error.message}`, 'error');
    }
}
