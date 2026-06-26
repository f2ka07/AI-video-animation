// Main application JavaScript

let modules = [];
let currentView = 'modules';
let workflowStatus = null;
let currentCourseId = 'aws-pulumi'; // Default course
let courses = [];
let contentFilter = 'all'; // 'all' | 'course' | 'shorts' | 'video'

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
                <button class="modal-btn modal-btn-primary" onclick="
                    this.closest('.modal-overlay').remove();
                    if (typeof onConfirm === 'function') onConfirm();
                ">Confirm</button>
            </div>
        </div>
    `;
    
    // Store callbacks
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
    
    // Close on overlay click
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
    const container = document.getElementById('toast-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'toast-container';
        newContainer.className = 'toast-container';
        document.body.appendChild(newContainer);
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
    
    // Auto-remove after duration
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
    loadCourses().then(() => {
        loadModules();
        loadWorkflowStatus();
    });
    
    // Refresh workflow status when switching to processing view
    const processingLink = document.querySelector('a[onclick*="processing"]');
    if (processingLink) {
        processingLink.addEventListener('click', () => {
            setTimeout(loadWorkflowStatus, 100);
        });
    }
});

// Filter courses by content type (for display)
function getFilteredCourses() {
    if (contentFilter === 'all') return courses;
    return courses.filter(c => (c.contentType || 'course') === contentFilter);
}

// Content type badge text for a course
function getContentTypeBadge(course) {
    const ct = course?.contentType || 'course';
    if (ct === 'shorts') return ' (Shorts)';
    if (ct === 'video') return ' (Video)';
    return '';
}

// Load courses
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        courses = data.courses || [];
        
        // Sync filter dropdown
        const filterEl = document.getElementById('content-type-filter');
        if (filterEl) filterEl.value = contentFilter;
        
        const filtered = getFilteredCourses();
        
        // Populate course selector
        const selector = document.getElementById('course-selector');
        const noCoursesPlaceholder = document.getElementById('no-active-courses');
        const modulesContainer = document.getElementById('modules-container');
        const pageHeader = document.querySelector('#modules-view .page-header');
        
        if (courses.length === 0) {
            // No active courses - show placeholder
            if (selector) selector.innerHTML = '<option value="">No active videos</option>';
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'block';
            if (modulesContainer) modulesContainer.style.display = 'none';
            if (pageHeader) pageHeader.style.display = 'none';
            currentCourseId = null;
        } else {
            // Has active courses - show normal UI
            if (noCoursesPlaceholder) noCoursesPlaceholder.style.display = 'none';
            if (modulesContainer) modulesContainer.style.display = 'block';
            if (pageHeader) pageHeader.style.display = 'block';
            
            if (selector) {
                selector.innerHTML = filtered.map(course => 
                    `<option value="${course.id}" ${course.id === currentCourseId ? 'selected' : ''}>${escapeHtml(course.title)}${getContentTypeBadge(course)}</option>`
                ).join('');
            }
            
            // Set current course if not set or not in filtered list
            if (!currentCourseId || !filtered.find(c => c.id === currentCourseId)) {
                currentCourseId = filtered.length > 0 ? filtered[0].id : (courses[0]?.id || null);
            }
        }
        // Do not call loadModules() here - init already calls it via .then() to avoid double fetch/race
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function applyContentTypeFilter() {
    const filterEl = document.getElementById('content-type-filter');
    contentFilter = filterEl ? filterEl.value : 'all';
    const filtered = getFilteredCourses();
    const selector = document.getElementById('course-selector');
    if (selector && courses.length > 0) {
        selector.innerHTML = filtered.map(course =>
            `<option value="${course.id}" ${course.id === currentCourseId ? 'selected' : ''}>${escapeHtml(course.title)}${getContentTypeBadge(course)}</option>`
        ).join('');
        if (!filtered.find(c => c.id === currentCourseId) && filtered.length > 0) {
            currentCourseId = filtered[0].id;
        }
    }
    loadModules();
}

// Change course
function changeCourse(courseId) {
    currentCourseId = courseId || 'aws-pulumi';
    loadModules();
    loadWorkflowStatus();
    closeDrawer();
}

// Drawer functions
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
}

// View switching
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const view = document.getElementById(`${viewName}-view`);
    if (view) {
        view.classList.add('active');
    }
    
    // Update active menu item
    document.querySelectorAll('.drawer-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event?.target?.closest('a')?.classList.add('active');
    
    currentView = viewName;
    
    // Populate course selector when showing create-module view
    if (viewName === 'create-module') {
        populateCreateModuleCourses();
    }
    
    // Load archived courses when showing history view
    if (viewName === 'history') {
        loadArchivedCourses();
    }
    // Sync Video/Shorts labels when showing Video tab
    if (viewName === 'create-video' && typeof updatePlannerType === 'function') {
        updatePlannerType();
    }
}

// Load archived courses for history view
async function loadArchivedCourses() {
    const container = document.getElementById('archived-courses-list');
    const noArchivedMsg = document.getElementById('no-archived-message');
    
    if (!container) return;
    
    try {
        const response = await fetch('/api/courses?status=archived');
        const data = await response.json();
        const archivedCourses = data.courses || [];
        
        if (archivedCourses.length === 0) {
            container.style.display = 'none';
            if (noArchivedMsg) noArchivedMsg.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        if (noArchivedMsg) noArchivedMsg.style.display = 'none';
        
        container.innerHTML = archivedCourses.map(course => {
            const archivedDate = course.archivedAt ? new Date(course.archivedAt).toLocaleDateString() : 'Unknown';
            return `
                <div class="card module-card" style="border-left: 4px solid var(--text-muted);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="margin-bottom: 8px;">${escapeHtml(course.title)}</h3>
                            <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 12px;">
                                ${escapeHtml(course.description)}
                            </p>
                            <div style="font-size: 12px; color: var(--text-muted);">
                                <span>Modules: ${course.moduleCount || 0}</span>
                                <span style="margin-left: 16px;">Archived: ${archivedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-actions" style="margin-top: 16px; display: flex; gap: 8px;">
                        <button class="btn btn-primary" onclick="restoreCourse('${course.id}')">
                            Restore
                        </button>
                        <button class="btn btn-secondary" onclick="viewArchivedCourse('${course.id}')">
                            View
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading archived courses:', error);
        container.innerHTML = '<div style="color: var(--error); padding: 20px;">Error loading archived courses</div>';
    }
}

// Restore an archived course
async function restoreCourse(courseId) {
    try {
        const response = await fetch(`/api/courses/${courseId}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
        } else {
            showToast(data.message || 'Course restored successfully!', 'success');
            // Reload courses list and archived list
            await loadCourses();
            await loadArchivedCourses();
        }
    } catch (error) {
        console.error('Error restoring course:', error);
        showToast(`Error restoring course: ${error.message}`, 'error');
    }
}

// View an archived course (read-only)
function viewArchivedCourse(courseId) {
    // Switch to the archived course temporarily
    currentCourseId = courseId;
    loadModules();
    showView('modules');
    showToast('Viewing archived course (read-only). Restore to make changes.', 'info');
}

// Archive the current course
async function archiveCurrentCourse() {
    if (!currentCourseId) {
        showToast('No course selected', 'error');
        return;
    }
    
    // Find current course name
    const currentCourse = courses.find(c => c.id === currentCourseId);
    const courseName = currentCourse ? currentCourse.title : currentCourseId;
    
    // Confirm before archiving
    if (!confirm(`Archive "${courseName}"?\n\nThis will remove it from the main dropdown. You can restore it from the Archived Videos section.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/courses/${currentCourseId}/archive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
        } else {
            showToast(data.message || 'Course archived successfully!', 'success');
            
            // Reload courses and switch to first available course
            await loadCourses();
            
            if (courses.length > 0) {
                currentCourseId = courses[0].id;
                changeCourse(currentCourseId);
            } else {
                // No active courses left, show history view
                showView('history');
            }
        }
    } catch (error) {
        console.error('Error archiving course:', error);
        showToast(`Error archiving course: ${error.message}`, 'error');
    }
}

