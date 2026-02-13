// Slide-by-Slide Manager

let currentModuleNumber = null;
let modules = [];
let slides = [];
let currentCourseId = 'aws-pulumi';
let courses = [];

// Check if ready for next step
function checkReadyForNextStep() {
    const nextBtn = document.getElementById('next-to-processing-btn');
    if (!nextBtn) return;
    
    // Show button if we have slides (audio/timings will be generated in Video Processing)
    // The button is always available once slides exist - users can generate audio/timings in the next step
    if (slides.length > 0 && currentModuleNumber) {
        nextBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'none';
    }
}

// Navigate to Video Processing
function goToVideoProcessing() {
    if (!currentModuleNumber) {
        showToast('Please select a segment first', 'warning');
        return;
    }
    window.location.href = `processing-wizard.html?course=${currentCourseId}&module=${currentModuleNumber}`;
}

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentCourseId = urlParams.get('course') || 'aws-pulumi';
    const moduleParam = urlParams.get('module');
    
    loadCourses().then(() => {
        // Set course selector to current course
        const courseSelector = document.getElementById('course-selector');
        if (courseSelector) {
            courseSelector.value = currentCourseId;
        }
        
        loadModules().then(() => {
            if (moduleParam) {
                // Module specified in URL - use it
                currentModuleNumber = parseInt(moduleParam);
                const moduleSelector = document.getElementById('module-selector');
                if (moduleSelector) {
                    moduleSelector.value = currentModuleNumber;
                }
                loadSlides();
            } else if (modules.length > 0) {
                // No module in URL - use first module
                currentModuleNumber = modules[0].moduleNumber;
                document.getElementById('module-selector').value = currentModuleNumber;
                loadSlides();
            }
        });
    });
});

