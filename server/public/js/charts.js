/**
 * Chart Rendering Logic
 * Separated from main App controller for cleanliness
 */

const ChartRenderer = {
    // Hex to RGBA Helper
    hexToRgba(hex, alpha) {
        // Basic hex check
        if (!hex || !hex.startsWith('#') || hex.length < 7) return `rgba(255, 255, 255, ${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    renderTrendChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Stop any previous animation loop
        if (canvas.animationId) {
            cancelAnimationFrame(canvas.animationId);
        }

        // Set canvas size (High DPI)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        
        // Prevent zero-size canvas errors if hidden
        if (rect.width === 0 || rect.height === 0) return;

        // Resize handling - Safe calculation
        const targetWidth = Math.floor(rect.width * dpr);
        const targetHeight = Math.max(Math.floor((rect.height - 32) * dpr), 100); // Ensure min height

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }
        
        // Setup Animation State
        if (!canvas.animStartTime || isNaN(canvas.animStartTime)) {
            canvas.animStartTime = performance.now();
        }
        
        const ANIMATION_DURATION = 1000; // 1s draw time
        
        const renderFrame = (timestamp) => {
            try {
                // Safety: Ensure start time exists
                if (!canvas.animStartTime) canvas.animStartTime = timestamp;

                const elapsed = Math.max(0, timestamp - canvas.animStartTime);
                const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

                // Clear
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.scale(dpr, dpr);

                const width = rect.width;
                const height = Math.max(rect.height - 32, 50);
                
                const padding = { top: 20, right: 10, bottom: 30, left: 30 };
                const drawWidth = width - padding.left - padding.right;
                const drawHeight = height - padding.top - padding.bottom;

                // Check for empty data
                if (!data || !data.series || data.series.length === 0) {
                    ctx.fillStyle = '#8E8E93';
                    ctx.font = '500 14px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('No habits yet. Create one to see trends!', width / 2, height / 2);
                    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
                    return;
                }

                const maxY = 7;

                // --- Draw Grid (Subtle Cyberpunk Grid) ---
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                
                // Horizontal lines
                for (let i = 0; i <= maxY; i++) {
                    const y = padding.top + drawHeight - (i / maxY) * drawHeight;
                    ctx.moveTo(padding.left, y);
                    ctx.lineTo(padding.left + drawWidth, y);
                }
                ctx.stroke();

                // --- Draw Text Labels (Fixed, not animated) ---
                // Y Labels
                ctx.fillStyle = '#8E8E93';
                ctx.font = '500 10px Inter, sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                
                for (let i = 0; i <= maxY; i += 7) { 
                    const y = padding.top + drawHeight - (i / maxY) * drawHeight;
                    ctx.fillText(i.toString(), padding.left - 8, y);
                }

                // X Labels
                ctx.textAlign = 'center';
                ctx.fillStyle = '#8E8E93';
                
                let lastLabelX = -100;
                data.dates.forEach((dateStr, i) => {
                    const [y, m, d] = dateStr.split('-').map(Number);
                    const isKeyDate = d === 1 || d === 15; // 1st and 15th
                    
                    if (isKeyDate) {
                        const x = padding.left + (i / (data.dates.length - 1)) * drawWidth;
                        
                        if (x - lastLabelX > 35) {
                            const dateObj = new Date(y, m - 1, d);
                            const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                            const label = `${d} ${monthName}`;
                            
                            ctx.fillText(label, x, height - 10);
                            
                            // Vertical Grid Line
                            ctx.save();
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                            ctx.setLineDash([2, 4]);
                            ctx.beginPath();
                            ctx.moveTo(x, padding.top);
                            ctx.lineTo(x, height - padding.bottom);
                            ctx.stroke();
                            ctx.restore();
                            
                            lastLabelX = x;
                        }
                    }
                });

                // --- Draw Series with Animation ---
                data.series.forEach(series => {
                    const fullPoints = series.values.map((val, i) => {
                        const x = padding.left + (i / (data.dates.length - 1)) * drawWidth;
                        const y = padding.top + drawHeight - (Math.min(val, maxY) / maxY) * drawHeight;
                        return { x, y };
                    });

                    if (fullPoints.length > 0) {
                        // Calculate subset of points based on progress
                        const maxIndex = Math.floor((fullPoints.length - 1) * easeProgress);
                        const partialPoints = fullPoints.slice(0, maxIndex + 1);
                        
                        // Add interpolated last point for smoothness
                        if (maxIndex < fullPoints.length - 1) {
                            const nextPoint = fullPoints[maxIndex + 1];
                            const currPoint = fullPoints[maxIndex];
                            const segmentProgress = (easeProgress * (fullPoints.length - 1)) - maxIndex;
                            
                            const interX = currPoint.x + (nextPoint.x - currPoint.x) * segmentProgress;
                            const interY = currPoint.y + (nextPoint.y - currPoint.y) * segmentProgress;
                            partialPoints.push({ x: interX, y: interY });
                        }

                        if (partialPoints.length >= 1) {
                            // 1. Glow Effect (Draw first for backdrop)
                            ctx.save();
                            ctx.shadowColor = series.color;
                            ctx.shadowBlur = 15;
                            ctx.strokeStyle = series.color;
                            ctx.lineWidth = 3;
                            ctx.lineJoin = 'round';
                            ctx.lineCap = 'round';
                            ctx.globalAlpha = 0.6 * easeProgress; // Fade in glow
                            
                            ctx.beginPath();
                            ctx.moveTo(partialPoints[0].x, partialPoints[0].y);
                            partialPoints.forEach(p => ctx.lineTo(p.x, p.y));
                            ctx.stroke();
                            ctx.restore();

                            // 2. Main Line
                            ctx.strokeStyle = series.color;
                            ctx.lineWidth = 2; // Slightly thinner core
                            ctx.lineJoin = 'round';
                            ctx.lineCap = 'round';
                            ctx.beginPath();
                            ctx.moveTo(partialPoints[0].x, partialPoints[0].y);
                            partialPoints.forEach(p => ctx.lineTo(p.x, p.y));
                            ctx.stroke();

                            // 3. Area Fill (Gradient)
                            const gradient = ctx.createLinearGradient(0, padding.top, 0, height);
                            gradient.addColorStop(0, this.hexToRgba(series.color, 0.3));
                            gradient.addColorStop(1, this.hexToRgba(series.color, 0));
                            
                            ctx.save();
                            ctx.globalAlpha = easeProgress; // Fade in fill
                            ctx.beginPath();
                            ctx.moveTo(partialPoints[0].x, partialPoints[0].y);
                            partialPoints.forEach(p => ctx.lineTo(p.x, p.y));
                            // Close path down to bottom
                            ctx.lineTo(partialPoints[partialPoints.length-1].x, height - padding.bottom);
                            ctx.lineTo(partialPoints[0].x, height - padding.bottom);
                            ctx.closePath();
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            ctx.restore();
                        }
                    }
                });

                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

                if (progress < 1) {
                    canvas.animationId = requestAnimationFrame(renderFrame);
                } else {
                    canvas.animStartTime = null; // Reset for next time logic if needed
                }
            } catch (e) {
                console.error("Chart render error:", e);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        };

        canvas.animationId = requestAnimationFrame(renderFrame);
    }
};