// Load modules
async function loadModules() {
    const container = document.getElementById('modules-container');
    if (!container) return;
    container.innerHTML = '<div class="loading">Loading segments...</div>';

    try {
        // Fetch all modules (no course filter); timeout so UI does not hang if server is slow
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch('/api/modules', { signal: controller.signal }).finally(() => clearTimeout(timeoutId));
        const data = await response.json();
        modules = data.modules || [];
        
        // Update page header
        const titleHeader = document.getElementById('course-title-header');
        const descHeader = document.getElementById('course-description-header');
        if (titleHeader) {
            titleHeader.textContent = 'All Video Segments';
        }
        if (descHeader) {
            const totalModules = modules.length;
            const totalCourses = new Set(modules.map(m => m.courseId)).size;
            descHeader.textContent = `${totalModules} ${totalModules === 1 ? 'segment' : 'segments'} across ${totalCourses} ${totalCourses === 1 ? 'video' : 'videos'}`;
        }

        if (modules.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h3>No modules found</h3>
                    <p>No modules have been created yet. Create your first module to get started.</p>
                    <button class="btn btn-primary" onclick="showView('create-module')">Create First Segment</button>
                </div>
            `;
            return;
        }

        // Group modules by course
        const modulesByCourse = {};
        modules.forEach(module => {
            const courseId = module.courseId || 'uncategorized';
            if (!modulesByCourse[courseId]) {
                modulesByCourse[courseId] = [];
            }
            modulesByCourse[courseId].push(module);
        });

        // Sort modules within each course by number
        Object.keys(modulesByCourse).forEach(courseId => {
            modulesByCourse[courseId].sort((a, b) => a.moduleNumber - b.moduleNumber);
        });

        // Build HTML with course sections (filter by content type when filter is set)
        let html = '';
        for (const [courseId, courseModules] of Object.entries(modulesByCourse)) {
            const course = courses.find(c => c.id === courseId);
            const courseContentType = course?.contentType || 'course';
            if (contentFilter !== 'all' && courseContentType !== contentFilter) continue;
            const courseTitle = course ? course.title : (courseId === 'uncategorized' ? 'Uncategorized Modules' : courseId);
            const courseDescription = course ? course.description : '';
            const typeBadge = courseContentType === 'shorts' ? '<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; background: rgba(99, 102, 241, 0.2); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--primary);">Shorts</span>' : (courseContentType === 'video' ? '<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; background: rgba(34, 197, 94, 0.2); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--success);">Video</span>' : '');
            html += `
                <div class="course-section" style="margin-bottom: 32px;">
                    <div class="course-section-header" style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid var(--border);">
                        <h3 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 600; color: var(--text-primary);">${escapeHtml(courseTitle)}${typeBadge}</h3>
                        ${courseDescription ? `<p style="margin: 0; font-size: 14px; color: var(--text-secondary);">${escapeHtml(courseDescription)}</p>` : ''}
                        <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">
                            ${courseModules.length} ${courseModules.length === 1 ? 'segment' : 'segments'}
                            ${courseModules.filter(m => m.readyForRemotion).length > 0 ? 
                                ` • ${courseModules.filter(m => m.readyForRemotion).length} ready for Remotion` : ''}
                        </div>
                    </div>
                    <div class="modules-list">
                        ${courseModules.map(module => `
                            <div class="module-list-item">
                                <div class="module-number-badge">${module.moduleNumber}</div>
                                <div class="module-content">
                                    <div class="module-title-row">
                                        <div class="module-title-main">${escapeHtml(module.title)}</div>
                                        ${module.animationStatus === 'fullyAnimated' ? `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; font-size: 11px; font-weight: 600; color: var(--success); margin-left: 12px;">✓ Fully Animated (Ready)</span>` : (module.animationStatus === 'basicPreview' ? `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; font-size: 11px; font-weight: 600; color: var(--warning); margin-left: 12px;">⚠ Basic Preview (No Animations)</span>` : '')}
                                    </div>
                                    ${module.subtitle ? `<div class="module-subtitle">${escapeHtml(module.subtitle)}</div>` : ''}
                                    <div class="module-meta-row">
                                        <div class="module-meta-item">
                                            <span>📄</span>
                                            <span>${module.slideCount} ${module.slideCount === 1 ? 'slide' : 'slides'}</span>
                                        </div>
                                        <div class="module-meta-item">
                                            <span>📚</span>
                                            <span>Segment ${module.moduleNumber}</span>
                                        </div>
                                    </div>
                                    ${!module.readyForRemotion && module.stepStatus ? `
                                    <div style="margin-top: 12px; display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px;">
                                        <div style="display: flex; align-items: center; gap: 4px; color: ${module.stepStatus.segmentGenerated ? 'var(--success)' : 'var(--text-muted)'};">
                                            <span style="font-size: 16px;">${module.stepStatus.segmentGenerated ? '✓' : '○'}</span>
                                            <span>Segment</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 4px; color: ${module.stepStatus.audioGenerated ? 'var(--success)' : 'var(--text-muted)'};">
                                            <span style="font-size: 16px;">${module.stepStatus.audioGenerated ? '✓' : '○'}</span>
                                            <span>Audio ${module.audioComplete ? `(${module.audioComplete}/${module.audioTotal})` : ''}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 4px; color: ${module.stepStatus.audioMeasured ? 'var(--success)' : 'var(--text-muted)'};">
                                            <span style="font-size: 16px;">${module.stepStatus.audioMeasured ? '✓' : '○'}</span>
                                            <span>Measured</span>
                                        </div>
                                        ${module.stepStatus.timingsExtracted ? `
                                        <div style="display: flex; align-items: center; gap: 4px; color: var(--success);">
                                            <span style="font-size: 16px;">✓</span>
                                            <span>Timings</span>
                                        </div>
                                        ` : ''}
                                    </div>
                                    ` : ''}
                                </div>
                                <div class="module-actions" onclick="event.stopPropagation();">
                                    <button class="module-action-btn" onclick="openSlideManager(${module.moduleNumber}, '${module.courseId}')" title="Manage slides for this segment" style="background: var(--primary); color: white; margin-right: 8px;">
                                        <span>📋</span>
                                        <span>Manage Slides</span>
                                    </button>
                                    <button class="module-action-btn" onclick="openVideoProcessing(${module.moduleNumber}, '${module.courseId}')" title="Process video: generate audio, timings, and render" style="background: rgba(99, 102, 241, 1); color: white; margin-right: 8px;">
                                        <span>⚙️</span>
                                        <span>Video Processing</span>
                                    </button>
                                    ${module.animationStatus !== 'fullyAnimated' ? `
                                        <button class="module-action-btn" onclick="finalizeModule(${module.moduleNumber}, '${module.courseId}')" title="${module.animationStatus === 'basicPreview' ? 'Complete Step 4 (Word Timings) to enable animations' : 'Complete all steps to finalize this segment'}" style="background: ${module.animationStatus === 'basicPreview' ? 'var(--warning)' : 'var(--success)'}; color: white; margin-right: 8px;">
                                            <span>${module.animationStatus === 'basicPreview' ? '⏱️' : '✓'}</span>
                                            <span>${module.animationStatus === 'basicPreview' ? 'Add Animations' : 'Finalize'}</span>
                                        </button>
                                        <button class="module-action-btn" onclick="diagnoseModule(${module.moduleNumber})" title="Check what's preventing this segment from being fully animated" style="background: var(--warning); color: white; margin-right: 8px;">
                                            <span>🔍</span>
                                            <span>Diagnose</span>
                                        </button>
                                    ` : ''}
                                    <button class="module-action-btn" onclick="openModuleEditor(${module.moduleNumber})" title="Edit Segment">
                                        <span>✏️</span>
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (!html && contentFilter !== 'all') {
            const label = contentFilter === 'shorts' ? 'Shorts' : contentFilter === 'video' ? 'Videos' : 'Courses';
            html = `<div class="empty-state" style="padding: 40px 20px; text-align: center;">
                <p style="color: var(--text-secondary); margin-bottom: 16px;">No ${label} yet.</p>
                <p style="font-size: 14px; color: var(--text-muted);">Create ${contentFilter === 'shorts' ? 'shorts' : contentFilter === 'video' ? 'videos' : 'courses'} from the Video tab, or show All to see everything.</p>
            </div>`;
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading modules:', error);
        const msg = error.name === 'AbortError' ? 'Request timed out. Check the server and try again.' : error.message;
        if (container) container.innerHTML = `<div class="status-message error show">Error loading modules: ${escapeHtml(String(msg))}</div>`;
    }
}

function openModuleEditor(moduleNumber) {
    window.location.href = `module-editor.html?module=${moduleNumber}&course=${currentCourseId}`;
}

function openSlideManager(moduleNumber, courseId) {
    window.location.href = `slide-manager.html?module=${moduleNumber}&course=${courseId || currentCourseId}`;
}

// Open Video Processing wizard
function openVideoProcessing(moduleNumber, courseId) {
    window.location.href = `processing-wizard.html?course=${courseId || currentCourseId}&module=${moduleNumber}`;
}

// Finalize a module - run only missing steps (REQUIRES word timings for full animation)
async function finalizeModule(moduleNumber, courseId) {
    // First check what's already complete
    try {
        const statusResponse = await fetch(`/api/module-status?moduleNumber=${moduleNumber}&course=${courseId}`);
        const statusData = await statusResponse.json();
        
        const needsModules = !statusData.hasModuleFiles;
        const needsAudio = statusData.missingAudioFiles.length > 0;
        const needsMeasurement = statusData.missingAudioDurations.length > 0;
        const needsTimings = statusData.missingTimings && statusData.missingTimings.length > 0;
        
        // Check if already fully animated
        if (statusData.animationStatus === 'fullyAnimated') {
            showToast('Module is fully animated! All steps including word timings are complete.', 'success');
            setTimeout(() => loadModules(), 1000);
            return;
        }
        
        // If basic preview but missing timings, emphasize that timings are required
        if (statusData.animationStatus === 'basicPreview' && needsTimings) {
            showModal(
                'Add Animations (Word Timings Required)',
                `Module ${moduleNumber} is ready for basic preview but needs word timings for animations:\n\n` +
                `Missing word timings for ${statusData.missingTimings.length} slide(s):\n` +
                `- ${statusData.missingTimings.slice(0, 5).join('\n- ')}${statusData.missingTimings.length > 5 ? `\n...and ${statusData.missingTimings.length - 5} more` : ''}\n\n` +
                `⚠️ CRITICAL: Without word timings, animations will not sync with audio.\n` +
                `The module will work but animations will use even distribution instead of precise timing.\n\n` +
                `This step uses the Whisper API (~$0.006/minute of audio). Continue?`,
                () => {
                    finalizeModuleConfirmed(moduleNumber, courseId, needsModules, needsAudio, needsMeasurement, needsTimings);
                }
            );
            return;
        }
        
        const stepsNeeded = [];
        if (needsModules) stepsNeeded.push('1. Generate Module Files');
        if (needsAudio) stepsNeeded.push(`2. Generate ${statusData.missingAudioFiles.length} Missing Audio File(s)`);
        if (needsMeasurement) stepsNeeded.push(`3. Measure Audio Durations (${statusData.missingAudioDurations.length} missing)`);
        if (needsTimings) stepsNeeded.push(`4. Extract Word Timings (${statusData.missingTimings.length} missing) - REQUIRED for animations`);
        
        showModal(
            'Finalize Module',
            `Module ${moduleNumber} needs the following steps:\n\n${stepsNeeded.join('\n')}\n\n${needsAudio ? '⚠ Note: Only missing audio files will be generated (existing files will be skipped to avoid costs).' : ''}\n${needsTimings ? '⚠️ CRITICAL: Word timings are required for animations to sync properly with audio.' : ''}\n\nContinue?`,
            () => {
                finalizeModuleConfirmed(moduleNumber, courseId, needsModules, needsAudio, needsMeasurement, needsTimings);
            }
        );
    } catch (error) {
        // Fallback to running all steps if status check fails
        showModal(
        'Finalize Segment',
        `This will run all required steps for Segment ${moduleNumber}:\n\n1. Generate/Regenerate Segment Files\n2. Generate Missing Audio\n3. Measure Audio Durations\n4. Extract Word Timings (REQUIRED for animations)\n\nContinue?`,
            () => {
                finalizeModuleConfirmed(moduleNumber, courseId, true, true, true, true);
            }
        );
    }
}

// Finalize module - runs all required steps in the correct order
// CORRECT ORDER: Audio Generation → Audio Measurement → Word Timings → Module Generation
// Modules depend on audioDuration.ts (created by measurement step), so audio must come first
// Word timings are REQUIRED for animations to sync properly
async function finalizeModuleConfirmed(moduleNumber, courseId, needsModules, needsAudio, needsMeasurement, needsTimings = false) {
    
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--surface); border: 2px solid var(--primary); border-radius: 8px; padding: 16px; max-width: 400px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    statusDiv.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 12px;">Finalizing Module ${moduleNumber}</div>
        <div id="finalize-status" style="font-size: 14px; line-height: 1.6;"></div>
        <button onclick="this.parentElement.remove()" style="margin-top: 12px; padding: 6px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
    `;
    document.body.appendChild(statusDiv);
    const statusEl = document.getElementById('finalize-status');
    
    const updateStatus = (msg) => {
        if (statusEl) statusEl.innerHTML += `<div>${msg}</div>`;
    };
    
    try {
        // Step 1 & 2: Generate and measure audio FIRST (modules need audio durations)
        // Modules depend on audio durations, so we must generate/measure audio before modules
        if (needsAudio || needsMeasurement) {
            if (needsAudio && needsMeasurement) {
                // Use alternating workflow: generate -> measure for each slide
                // NOTE: Existing audio files are NOT regenerated to avoid costs
                updateStatus('Step 1-2: Generating missing audio and measuring durations...');
                updateStatus('(Existing audio files will be skipped to avoid costs)');
                
                const response = await fetch('/api/generate-and-measure-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        course: courseId, 
                        moduleRange: moduleNumber.toString() 
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }
                
                // Handle streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep incomplete line in buffer
                    
                    for (const line of lines) {
                        if (line.trim() && line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                if (data.type === 'module') {
                                    updateStatus(`Processing ${data.title}...`);
                                } else if (data.type === 'generate') {
                                    updateStatus(`Generating: ${data.slide}`);
                                } else if (data.type === 'measure') {
                                    updateStatus(`Measuring: ${data.slide}`);
                                } else if (data.type === 'duration') {
                                    updateStatus(`✓ ${data.slide}: ${data.duration}s`);
                                } else if (data.type === 'progress') {
                                    updateStatus(data.message);
                                } else if (data.type === 'summary') {
                                    updateStatus(data.message);
                                } else if (data.type === 'error') {
                                    updateStatus(`Error: ${data.message}`);
                                } else if (data.type === 'done') {
                                    if (data.success) {
                                        updateStatus('✓ Audio generation and measurement complete');
                                    } else {
                                        throw new Error(data.message);
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e, line);
                            }
                        }
                    }
                }
            } else if (needsAudio) {
                // Only generate audio
                updateStatus('Step 2: Generating missing audio files...');
                const audioResponse = await fetch('/api/generate-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ course: courseId, moduleRange: moduleNumber.toString() })
                });
                const audioData = await audioResponse.json();
                if (audioData.error) throw new Error(`Audio generation: ${audioData.error}`);
                updateStatus('✓ Missing audio files generated (existing files were skipped)');
            } else if (needsMeasurement) {
                // Only measure audio
                updateStatus('Step 3: Measuring audio durations...');
                const measureResponse = await fetch('/api/measure-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ course: courseId })
                });
                const measureData = await measureResponse.json();
                if (measureData.error) throw new Error(`Audio measurement: ${measureData.error}`);
                updateStatus('✓ Audio durations measured');
            }
        } else {
            updateStatus('⏭ Step 1-2: Audio files and durations already exist (skipped)');
        }
        
        // Step 3: Extract Word Timings (REQUIRED for animations)
        if (needsTimings) {
            updateStatus('Step 3: Extracting word timings (REQUIRED for animations)...');
            updateStatus('(Forced alignment: typically 30-90s per slide with MFA, 1-3 min with Gentle)');

            const methodSelector = document.getElementById('timing-method-selector');
            const timingMethod = methodSelector ? methodSelector.value : 'gentle';

            const timingsResponse = await fetch('/api/extract-timings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    course: courseId, 
                    moduleRange: moduleNumber.toString(),
                    method: timingMethod
                })
            });
            
            if (!timingsResponse.ok) {
                const errorData = await timingsResponse.json().catch(() => ({}));
                throw new Error(`Word timing extraction failed: ${errorData.error || timingsResponse.statusText}`);
            }
            
            // Handle streaming response for timings
            const reader = timingsResponse.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.trim() && line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'progress') {
                                updateStatus(data.message);
                            } else if (data.type === 'error') {
                                updateStatus(`Error: ${data.message}`);
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
            
            updateStatus('✓ Word timings extracted successfully!');
        } else {
            // Check if timings already exist
            const statusCheck = await fetch(`/api/module-status?moduleNumber=${moduleNumber}&course=${courseId}`);
            const statusData = await statusCheck.json();
            if (statusData.missingTimings && statusData.missingTimings.length > 0) {
                updateStatus(`⚠ Step 3: Word timings missing for ${statusData.missingTimings.length} slide(s) - animations will not sync properly`);
                updateStatus('⚠ Consider running Step 4 in the processing wizard to extract word timings');
            } else {
                updateStatus('⏭ Step 3: Word timings already exist (skipped)');
            }
        }
        
        // Step 4: Generate Remotion composition files (FINAL STEP)
        // This creates ModuleX.tsx and ModuleXConfig.ts - the Remotion files needed for rendering
        // Modules use getAudioDuration() which requires audioDuration.ts to have all durations
        if (needsModules || needsAudio || needsMeasurement || needsTimings) {
            // Always regenerate modules if we just generated/measured audio/timings, or if modules are missing
            updateStatus('Step 4: Generating Remotion composition files (ModuleX.tsx)...');
            updateStatus('(This is the final step - creates files needed for video rendering)');
            
            // Fetch current audio mode from voice settings
            let audioMode = 'per-slide'; // Default
            try {
                const settingsResponse = await fetch('/api/voice-settings');
                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json();
                    audioMode = settings.audioMode || 'per-slide';
                }
            } catch (e) {
                console.warn('Could not fetch audio mode, using default:', e);
            }
            
            const genResponse = await fetch('/api/generate-modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    course: courseId, 
                    moduleRange: moduleNumber.toString(),
                    audioMode: audioMode // Use saved audio mode setting
                })
            });
            const genData = await genResponse.json();
            if (genData.error) throw new Error(`Module generation: ${genData.error}`);
            updateStatus('✓ Remotion composition files generated!');
            
            // Check final status
            const finalStatusCheck = await fetch(`/api/module-status?moduleNumber=${moduleNumber}&course=${courseId}`);
            const finalStatus = await finalStatusCheck.json();
            
            if (finalStatus.animationStatus === 'fullyAnimated') {
                updateStatus('✓ Module is now FULLY ANIMATED with synchronized word timings!');
            } else if (finalStatus.animationStatus === 'basicPreview') {
                updateStatus('⚠ Module is ready for basic preview but animations will not sync properly');
                updateStatus('⚠ Run Step 4 (Word Timings) in the processing wizard to enable animations');
            } else {
                updateStatus('✓ Module files generated (complete remaining steps for full functionality)');
            }
        } else {
            updateStatus('⏭ Step 4: Remotion files already exist (skipped)');
        }
        
        // Final status message
        const finalCheck = await fetch(`/api/module-status?moduleNumber=${moduleNumber}&course=${courseId}`);
        const finalData = await finalCheck.json();
        
        if (finalData.animationStatus === 'fullyAnimated') {
            updateStatus('<strong style="color: var(--success);">✅ All steps complete! Module is FULLY ANIMATED and ready for rendering.</strong>');
        } else if (finalData.animationStatus === 'basicPreview') {
            updateStatus('<strong style="color: var(--warning);">⚠ Module is ready for basic preview but animations are not synchronized.</strong>');
            updateStatus('<strong style="color: var(--warning);">⚠ Complete Step 4 (Word Timings) to enable proper animation sync.</strong>');
        } else {
            updateStatus('<strong style="color: var(--text-secondary);">✓ Module generation complete. Complete remaining steps for full functionality.</strong>');
        }
        
        updateStatus('<strong style="color: var(--warning);">⚠ Important: Restart Remotion Studio to see changes!</strong>');
        updateStatus('Close and restart: npm start (or your Remotion Studio command)');
        updateStatus('Then you can render videos using Remotion Studio or the render button');
        
        // Reload modules after a delay
        setTimeout(() => {
            loadModules();
        }, 2000);
    } catch (error) {
        updateStatus(`<strong style="color: var(--error);">✗ Error: ${error.message}</strong>`);
    }
}