// Load courses
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        courses = data.courses || [];
        
        const selector = document.getElementById('course-selector');
        const noCoursesPlaceholder = document.getElementById('no-active-courses');
        const mainContent = document.getElementById('slide-manager-content');
        
        if (courses.length === 0) {
            // No active courses - show placeholder
            if (selector) selector.innerHTML = '<option value="">No active videos</option>';
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'block';
            if (mainContent) mainContent.style.display = 'none';
            currentCourseId = null;
        } else {
            // Has active courses
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            
            if (selector) {
                selector.innerHTML = courses.map(c => 
                    `<option value="${c.id}" ${c.id === currentCourseId ? 'selected' : ''}>${c.title}</option>`
                ).join('');
            }
            
            // Set current course if not set or not in list
            if (!currentCourseId || !courses.find(c => c.id === currentCourseId)) {
                currentCourseId = courses[0].id;
            }
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Change course
function changeCourse(courseId) {
    currentCourseId = courseId || 'aws-pulumi';
    currentModuleNumber = null;
    
    // Clear module selector
    const moduleSelector = document.getElementById('module-selector');
    moduleSelector.innerHTML = '<option value="">Loading modules...</option>';
    
    // Clear slides
    document.getElementById('slides-container').innerHTML = '<div class="loading-slide">Select a segment to view slides</div>';
    document.getElementById('module-summary').style.display = 'none';
    
    // Load modules for new course
    loadModules().then(() => {
        if (modules.length > 0) {
            currentModuleNumber = modules[0].moduleNumber;
            moduleSelector.value = currentModuleNumber;
            loadSlides();
        } else {
            moduleSelector.innerHTML = '<option value="">No segments in this video</option>';
        }
    });
}

// Load modules
async function loadModules() {
    try {
        const response = await fetch(`/api/modules?course=${currentCourseId}`);
        const data = await response.json();
        modules = data.modules || [];
        
        const selector = document.getElementById('module-selector');
        if (modules.length === 0) {
            selector.innerHTML = '<option value="">No modules in this course</option>';
        } else {
            selector.innerHTML = modules.map(m => 
                `<option value="${m.moduleNumber}">Module ${m.moduleNumber}: ${m.title}</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading modules:', error);
        const selector = document.getElementById('module-selector');
        selector.innerHTML = '<option value="">Error loading segments</option>';
    }
}

// Load slides for selected module
async function loadSlides() {
    const moduleNum = document.getElementById('module-selector').value;
    if (!moduleNum) return;
    
    currentModuleNumber = parseInt(moduleNum);
    const container = document.getElementById('slides-container');
    container.innerHTML = '<div class="loading-slide">Loading slides...</div>';
    
    try {
        // Get module content
        const moduleResponse = await fetch(`/api/modules/${moduleNum}`);
        const moduleData = await moduleResponse.json();
        
        // Get slide statuses
        const statusResponse = await fetch(`/api/slide-statuses?module=${moduleNum}&course=${currentCourseId}`);
        const statusData = await statusResponse.json();
        
        slides = statusData.slides || [];
        
        // Update module summary
        updateModuleSummary();
        
        // Render slides
        renderSlides();
        
        // Check if ready for next step (show button if slides exist)
        checkReadyForNextStep();
    } catch (error) {
        container.innerHTML = `<div class="status-message error show">Error loading slides: ${error.message}</div>`;
        checkReadyForNextStep(); // Hide button on error
    }
}

// Update module summary
function updateModuleSummary() {
    const module = modules.find(m => m.moduleNumber === currentModuleNumber);
    if (module) {
        document.getElementById('module-title').textContent = `Segment ${module.moduleNumber}: ${module.title}`;
        document.getElementById('module-summary').style.display = 'block';
    }
    
    const total = slides.length;
    const audioComplete = slides.filter(s => s.audioStatus === 'complete').length;
    const timingsComplete = slides.filter(s => s.timingsStatus === 'complete').length;
    const moduleComplete = total > 0 ? Math.round(((audioComplete + timingsComplete) / (total * 2)) * 100) : 0;
    
    document.getElementById('total-slides').textContent = total;
    document.getElementById('audio-complete').textContent = `${audioComplete}/${total}`;
    document.getElementById('timings-complete').textContent = `${timingsComplete}/${total}`;
    document.getElementById('module-complete').textContent = `${moduleComplete}%`;
}

// Render slides
function renderSlides() {
    const container = document.getElementById('slides-container');
    
    if (slides.length === 0) {
        container.innerHTML = '<div class="loading-slide">No slides found</div>';
        return;
    }
    
        // Sort slides: finalized first, then by status
        const sortedSlides = [...slides].sort((a, b) => {
            const aFinalized = a.audioStatus === 'complete' && a.timingsStatus === 'complete';
            const bFinalized = b.audioStatus === 'complete' && b.timingsStatus === 'complete';
            if (aFinalized && !bFinalized) return 1;
            if (!aFinalized && bFinalized) return -1;
            return 0;
        });
        
        container.innerHTML = `
        <div class="slide-list">
            ${sortedSlides.map((slide, index) => renderSlide(slide, index)).join('')}
        </div>
    `;
    
    // Show continue button after rendering slides
    checkReadyForNextStep();
}

// Render individual slide
function renderSlide(slide, index) {
    const audioBadge = getStatusBadge('Audio', slide.audioStatus, slide.audioSize);
    const timingsBadge = getStatusBadge('Timings', slide.timingsStatus);
    const moduleBadge = getStatusBadge('Module', slide.videoStatus);
    
    // Check if slide is finalized (audio and timings complete - module file is separate)
    const isFinalized = slide.audioStatus === 'complete' && slide.timingsStatus === 'complete';
    
    return `
        <div class="slide-card ${isFinalized ? 'finalized' : ''}" data-slide-name="${slide.name}">
            ${isFinalized ? '<div style="position: absolute; top: 12px; right: 12px; background: var(--success); color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">✓ FINALIZED</div>' : ''}
            <div class="slide-header">
                <div class="slide-title-section">
                    <div class="slide-name">${escapeHtml(slide.name)}</div>
                    <span class="slide-type">${slide.type}</span>
                    ${slide.title ? `<div style="margin-top: 8px; color: var(--text-secondary); font-size: 14px;">${escapeHtml(slide.title)}</div>` : ''}
                </div>
                <div class="slide-status-overview">
                    ${audioBadge}
                    ${timingsBadge}
                    ${moduleBadge}
                </div>
            </div>
            
            <div class="slide-script">
                <strong>Script:</strong> ${escapeHtml(slide.script.substring(0, 200))}${slide.script.length > 200 ? '...' : ''}
            </div>
            
            <div class="slide-actions">
                <div class="action-group">
                    <div class="action-group-label">Audio</div>
                    <div class="action-buttons">
                        ${slide.audioStatus === 'complete' 
                            ? `<button class="btn btn-secondary btn-small" onclick="regenerateAudio('${slide.name}')">🔄 Regenerate</button>`
                            : `<button class="btn btn-primary btn-small" onclick="generateAudio('${slide.name}')">🎵 Generate</button>`
                        }
                        ${slide.audioStatus === 'complete' 
                            ? `<button class="btn btn-secondary btn-small" onclick="playAudio('${slide.name}')">▶️ Play</button>`
                            : ''
                        }
                    </div>
                </div>
                
                <div class="action-group">
                    <div class="action-group-label">Word Timings</div>
                    <div class="action-buttons">
                        ${slide.timingsStatus === 'complete' 
                            ? `<button class="btn btn-secondary btn-small" onclick="regenerateTimings('${slide.name}')">🔄 Regenerate</button>`
                            : `<button class="btn btn-primary btn-small" onclick="generateTimings('${slide.name}')" ${slide.audioStatus !== 'complete' ? 'disabled' : ''}>⏱️ Extract</button>`
                        }
                    </div>
                </div>
                
                <div class="action-group">
                    <div class="action-group-label">Module File</div>
                    <div class="action-buttons">
                        ${slide.videoStatus === 'complete' 
                            ? `<button class="btn btn-secondary btn-small" onclick="regenerateModule()">🔄 Regenerate Module</button>`
                            : `<button class="btn btn-primary btn-small" onclick="generateModule()">📝 Generate Module</button>`
                        }
                        ${slide.videoStatus === 'complete' 
                            ? `<button class="btn btn-secondary btn-small" onclick="previewVideo('${slide.name}')">👁️ Preview</button>`
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get status badge HTML
function getStatusBadge(label, status, size = null) {
    let icon = '⏳';
    let className = 'pending';
    let text = 'Pending';
    
    if (status === 'complete') {
        icon = '✓';
        className = 'complete';
        text = 'Complete';
        if (size) {
            text += ` (${(size / 1024).toFixed(1)}KB)`;
        }
    } else if (status === 'missing') {
        icon = '✗';
        className = 'missing';
        text = 'Missing';
    }
    
    return `<div class="status-badge ${className}">
        <span>${icon}</span>
        <span>${label}: ${text}</span>
    </div>`;
}

// Generate audio for single slide
async function generateAudio(slideName) {
    const slide = slides.find(s => s.name === slideName);
    if (!slide) return;
    
    const statusEl = document.querySelector(`[data-slide-name="${slideName}"] .action-group:first-child`);
    const originalHTML = statusEl.innerHTML;
    
    statusEl.innerHTML = '<div class="loading">Generating audio... This may take 30-60 seconds.</div>';
    
    try {
        const voiceSelector = document.getElementById('voice-selector-slide-manager');
        const selectedVoice = voiceSelector ? voiceSelector.value : 'andy';
        
        const response = await fetch('/api/generate-audio-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                moduleNumber: currentModuleNumber,
                slideName: slideName,
                force: false,
                voice: selectedVoice
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
            statusEl.innerHTML = originalHTML;
        } else {
            showToast('Audio generated successfully!', 'success');
            // Reload slides to update status
            setTimeout(() => {
                loadSlides();
                checkReadyForNextStep();
            }, 2000);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        statusEl.innerHTML = originalHTML;
    }
}

// Regenerate audio for single slide
async function regenerateAudio(slideName) {
    showModal(
        'Regenerate Audio',
        `Regenerate audio for "${slideName}"? This will incur costs.`,
        () => {
            regenerateAudioConfirmed(slideName);
        }
    );
}

async function regenerateAudioConfirmed(slideName) {
    
    const slide = slides.find(s => s.name === slideName);
    if (!slide) return;
    
    const statusEl = document.querySelector(`[data-slide-name="${slideName}"] .action-group:first-child`);
    const originalHTML = statusEl.innerHTML;
    
    statusEl.innerHTML = '<div class="loading">Regenerating audio... This may take 30-60 seconds.</div>';
    
    try {
        const voiceSelector = document.getElementById('voice-selector-slide-manager');
        const selectedVoice = voiceSelector ? voiceSelector.value : 'andy';
        
        const response = await fetch('/api/generate-audio-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                moduleNumber: currentModuleNumber,
                slideName: slideName,
                force: true,
                voice: selectedVoice
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
            statusEl.innerHTML = originalHTML;
        } else {
            showToast('Audio regenerated successfully!', 'success');
            // Reload slides to update status
            setTimeout(() => {
                loadSlides();
                checkReadyForNextStep();
            }, 2000);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        statusEl.innerHTML = originalHTML;
    }
}

// Generate timings for single slide with progress
async function generateTimings(slideName) {
    const slide = slides.find(s => s.name === slideName);
    if (!slide || slide.audioStatus !== 'complete') {
        showToast('Audio must be generated first', 'warning');
        return;
    }
    
    const statusEl = document.querySelector(`[data-slide-name="${slideName}"] .action-group:nth-child(2)`);
    const originalHTML = statusEl.innerHTML;
    
    // Create progress display
    const progressHTML = `
        <div class="loading">
            <div>Extracting timings... (1-3 minutes)</div>
            <div id="timings-progress-${slideName}" style="margin-top: 8px; font-size: 12px; color: var(--text-muted);"></div>
        </div>
    `;
    statusEl.innerHTML = progressHTML;
    
    const progressEl = document.getElementById(`timings-progress-${slideName}`);
    
    try {
        const response = await fetch('/api/generate-timings-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                moduleNumber: currentModuleNumber,
                slideName: slideName
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
                        if (progressEl) {
                            progressEl.textContent = data.message || 'Processing...';
                        }
                        
                        if (data.type === 'done') {
                            if (data.success) {
                                // Reload slides to update status
                                setTimeout(() => {
                loadSlides();
                checkReadyForNextStep();
            }, 2000);
                            } else {
                                showToast(`Error: ${data.message}`, 'error');
                                statusEl.innerHTML = originalHTML;
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing SSE:', e);
                    }
                }
            }
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        statusEl.innerHTML = originalHTML;
    }
}

// Regenerate timings for single slide
async function regenerateTimings(slideName) {
    showModal(
        'Regenerate Timings',
        `Regenerate timings for "${slideName}"? This may take 1-3 minutes.`,
        () => {
            generateTimingsConfirmed(slideName);
        }
    );
}

async function generateTimingsConfirmed(slideName) {
    
    await generateTimings(slideName);
}

// Generate module file (includes all slides)
async function generateModule() {
    showModal(
        'Generate Module File',
        `Generate module file for Module ${currentModuleNumber}? This will include all slides. Existing file will be overwritten unless it contains // PRESERVE_MANUAL_EDITS.`,
        () => {
            generateModuleConfirmed();
        }
    );
}

async function generateModuleConfirmed() {
    
    try {
        const response = await fetch('/api/generate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course: currentCourseId,
                moduleRange: currentModuleNumber ? currentModuleNumber.toString() : undefined
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
        } else {
            showToast('Module file generated successfully!', 'success');
            setTimeout(() => {
                loadSlides();
                checkReadyForNextStep();
            }, 2000);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Regenerate module file
async function regenerateModule() {
    showModal(
        'Regenerate Module File',
        `Regenerate module file for Module ${currentModuleNumber}? The file will be overwritten unless it contains // PRESERVE_MANUAL_EDITS.`,
        () => {
            regenerateModuleConfirmed();
        }
    );
}

async function regenerateModuleConfirmed() {
    await generateModuleConfirmed();
}

// Preview video (placeholder)
async function previewVideo(slideName) {
    // Use location change instead of window.open to avoid popup blockers
    window.location.href = `http://localhost:3000?composition=module-${currentModuleNumber}`;
}

// Play audio
async function playAudio(slideName) {
    if (!currentCourseId) {
        showToast('No course selected', 'error');
        return;
    }
    
    // Audio files are stored in course-specific directories: public/audio/{courseId}/
    const audioUrl = `/audio/${currentCourseId}/module${currentModuleNumber}-${slideName}.wav`;
    const audio = new Audio(audioUrl);
    
    // Add error handling for better debugging
    audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e, 'URL:', audioUrl);
        showToast(`Could not play audio. File may not exist at: ${audioUrl}`, 'error');
    });
    
    audio.play().catch(e => {
        console.error('Audio play() failed:', e, 'URL:', audioUrl);
        showToast(`Could not play audio. Make sure the file exists at: ${audioUrl}`, 'error');
    });
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