// Diagnose a module - show what's preventing it from working
async function diagnoseModule(moduleNumber) {
    try {
        const response = await fetch(`/api/diagnose?moduleNumber=${moduleNumber}`);
        const data = await response.json();
        
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--surface); border: 2px solid var(--primary); border-radius: 8px; padding: 16px; max-width: 500px; max-height: 80vh; overflow-y: auto; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        
        let content = `<div style="font-weight: 600; margin-bottom: 12px; font-size: 18px;">Module ${moduleNumber} Diagnostics</div>`;
        
        if (data.issues && data.issues.length > 0) {
            content += `<div style="margin-bottom: 12px;"><strong style="color: var(--error);">Issues (${data.issues.length}):</strong><ul style="margin: 8px 0; padding-left: 20px;">`;
            data.issues.forEach(issue => {
                content += `<li style="margin: 4px 0; color: var(--error);">${escapeHtml(issue)}</li>`;
            });
            content += `</ul></div>`;
        }
        
        if (data.warnings && data.warnings.length > 0) {
            content += `<div style="margin-bottom: 12px;"><strong style="color: var(--warning);">Warnings (${data.warnings.length}):</strong><ul style="margin: 8px 0; padding-left: 20px;">`;
            data.warnings.forEach(warning => {
                content += `<li style="margin: 4px 0; color: var(--warning);">${escapeHtml(warning)}</li>`;
            });
            content += `</ul></div>`;
        }
        
        if (data.success && data.success.length > 0) {
            content += `<div style="margin-bottom: 12px;"><strong style="color: var(--success);">✓ Working (${data.success.length}):</strong><ul style="margin: 8px 0; padding-left: 20px;">`;
            data.success.forEach(item => {
                content += `<li style="margin: 4px 0; color: var(--success);">${escapeHtml(item)}</li>`;
            });
            content += `</ul></div>`;
        }
        
        if (data.issues && data.issues.length === 0 && data.warnings && data.warnings.length === 0) {
            content += `<div style="color: var(--success); font-weight: 600;">✓ No issues found! Module should work in Remotion.</div>`;
        }
        
        content += `<button onclick="this.parentElement.remove()" style="margin-top: 12px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">Close</button>`;
        
        statusDiv.innerHTML = content;
        document.body.appendChild(statusDiv);
    } catch (error) {
        showToast(`Error running diagnostics: ${error.message}`, 'error');
    }
}

function openRemotionStudio() {
	openRemotionStudioPreview();
}

function openProcessingWizard() {
    window.location.href = `processing-wizard.html?course=${currentCourseId}`;
}

// Load workflow status
async function loadWorkflowStatus() {
    try {
        const response = await fetch(`/api/workflow-status?course=${currentCourseId}`);
        workflowStatus = await response.json();
        updateWorkflowUI();
    } catch (error) {
        console.error('Error loading workflow status:', error);
    }
}

function updateWorkflowUI() {
    if (!workflowStatus) return;
    
    // Update processing view
    updateProcessingView();
    
    // Update modules view summary
    updateModulesSummary();
    
    // Populate audio module dropdown
    populateAudioModuleDropdown();
    populateTimingsModuleDropdown();
}

function updateProcessingView() {
    const statusCard = document.getElementById('workflow-status');
    if (!statusCard) return;
    
    const { summary, modules } = workflowStatus;
    
    statusCard.innerHTML = `
        <h3 style="margin-bottom: 16px;">Workflow Status</h3>
        <div class="workflow-progress">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Overall Progress</span>
                <span style="font-weight: 600;">${summary.overallProgress.toFixed(1)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${summary.overallProgress}%"></div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${summary.modulesGenerated}/${summary.totalModules}</div>
                <div style="color: var(--text-secondary); font-size: 14px;">Modules Generated</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${summary.audioFilesGenerated}/${summary.totalAudioFiles}</div>
                <div style="color: var(--text-secondary); font-size: 14px;">Audio Files</div>
            </div>
        </div>
        <div style="margin-top: 20px; max-height: 400px; overflow-y: auto;">
            ${modules.map(m => {
                const step1Complete = m.moduleGenerated;
                const step2Complete = m.audioComplete === m.audioTotal;
                const step3Complete = m.audioMeasured;
                const step4Complete = m.timingsExtracted;
                const allComplete = step1Complete && step2Complete && step3Complete;
                
                return `
                <div class="module-workflow-item ${allComplete ? 'complete' : 'incomplete'}" style="padding: 16px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; background: ${allComplete ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface)'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                <span>Module ${m.moduleNumber}: ${m.title}</span>
                                ${allComplete ? '<span style="color: var(--success); font-size: 18px;">✓</span>' : ''}
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-size: 13px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 18px; color: ${step1Complete ? 'var(--success)' : 'var(--text-muted)'};">
                                        ${step1Complete ? '✓' : '○'}
                                    </span>
                                    <span style="color: ${step1Complete ? 'var(--success)' : 'var(--text-secondary)'};">
                                        <strong>Segment</strong><br>
                                        <small style="color: var(--text-muted);">${step1Complete ? 'Generated' : 'Not generated'}</small>
                                    </span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 18px; color: ${step2Complete ? 'var(--success)' : 'var(--text-muted)'};">
                                        ${step2Complete ? '✓' : '○'}
                                    </span>
                                    <span style="color: ${step2Complete ? 'var(--success)' : 'var(--text-secondary)'};">
                                        <strong>Audio</strong><br>
                                        <small style="color: var(--text-muted);">${m.audioComplete}/${m.audioTotal} files</small>
                                    </span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 18px; color: ${step3Complete ? 'var(--success)' : 'var(--text-muted)'};">
                                        ${step3Complete ? '✓' : '○'}
                                    </span>
                                    <span style="color: ${step3Complete ? 'var(--success)' : 'var(--text-secondary)'};">
                                        <strong>Measured</strong><br>
                                        <small style="color: var(--text-muted);">${step3Complete ? 'Complete' : 'Pending'}</small>
                                    </span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 18px; color: ${step4Complete ? 'var(--success)' : 'var(--text-muted)'};">
                                        ${step4Complete ? '✓' : '○'}
                                    </span>
                                    <span style="color: ${step4Complete ? 'var(--success)' : 'var(--text-secondary)'};">
                                        <strong>Timings</strong><br>
                                        <small style="color: var(--text-muted);">${step4Complete ? 'Extracted' : 'Optional'}</small>
                                    </span>
                                </div>
                            </div>
                            ${allComplete ? `
                                <div style="margin-top: 12px; padding: 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 13px; color: var(--success); font-weight: 600;">
                                    ✓ Ready for Remotion - Video available in Remotion Studio
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            }).join('')}
        </div>
    `;
    
    // Update module generation card
    updateModuleGenerationCard();
    
    // Update audio generation card
    updateAudioGenerationCard();
}

function updateModuleGenerationCard() {
    const { summary } = workflowStatus;
    const badge = document.getElementById('module-badge');
    const statusInfo = document.getElementById('module-status-info');
    const btn = document.getElementById('generate-modules-btn');
    
    if (summary.modulesGenerated === summary.totalModules) {
        if (badge) badge.textContent = 'Complete';
        if (statusInfo) {
            statusInfo.className = 'status-info complete';
            statusInfo.innerHTML = `✓ All ${summary.totalModules} modules are generated`;
        }
        if (btn) {
            btn.textContent = '🔄 Regenerate All Modules';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    } else {
        if (badge) badge.textContent = 'Incomplete';
        if (statusInfo) {
            statusInfo.className = 'status-info incomplete';
            statusInfo.innerHTML = `⚠ ${summary.totalModules - summary.modulesGenerated} modules need generation`;
        }
        if (btn) {
            btn.textContent = '🚀 Generate Missing Modules';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        }
    }
}

function updateAudioGenerationCard() {
    const { summary } = workflowStatus;
    const badge = document.getElementById('audio-badge');
    const statusInfo = document.getElementById('audio-status-info');
    const btn = document.getElementById('generate-audio-btn');
    const btnAll = document.getElementById('generate-audio-all-btn');
    
    const missing = summary.totalAudioFiles - summary.audioFilesGenerated;
    
    if (summary.audioFilesGenerated === summary.totalAudioFiles) {
        if (badge) badge.textContent = 'Complete';
        if (statusInfo) {
            statusInfo.className = 'status-info complete';
            statusInfo.innerHTML = `✓ All ${summary.totalAudioFiles} audio files exist. No regeneration needed.`;
        }
        if (btn) {
            btn.disabled = true;
            btn.textContent = '✓ All Audio Generated';
        }
    } else {
        if (badge) badge.textContent = 'Incomplete';
        if (statusInfo) {
            statusInfo.className = 'status-info warning';
            statusInfo.innerHTML = `⚠ ${missing} audio files missing. ${summary.audioFilesGenerated} already exist. Only missing files will be generated.`;
        }
        if (btn) {
            btn.disabled = false;
            btn.textContent = `🎵 Generate ${missing} Missing Audio Files`;
        }
    }
    
    if (btnAll) {
        btnAll.style.display = summary.audioFilesGenerated > 0 ? 'inline-flex' : 'none';
    }
}

function updateModulesSummary() {
    const summaryEl = document.getElementById('workflow-summary');
    if (!summaryEl || !workflowStatus) return;
    
    const { summary } = workflowStatus;
    summaryEl.innerHTML = `
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
            <div>
                <div style="font-size: 18px; font-weight: 600; color: var(--primary);">${summary.modulesGenerated}/${summary.totalModules}</div>
                <div style="color: var(--text-secondary); font-size: 12px;">Modules Ready</div>
            </div>
            <div>
                <div style="font-size: 18px; font-weight: 600; color: var(--primary);">${summary.audioFilesGenerated}/${summary.totalAudioFiles}</div>
                <div style="color: var(--text-secondary); font-size: 12px;">Audio Files</div>
            </div>
        </div>
    `;
}

async function generateAudioAll() {
    showModal(
        'Regenerate All Audio',
        'This will regenerate ALL audio files, including existing ones. This will incur costs.\n\nContinue?',
        () => {
            generateAudioAllConfirmed();
        }
    );
}

async function generateAudioAllConfirmed() {
    
    const statusEl = document.getElementById('audio-status');
    showStatus(statusEl, 'loading', 'Regenerating all audio files... This will incur costs.');
    
    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ force: true, course: currentCourseId })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            showStatus(statusEl, 'success', 'All audio files regenerated!');
            setTimeout(() => loadWorkflowStatus(), 2000);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Video Processing Functions
async function generateModules() {
    const statusEl = document.getElementById('modules-status');
    
    // Check if all modules are already generated
    if (workflowStatus && workflowStatus.summary.modulesGenerated === workflowStatus.summary.totalModules) {
        showModal(
            'Regenerate All Modules',
            'All modules are already generated. Regenerate all modules?',
            () => {
                generateModulesConfirmed(statusEl);
            }
        );
        return;
    }
    
    generateModulesConfirmed(statusEl);
}

async function generateModulesConfirmed(statusEl) {
    showStatus(statusEl, 'loading', 'Validating prerequisites before generating modules...');

    try {
        const activeResp = await fetch('/api/active-course');
        const activeData = activeResp.ok ? await activeResp.json() : {};
        const courseId = activeData.activeCourseId || activeData.courseId;

        if (!courseId) {
            showStatus(statusEl, 'error', 'No active course. Activate a course in the processing wizard first.');
            return;
        }

        const response = await fetch('/api/generate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course: courseId })
        });

        const data = await response.json();
        
        if (data.error) {
            // Check if it's a validation error
            if (data.validation && !data.validation.valid) {
                let errorMsg = `Pre-flight validation failed:\n\n`;
                if (data.validation.errors && data.validation.errors.length > 0) {
                    errorMsg += `Errors:\n${data.validation.errors.map(e => `  • ${e}`).join('\n')}\n\n`;
                }
                if (data.validation.warnings && data.validation.warnings.length > 0) {
                    errorMsg += `Warnings:\n${data.validation.warnings.map(w => `  • ${w}`).join('\n')}\n\n`;
                }
                errorMsg += `\nPlease complete the missing steps before generating modules.`;
                showStatus(statusEl, 'error', errorMsg);
            } else {
                showStatus(statusEl, 'error', `Error: ${data.error}`);
            }
        } else {
            let successMsg = 'Modules generated successfully!';
            if (data.validation) {
                if (data.validation.warnings && data.validation.warnings.length > 0) {
                    successMsg += `\n\nWarnings: ${data.validation.warnings.join('; ')}`;
                }
                if (data.validation.checks && data.validation.checks.allValid) {
                    successMsg += '\n✓ All audio files and durations validated';
                }
            }
            showStatus(statusEl, 'success', successMsg);
            // Reload modules and workflow status after generation
            setTimeout(() => {
                loadModules();
                loadWorkflowStatus();
            }, 1000);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

async function generateAudio() {
    const statusEl = document.getElementById('audio-status');
    const moduleNumber = document.getElementById('audio-module-number').value;
    
    // Check workflow status
    if (workflowStatus) {
        const missing = workflowStatus.summary.totalAudioFiles - workflowStatus.summary.audioFilesGenerated;
        if (missing === 0) {
            showModal(
                'Regenerate All Audio',
                'All audio files already exist. Regenerate all? This will incur costs.',
                () => {
                    generateAudioConfirmed(statusEl, moduleNumber);
                }
            );
            return;
        } else {
            showStatus(statusEl, 'info', `Generating ${missing} missing audio files... Existing files will be skipped.`);
        }
    } else {
        showStatus(statusEl, 'loading', 'Generating audio... This may take a while.');
        generateAudioConfirmed(statusEl, moduleNumber);
    }
}

async function generateAudioConfirmed(statusEl, moduleNumber) {
    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moduleRange: moduleNumber || null, course: currentCourseId })
        });

        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            showStatus(statusEl, 'success', 'Audio generation complete! Existing files were skipped.');
            setTimeout(() => loadWorkflowStatus(), 2000);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

async function generateAudioModule() {
    const moduleNumber = document.getElementById('audio-module-number')?.value;
    if (moduleNumber === '' || moduleNumber == null) {
        showToast('Please enter a module number', 'warning');
        return;
    }
    
    const parsedModuleNumber = parseInt(moduleNumber, 10);
    if (Number.isNaN(parsedModuleNumber)) {
        showToast('Please enter a valid module number', 'warning');
        return;
    }
    
    const statusEl = document.getElementById('audio-status');
    showStatus(statusEl, 'loading', `Generating audio for Module ${parsedModuleNumber}...`);

    try {
        const response = await fetch('/api/generate-audio-module', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moduleNumber: parsedModuleNumber, course: currentCourseId })
        });

        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            showStatus(statusEl, 'success', `Audio generated successfully for Module ${moduleNumber}!`);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Populate module dropdowns for single audio and per-module timings
function populateAudioModuleDropdown() {
    populateModuleSelect('audio-module-select', 'Select...');
}

function populateTimingsModuleDropdown() {
    populateModuleSelect('timings-module-select', 'Select module...');
}

function populateModuleSelect(selectId, placeholder) {
    const select = document.getElementById(selectId);
    if (!select || !workflowStatus) return;

    select.innerHTML = `<option value="">${placeholder}</option>`;

    const modules = workflowStatus.modules || [];
    modules.forEach(m => {
        const option = document.createElement('option');
        option.value = m.moduleNumber;
        option.textContent = `Module ${m.moduleNumber}: ${m.title || 'Untitled'}`;
        select.appendChild(option);
    });
}

// Load slides for selected module
async function loadSlidesForModule() {
    const moduleSelect = document.getElementById('audio-module-select');
    const slideSelect = document.getElementById('audio-slide-select');
    
    if (!moduleSelect || !slideSelect) return;
    
    const moduleNumber = moduleSelect.value;
    if (!moduleNumber) {
        slideSelect.innerHTML = '<option value="">Select module first...</option>';
        return;
    }
    
    slideSelect.innerHTML = '<option value="">Loading...</option>';
    
    // Get slides from workflow status (audioFiles array)
    const module = workflowStatus?.modules?.find(m => m.moduleNumber == moduleNumber);
    if (module && module.audioFiles && module.audioFiles.length > 0) {
        slideSelect.innerHTML = '<option value="">Select slide...</option>';
        module.audioFiles.forEach(slide => {
            const option = document.createElement('option');
            option.value = slide.name;
            const hasAudio = slide.exists ? ' [has audio]' : ' [no audio]';
            option.textContent = slide.name + hasAudio;
            slideSelect.appendChild(option);
        });
    } else {
        slideSelect.innerHTML = '<option value="">No slides found</option>';
    }
}

// Generate single audio for selected slide
async function generateSingleAudio() {
    const moduleNumber = document.getElementById('audio-module-select')?.value;
    const slideName = document.getElementById('audio-slide-select')?.value;
    const force = document.getElementById('force-single-audio')?.checked || false;
    
    if (moduleNumber === '' || moduleNumber == null || !slideName) {
        showToast('Please select both module and slide', 'warning');
        return;
    }
    
    const parsedModuleNumber = parseInt(moduleNumber, 10);
    
    const statusEl = document.getElementById('audio-status');
    showStatus(statusEl, 'loading', `Generating audio for Module ${parsedModuleNumber} - ${slideName}...`);
    
    try {
        const response = await fetch('/api/generate-audio-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                moduleNumber: parsedModuleNumber, 
                slideName,
                course: currentCourseId,
                force
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else if (data.skipped) {
            showStatus(statusEl, 'info', 'Audio already exists. Check "Force regenerate" to overwrite.');
        } else {
            showStatus(statusEl, 'success', `Audio generated: ${slideName} (${Math.round(data.size / 1024)}KB)`);
            setTimeout(() => loadWorkflowStatus(), 1000);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Generate all missing audio
async function generateAllAudioMissing() {
    const statusEl = document.getElementById('audio-status');
    
    // Check for existing checkpoint
    try {
        const checkpointResponse = await fetch(`/api/checkpoint-status?operation=audio-generation&course=${currentCourseId || 'default'}`);
        const checkpointData = await checkpointResponse.json();
        
        if (checkpointData.exists && checkpointData.canResume) {
            const resume = confirm(
                `Previous batch had ${checkpointData.failed} failure(s). ` +
                `${checkpointData.completed} items completed. ` +
                `\n\nResume from checkpoint (only retry failed items)?\n\n` +
                `Click OK to resume, Cancel to start fresh.`
            );
            
            if (!resume) {
                // Clear checkpoint and start fresh
                await fetch('/api/clear-checkpoint', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ operation: 'audio-generation', course: currentCourseId || 'default' })
                });
            }
        }
    } catch (e) {
        console.warn('Could not check checkpoint:', e);
    }
    
    if (workflowStatus) {
        const missing = workflowStatus.summary.totalAudioFiles - workflowStatus.summary.audioFilesGenerated;
        if (missing === 0) {
            showStatus(statusEl, 'info', 'All audio files already exist. Use "Regenerate All" to overwrite.');
            return;
        }
        showStatus(statusEl, 'loading', `Generating ${missing} missing audio files...`);
    } else {
        showStatus(statusEl, 'loading', 'Generating missing audio files...');
    }
    
    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                force: false,
                resume: true,
                course: currentCourseId || 'default'
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            let msg = `Complete: ${data.generated} generated, ${data.skipped} skipped, ${data.failed} failed`;
            if (data.failed > 0 && data.canResume) {
                msg += `\n\n⚠ ${data.failed} item(s) failed. You can resume to retry only the failed items.`;
                msg += `\nFailed items: ${data.failedItems.slice(0, 3).map(i => `Module ${i.module}-${i.slide}`).join(', ')}${data.failedItems.length > 3 ? '...' : ''}`;
            }
            showStatus(statusEl, data.failed > 0 ? 'warning' : 'success', msg);
            setTimeout(() => loadWorkflowStatus(), 2000);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Regenerate all audio (with confirmation)
async function generateAllAudioForce() {
    showModal(
        'Regenerate All Audio',
        'This will regenerate ALL audio files, including existing ones. This will incur API costs.\n\nContinue?',
        async () => {
            const statusEl = document.getElementById('audio-status');
            showStatus(statusEl, 'loading', 'Regenerating all audio files...');
            
            try {
                const response = await fetch('/api/generate-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ force: true, course: currentCourseId })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    showStatus(statusEl, 'error', `Error: ${data.error}`);
                } else {
                    const msg = `Complete: ${data.generated} generated, ${data.failed} failed`;
                    showStatus(statusEl, 'success', msg);
                    setTimeout(() => loadWorkflowStatus(), 2000);
                }
            } catch (error) {
                showStatus(statusEl, 'error', `Error: ${error.message}`);
            }
        }
    );
}

async function validateAudio() {
    const statusEl = document.getElementById('audio-status');
    showStatus(statusEl, 'loading', 'Validating audio files... Converting MP3s to WAV if needed.');

    try {
        const response = await fetch('/api/validate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            // Parse the output to show a summary
            const output = data.output || '';
            const convertedMatch = output.match(/Converted:\s*(\d+)/);
            const converted = convertedMatch ? parseInt(convertedMatch[1]) : 0;
            
            if (converted > 0) {
                showStatus(statusEl, 'success', `Converted ${converted} file(s) to WAV format. Run "Measure Audio" to update durations.`);
            } else {
                showStatus(statusEl, 'success', 'All audio files are valid WAV format.');
            }
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

async function generateFullCourse() {
    const statusEl = document.getElementById('full-course-status');
    showStatus(statusEl, 'loading', 'Generating full course... This will take several minutes.');

    try {
        // First generate modules
        const modulesResponse = await fetch('/api/generate-modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (modulesResponse.ok) {
            showStatus(statusEl, 'info', 'Modules generated. Now generating audio...');
            
            // Then generate audio
            const audioResponse = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course: currentCourseId })
            });

            const audioData = await audioResponse.json();
            
            if (audioData.error) {
                showStatus(statusEl, 'error', `Audio generation error: ${audioData.error}`);
            } else {
                showStatus(statusEl, 'success', 'Full course generated successfully!');
                setTimeout(() => loadModules(), 1000);
            }
        } else {
            const modulesData = await modulesResponse.json();
            showStatus(statusEl, 'error', `Module generation error: ${modulesData.error}`);
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

async function measureAudio() {
    const statusEl = document.getElementById('measure-status');
    showStatus(statusEl, 'loading', 'Measuring audio durations...');

    try {
        const response = await fetch('/api/measure-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const data = await response.json();
        
        if (data.error) {
            showStatus(statusEl, 'error', `Error: ${data.error}`);
        } else {
            showStatus(statusEl, 'success', 'Audio durations measured successfully!');
        }
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

async function extractTimings() {
    const statusEl = document.getElementById('timings-status');
    const moduleNumber = document.getElementById('timings-module-select')?.value;

    if (!moduleNumber) {
        showStatus(statusEl, 'error', 'Select a module first. Run timings one module at a time.');
        return;
    }

    showStatus(statusEl, 'loading', `Extracting word timings for Module ${moduleNumber}... This may take a while.`);

    try {
        const methodSelector = document.getElementById('timing-method-selector');
        const method = methodSelector ? methodSelector.value : 'gentle';

        const response = await fetch('/api/extract-timings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: method,
                moduleRange: moduleNumber,
                courseId: currentCourseId
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let lastMessage = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.message) lastMessage = data.message;
                        if (data.type === 'done') {
                            if (data.success) {
                                showStatus(statusEl, 'success', 'Word timings extracted successfully!');
                            } else {
                                showStatus(statusEl, 'error', data.message || 'Extraction failed');
                            }
                            return;
                        }
                        if (data.type === 'error') {
                            showStatus(statusEl, 'error', data.message || 'Extraction failed');
                            return;
                        }
                    } catch (e) { /* ignore parse errors */ }
                }
            }
        }
        showStatus(statusEl, lastMessage ? 'success' : 'loading', lastMessage || 'Word timings extracted.');
    } catch (error) {
        showStatus(statusEl, 'error', `Error: ${error.message}`);
    }
}

// Utility functions
function showStatus(element, type, message) {
    element.textContent = message;
    element.className = `status-message ${type} show`;
}

// ============================================
// AI Course Planner Functions
// ============================================

let currentPlan = null;

// Update labels and constraints for Course vs Video vs Shorts (separate types, different tones)
function updatePlannerType() {
    const typeCourse = document.getElementById('planner-type-course').checked;
    const typeVideo = document.getElementById('planner-type-video').checked;
    const typeShorts = document.getElementById('planner-type-shorts').checked;
    const typeMarketing = document.getElementById('planner-type-marketing')?.checked;
    const simpleLabel = document.getElementById('planner-simple-count-label');
    const simpleCount = document.getElementById('planner-simple-count');
    const modulesLabel = document.getElementById('planner-modules-label');
    const modulesInput = document.getElementById('planner-modules');
    const labels = typeMarketing
        ? { simple: 'Fixed 3 outputs (YouTube + Facebook + Udemy)', structured: 'Fixed 3 outputs', placeholder: '3 (auto)', max: '3' }
        : typeCourse
        ? { simple: 'Number of videos (optional)', structured: 'Number of videos (optional)', placeholder: 'Auto (4-8)', max: 20 }
        : typeVideo
            ? { simple: 'Number of videos (optional)', structured: 'Number of videos (optional)', placeholder: 'Auto - planner exhausts topic', max: '' }
            : { simple: 'Number of shorts', structured: 'Number of shorts (optional)', placeholder: '1 or more', max: '' };
    if (simpleLabel) simpleLabel.textContent = labels.simple;
    if (simpleCount) {
        simpleCount.min = '1';
        simpleCount.placeholder = labels.placeholder;
        simpleCount.value = typeMarketing ? '3' : simpleCount.value;
        simpleCount.disabled = !!typeMarketing;
        simpleCount.removeAttribute('max');
        if (labels.max) simpleCount.setAttribute('max', String(labels.max));
    }
    if (modulesLabel) modulesLabel.textContent = labels.structured;
    if (modulesInput) {
        modulesInput.min = '1';
        modulesInput.placeholder = labels.placeholder;
        modulesInput.removeAttribute('max');
        if (labels.max) modulesInput.setAttribute('max', String(labels.max));
    }
}

// Toggle between simple and structured planner modes
function togglePlannerMode() {
    const simpleMode = document.getElementById('planner-simple-mode');
    const structuredMode = document.getElementById('planner-structured-mode');
    
    if (simpleMode.style.display === 'none') {
        simpleMode.style.display = 'block';
        structuredMode.style.display = 'none';
    } else {
        simpleMode.style.display = 'none';
        structuredMode.style.display = 'block';
    }
}

// Plan course from simple prompt
async function planCourse() {
    const prompt = document.getElementById('planner-prompt').value.trim();
    const contentType = (document.querySelector('input[name="planner-type"]:checked')?.value) || 'course';
    const countEl = document.getElementById('planner-simple-count');
    const countVal = countEl && countEl.value.trim() ? parseInt(countEl.value, 10) : undefined;
    if (!prompt) {
        showToast('Please enter a description', 'warning');
        return;
    }
    const input = { prompt, contentType };
    if (contentType === 'marketing') {
        input.moduleCount = 3;
    } else if (countVal && !isNaN(countVal)) input.moduleCount = countVal;
    await executePlanCourse(input);
}

// Plan course from structured input
async function planCourseStructured() {
    const title = document.getElementById('planner-title').value.trim();
    const description = document.getElementById('planner-description').value.trim();
    const audience = document.getElementById('planner-audience').value.trim();
    const topics = document.getElementById('planner-topics').value.trim();
    const modules = document.getElementById('planner-modules').value;
    const contentType = (document.querySelector('input[name="planner-type"]:checked')?.value) || 'course';
    if (!title) {
        showToast('Please enter a title', 'warning');
        return;
    }
    const input = { title, contentType };
    if (description) input.description = description;
    if (audience) input.targetAudience = audience;
    if (topics) input.keyTopics = topics.split(',').map(t => t.trim()).filter(t => t);
    if (contentType === 'marketing') {
        input.moduleCount = 3;
    } else if (modules) input.moduleCount = parseInt(modules);
    await executePlanCourse(input);
}

// Execute the plan course API call
async function executePlanCourse(input) {
    const statusDiv = document.getElementById('planner-status');
    const statusText = document.getElementById('planner-status-text');
    const previewDiv = document.getElementById('plan-preview');
    const planBtn = document.getElementById('plan-course-btn');
    const planBtnStructured = document.getElementById('plan-course-structured-btn');
    
    // Show loading state (include type so user sees Shorts/Course/Video was sent)
    const typeLabel = input.contentType === 'marketing' ? 'Marketing Pack'
        : input.contentType === 'shorts' ? 'Shorts'
        : (input.contentType === 'video' ? 'Video' : 'Course');
    statusDiv.style.display = 'block';
    previewDiv.style.display = 'none';
    statusText.innerHTML = `Generating <strong>${typeLabel}</strong> plan with AI... This may take 30-60 seconds.`;
    if (planBtn) planBtn.disabled = true;
    if (planBtnStructured) planBtnStructured.disabled = true;
    
    try {
        const response = await fetch('/api/plan-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });
        
        const data = await response.json();
        
        if (data.error) {
            statusText.innerHTML = `<span style="color: var(--error);">Error: ${data.error}</span>`;
            showToast(`Planning failed: ${data.error}`, 'error');
            return;
        }
        
        // Store the plan
        currentPlan = data.plan;
        
        // Show success
        statusDiv.style.display = 'none';
        previewDiv.style.display = 'block';
        
        // Render preview
        renderPlanPreview(data.plan, data.stats, data.warnings);
        
        showToast(`Generated ${data.stats.modules} parts with ${data.stats.slides} slides!`, 'success');
        
    } catch (error) {
        statusText.innerHTML = `<span style="color: var(--error);">Error: ${error.message}</span>`;
        showToast(`Planning failed: ${error.message}`, 'error');
    } finally {
        if (planBtn) planBtn.disabled = false;
        if (planBtnStructured) planBtnStructured.disabled = false;
    }
}

// Render the plan preview
function renderPlanPreview(plan, stats, warnings) {
    const contentDiv = document.getElementById('plan-preview-content');
    const warningsDiv = document.getElementById('plan-warnings');
    
    let html = `
        <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
            <strong style="font-size: 18px; color: var(--primary);">${escapeHtml(plan.courseName)}</strong>
            <div style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
                ${stats.modules} parts | ${stats.slides} slides | ~${stats.estimatedDuration}
            </div>
        </div>
    `;
    
    for (const mod of plan.modules) {
        // Get slide titles (fallback to name if no title)
        const slideTitles = mod.slides.map(s => s.title || s.name.replace(/-/g, ' ')).slice(0, 5);
        const moreCount = mod.slides.length - 5;
        
        html += `
            <div style="margin-bottom: 16px; padding: 12px; background: var(--surface); border-radius: 6px;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: var(--text-primary);">
                    Part ${mod.moduleNumber}: ${escapeHtml(mod.title)}
                </div>
                <div style="font-size: 13px; color: var(--text-muted);">
                    ${mod.slides.length} slides
                </div>
                <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 12px; color: var(--text-secondary);">
                    ${slideTitles.map(t => `<li style="margin-bottom: 2px;">${escapeHtml(t)}</li>`).join('')}
                    ${moreCount > 0 ? `<li style="color: var(--text-muted);">...and ${moreCount} more</li>` : ''}
                </ul>
            </div>
        `;
    }
    
    contentDiv.innerHTML = html;
    
    // Show warnings if any
    if (warnings && warnings.length > 0) {
        warningsDiv.style.display = 'block';
        const items = warnings.map(w => {
            if (w.type === 'long') return `<li>Module ${w.module}, "${w.slide}": ${w.words} words (~${w.estimatedSeconds}s) - may cause audio distortion</li>`;
            if (w.type === 'short') return `<li>Module ${w.module}, "${w.slide}": ${w.words} words - too short</li>`;
            if (w.type === 'truncated') return `<li>Module ${w.module}, "${w.slide}": script may be truncated</li>`;
            if (w.type === 'slide-type') return `<li>Module ${w.module}, "${w.slide}": ${w.message}</li>`;
            if (w.type === 'variety') return `<li>${w.message}</li>`;
            return `<li>${w.message || JSON.stringify(w)}</li>`;
        });
        warningsDiv.innerHTML = `
            <strong>Warnings (${warnings.length}):</strong>
            <ul style="margin: 8px 0 0 20px; font-size: 12px;">
                ${items.join('')}
            </ul>
        `;
    } else {
        warningsDiv.style.display = 'none';
    }
}

// Save the current plan
async function savePlan() {
    if (!currentPlan) {
        showToast('No plan to save', 'warning');
        return;
    }
    
    const statusDiv = document.getElementById('planner-status');
    const statusText = document.getElementById('planner-status-text');
    
    statusDiv.style.display = 'block';
    statusText.innerHTML = 'Saving plan...';
    
    try {
        const contentType = (document.querySelector('input[name="planner-type"]:checked')?.value || 'course');
        const response = await fetch('/api/save-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: currentPlan, contentType })
        });
        
        const data = await response.json();
        
        if (data.error) {
            statusText.innerHTML = `<span style="color: var(--error);">Error: ${data.error}</span>`;
            showToast(`Save failed: ${data.error}`, 'error');
            return;
        }
        
        showToast('Plan saved! Redirecting to processing...', 'success');
        
        // Reload courses and switch to the new one
        await loadCourses();
        currentCourseId = data.courseId;
        
        // Clear the form and plan
        clearPlan();
        
        // Navigate to processing wizard
        setTimeout(() => {
            window.location.href = `processing-wizard.html?course=${data.courseId}`;
        }, 1500);
        
    } catch (error) {
        statusText.innerHTML = `<span style="color: var(--error);">Error: ${error.message}</span>`;
        showToast(`Save failed: ${error.message}`, 'error');
    }
}

// Clear the current plan and reset form
function clearPlan() {
    currentPlan = null;
    
    // Hide preview
    const previewDiv = document.getElementById('plan-preview');
    const statusDiv = document.getElementById('planner-status');
    if (previewDiv) previewDiv.style.display = 'none';
    if (statusDiv) statusDiv.style.display = 'none';
    
    // Reset type and count
    const typeCourse = document.getElementById('planner-type-course');
    if (typeCourse) typeCourse.checked = true;
    const simpleCount = document.getElementById('planner-simple-count');
    if (simpleCount) simpleCount.value = '';
    updatePlannerType();
    
    // Clear inputs
    const promptInput = document.getElementById('planner-prompt');
    if (promptInput) promptInput.value = '';
    
    const titleInput = document.getElementById('planner-title');
    if (titleInput) titleInput.value = '';
    
    const descInput = document.getElementById('planner-description');
    if (descInput) descInput.value = '';
    
    const audienceInput = document.getElementById('planner-audience');
    if (audienceInput) audienceInput.value = '';
    
    const topicsInput = document.getElementById('planner-topics');
    if (topicsInput) topicsInput.value = '';
    
    const modulesInput = document.getElementById('planner-modules');
    if (modulesInput) modulesInput.value = '';
}

// ============================================
// End AI Course Planner Functions
// ============================================

// Create new video (was createCourse)
async function createVideo(event) {
    event.preventDefault();
    
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();
    
    // Auto-generate video ID from title
    const courseId = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
    if (!courseId) {
        showToast('Please enter a valid video title', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId, title, description })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
        } else {
            showToast('Video created successfully! Opening segment creator...', 'success');
            loadCourses().then(() => {
                currentCourseId = courseId;
                changeCourse(courseId);
                // Navigate to create segment after creating video
                setTimeout(() => {
                    showView('create-module');
                }, 1000);
            });
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Legacy function name for compatibility
async function createCourse(event) {
    return createVideo(event);
}

// Slide form counter
let slideFormCounter = 0;

// Add slide to create module form
function addSlideToForm() {
    slideFormCounter++;
    const container = document.getElementById('slides-form-container');
    
    const slideHtml = `
        <div class="slide-form-item" data-slide-index="${slideFormCounter}" style="background: var(--surface-light); padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="margin: 0; color: var(--text-primary); font-size: 16px;">Slide ${slideFormCounter + 1}</h4>
                <button type="button" class="btn btn-remove" onclick="removeSlideFromForm(${slideFormCounter})" style="padding: 4px 12px; font-size: 12px;">Remove</button>
            </div>
            <div class="form-group">
                <label>Slide Name</label>
                <input type="text" class="slide-name" placeholder="e.g., introduction" required />
                <small style="color: var(--text-muted);">Used for audio file naming (lowercase, no spaces)</small>
            </div>
            <div class="form-group">
                <label>Slide Type</label>
                <select class="slide-type" style="width: 100%; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary);">
                    <option value="title">Title</option>
                    <option value="content-single" selected>Content (Single Card)</option>
                    <option value="content-two-card">Content (Two Cards)</option>
                    <option value="code">Code</option>
                    <option value="comparison">Comparison</option>
                </select>
            </div>
            <div class="form-group">
                <label>Narration Script *</label>
                <textarea class="slide-script" placeholder="Enter what will be said in this slide..." style="min-height: 100px; resize: vertical;" required></textarea>
                <small style="color: var(--text-muted);">This is the only required field. Everything else is auto-generated.</small>
            </div>
            <div class="form-group slide-title-group">
                <label>Slide Title</label>
                <input type="text" class="slide-title" placeholder="e.g., Introduction" />
            </div>
            <div class="form-group slide-points-group" style="display: none;">
                <label>Bullet Points</label>
                <div class="points-container" style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="point-input" placeholder="Point 1" />
                </div>
                <button type="button" class="btn btn-secondary" onclick="addPointToSlide(${slideFormCounter})" style="margin-top: 8px; padding: 6px 12px; font-size: 12px;">+ Add Point</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', slideHtml);
    
    // Show/hide fields based on slide type
    const slideItem = container.querySelector(`[data-slide-index="${slideFormCounter}"]`);
    const typeSelect = slideItem.querySelector('.slide-type');
    typeSelect.addEventListener('change', function() {
        updateSlideFormFields(slideFormCounter);
    });
}

// Remove slide from form
function removeSlideFromForm(index) {
    const slideItem = document.querySelector(`[data-slide-index="${index}"]`);
    if (slideItem) {
        showModal(
            'Remove Slide',
            'Remove this slide?',
            () => {
                slideItem.remove();
                // Renumber remaining slides
                renumberSlides();
            }
        );
    }
}

// Renumber slides in form
function renumberSlides() {
    const container = document.getElementById('slides-form-container');
    const slides = container.querySelectorAll('.slide-form-item');
    slides.forEach((slide, index) => {
        const h4 = slide.querySelector('h4');
        if (h4) h4.textContent = `Slide ${index + 1}`;
    });
}

// Update slide form fields based on type
function updateSlideFormFields(index) {
    const slideItem = document.querySelector(`[data-slide-index="${index}"]`);
    if (!slideItem) return;
    
    const type = slideItem.querySelector('.slide-type').value;
    const titleGroup = slideItem.querySelector('.slide-title-group');
    const pointsGroup = slideItem.querySelector('.slide-points-group');
    
    if (type === 'title') {
        titleGroup.style.display = 'none';
        pointsGroup.style.display = 'none';
    } else {
        titleGroup.style.display = 'block';
        if (type === 'content-single' || type === 'content-two-card') {
            pointsGroup.style.display = 'block';
        } else {
            pointsGroup.style.display = 'none';
        }
    }
}

// Add point to slide
function addPointToSlide(slideIndex) {
    const slideItem = document.querySelector(`[data-slide-index="${slideIndex}"]`);
    if (!slideItem) return;
    
    const pointsContainer = slideItem.querySelector('.points-container');
    const newPoint = document.createElement('input');
    newPoint.type = 'text';
    newPoint.className = 'point-input';
    newPoint.placeholder = `Point ${pointsContainer.children.length + 1}`;
    pointsContainer.appendChild(newPoint);
}

// Create new module
async function createModule(event) {
    event.preventDefault();
    
    // Auto-use current video and generate next segment number
    const courseId = currentCourseId || document.getElementById('new-module-course').value;
    
    // Auto-generate next segment number
    let moduleNumber = 1;
    if (modules.length > 0) {
        const maxModule = Math.max(...modules.map(m => m.moduleNumber));
        moduleNumber = maxModule + 1;
    }
    const title = document.getElementById('new-module-title').value.trim();
    const subtitle = document.getElementById('new-module-subtitle').value.trim();
    const videoCategory = document.getElementById('new-module-video-category').value;
    
    // Collect slides from form
    const slidesContainer = document.getElementById('slides-form-container');
    const slideItems = slidesContainer.querySelectorAll('.slide-form-item');
    const slides = [];
    
    // Always add title slide first (auto-generated)
    slides.push({
        name: 'title',
        type: 'title',
        script: `${title}. ${subtitle}`,
        subtitle: subtitle,
        title: title
    });
    
    // Add other slides
    slideItems.forEach((slideItem, index) => {
        // Auto-generate slide name if not provided
        let slideName = slideItem.querySelector('.slide-name').value.trim();
        if (!slideName) {
            slideName = `slide-${index + 1}`;
        }
        
        const slideType = slideItem.querySelector('.slide-type').value;
        const slideScript = slideItem.querySelector('.slide-script').value.trim();
        const slideTitle = slideItem.querySelector('.slide-title')?.value.trim() || '';
        
        if (!slideScript) {
            return; // Skip incomplete slides
        }
        
        const slide = {
            name: slideName,
            type: slideType,
            script: slideScript
        };
        
        if (slideTitle) {
            slide.title = slideTitle;
        }
        
        // Add points for content slides
        if (slideType === 'content-single' || slideType === 'content-two-card') {
            const pointInputs = slideItem.querySelectorAll('.point-input');
            const points = Array.from(pointInputs)
                .map(input => input.value.trim())
                .filter(point => point.length > 0);
            if (points.length > 0) {
                slide.points = points;
            }
        }
        
        slides.push(slide);
    });
    
    try {
        const response = await fetch('/api/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                courseId, 
                moduleNumber, 
                title, 
                subtitle,
                videoCategory,
                slides: slides // Always send all slides (at minimum the title slide)
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast(`Error: ${data.error}`, 'error');
        } else {
            showToast('Segment created successfully! Opening Slide Manager...', 'success');
            setTimeout(() => {
                window.location.href = `slide-manager.html?module=${moduleNumber}&course=${courseId}`;
            }, 1000);
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Populate course selector in create module form
function populateCreateModuleCourses() {
    const selector = document.getElementById('new-module-course');
    if (selector && courses.length > 0) {
        selector.innerHTML = courses.map(course => 
            `<option value="${course.id}" ${course.id === currentCourseId ? 'selected' : ''}>${course.title}</option>`
        ).join('');
    }
    
    // Reset slide form
    slideFormCounter = 0;
    const slidesContainer = document.getElementById('slides-form-container');
    if (slidesContainer) {
        slidesContainer.innerHTML = '';
    }
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close drawer on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDrawer();
    }
});
