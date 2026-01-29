import moviepy
from moviepy import VideoClip
import numpy as np
import os
import math
from PIL import Image, ImageDraw

# Configuration
OUTPUT_DIR = "output_gifs"
# Colors in 0-255 range
BG_COLOR = (13, 13, 13)       # Dark Grey/Black
FG_COLOR = (255, 255, 255)    # White
SIZE = 128                    # Output size
SCALE = 4                     # Supersampling factor for antialiasing
DRAW_SIZE = SIZE * SCALE
DURATION = 2.0
FPS = 30

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def get_base_image():
    return Image.new("RGB", (DRAW_SIZE, DRAW_SIZE), BG_COLOR)

def finalize_image(img):
    """Resize with antialiasing and convert to numpy"""
    img = img.resize((SIZE, SIZE), resample=Image.LANCZOS)
    return np.array(img)

# --- Animation Factories ---

def create_spinner(speed=1.0, arc_deg=240, reverse=False, start_angle=0):
    def maker(t):
        img = get_base_image()
        draw = ImageDraw.Draw(img)
        
        c = DRAW_SIZE / 2
        r = DRAW_SIZE * 0.3
        width = 8 * SCALE
        
        # Rotation
        direction = -1 if reverse else 1
        rotation = start_angle + (360 * (t / DURATION) * speed * direction)
        
        start = rotation
        end = rotation + arc_deg
        
        bbox = [c - r, c - r, c + r, c + r]
        # PIL arc angles are weird, negating for standard clockwise behavior visually
        draw.arc(bbox, start=-end, end=-start, fill=FG_COLOR, width=width)
        
        return finalize_image(img)
    return maker

def create_dots(speed=1.0, phase_offset=0.0):
    def maker(t):
        img = get_base_image()
        draw = ImageDraw.Draw(img)
        
        c_y = DRAW_SIZE / 2
        spacing = DRAW_SIZE * 0.25
        start_x = (DRAW_SIZE - (spacing * 2)) / 2
        
        base_r = DRAW_SIZE * 0.08
        
        for i in range(3):
            # Phase shift
            # Original phase was i * 0.5
            p = (i * 0.5) + phase_offset
            
            # Sine wave
            val = 0.5 + 0.5 * np.sin(2 * np.pi * (t / DURATION) * 2 * speed - p)
            scale = 0.5 + 0.5 * val
            
            r = base_r * scale
            x = start_x + i * spacing
            
            bbox = [x - r, c_y - r, x + r, c_y + r]
            draw.ellipse(bbox, fill=FG_COLOR)
            
        return finalize_image(img)
    return maker

def create_fade_circles(speed=1.0, count=8, tail_length=1.0):
    def maker(t):
        img = get_base_image()
        # RGBA for transparency calculation (manual) or composition
        # We'll use manual color interpolation on black background to avoid complex compositing if possible,
        # but RGBA layer is safer for smooth fade.
        rgba_img = Image.new("RGBA", (DRAW_SIZE, DRAW_SIZE), (0,0,0,0))
        draw_rgba = ImageDraw.Draw(rgba_img)
        
        c = DRAW_SIZE / 2
        radius = DRAW_SIZE * 0.3
        dot_r = DRAW_SIZE * 0.05
        
        current_angle = 2 * np.pi * (t / DURATION) * speed
        
        for i in range(count):
            angle = (2 * np.pi * i) / count
            
            # Opacity logic
            diff = (angle - current_angle) % (2 * np.pi)
            
            # tail_length: 1.0 = full circle fade, 0.5 = short tail
            alpha_norm = 1.0 - (diff / (2 * np.pi * tail_length))
            if alpha_norm < 0: alpha_norm = 0
            
            # Min opacity to keep dots visible? Or full fade? 
            # Reference usually has them fade out completely or to very dim.
            alpha_norm = max(0.1, alpha_norm)
            
            alpha_int = int(255 * alpha_norm)
            
            x = c + radius * np.cos(angle)
            y = c + radius * np.sin(angle)
            
            bbox = [x - dot_r, y - dot_r, x + dot_r, y + dot_r]
            color = FG_COLOR + (alpha_int,)
            
            draw_rgba.ellipse(bbox, fill=color)
        
        base = Image.new("RGBA", (DRAW_SIZE, DRAW_SIZE), BG_COLOR + (255,))
        out = Image.alpha_composite(base, rgba_img)
        return finalize_image(out.convert("RGB"))
    return maker

def create_wifi(speed=1.0, reverse=False):
    def maker(t):
        img = get_base_image()
        draw = ImageDraw.Draw(img)
        
        c_x = DRAW_SIZE / 2
        c_y = DRAW_SIZE * 0.8
        
        step_duration = (DURATION / 4) / speed
        # t is 0..DURATION.
        # We want continuous cycling.
        
        cycle_t = t % (step_duration * 5) # 4 steps + pause
        step = int(cycle_t / step_duration)
        
        if reverse:
            # 3 -> 2 -> 1 -> 0
            step = 3 - step
            if step < -1: step = -1 # All off
            
        # Dot
        dot_active = step >= 0 if not reverse else step >= 0
        dot_color = FG_COLOR if dot_active else (100, 100, 100)
        dot_r = DRAW_SIZE * 0.04
        bbox_dot = [c_x - dot_r, c_y - dot_r, c_x + dot_r, c_y + dot_r]
        draw.ellipse(bbox_dot, fill=dot_color)
        
        # Arcs
        radii = [DRAW_SIZE*0.15, DRAW_SIZE*0.25, DRAW_SIZE*0.35]
        width = 6 * SCALE
        
        for i, r in enumerate(radii):
            is_active = step > i
            color = FG_COLOR if is_active else (80, 80, 80)
            
            bbox = [c_x - r, c_y - r, c_x + r, c_y + r]
            draw.arc(bbox, start=225, end=315, fill=color, width=width)
            
        return finalize_image(img)
    return maker

def create_clock(speed=1.0, start_hour=12):
    def maker(t):
        img = get_base_image()
        draw = ImageDraw.Draw(img)
        
        c = DRAW_SIZE / 2
        r = DRAW_SIZE * 0.4
        width_face = 4 * SCALE
        width_hand = 3 * SCALE
        
        bbox = [c - r, c - r, c + r, c + r]
        draw.ellipse(bbox, outline=FG_COLOR, width=width_face)
        
        # Hands
        # Minute hand: 1 rotation per duration (usually) * speed
        # Let's make it standard: 1 hr passes in DURATION
        
        # Hour offset
        h_offset = (start_hour / 12) * 2 * np.pi
        
        # Progression
        prog = (t / DURATION) * speed
        
        angle_m = 2 * np.pi * prog * 12 # 12 hours = 12 rotations of minute hand
        angle_h = h_offset + (2 * np.pi * prog) # 1 rotation of hour hand
        
        # Minute
        x_m = c + (r * 0.8) * np.sin(angle_m)
        y_m = c - (r * 0.8) * np.cos(angle_m)
        draw.line([c, c, x_m, y_m], fill=FG_COLOR, width=width_hand)
        
        # Hour
        x_h = c + (r * 0.5) * np.sin(angle_h)
        y_h = c - (r * 0.5) * np.cos(angle_h)
        draw.line([c, c, x_h, y_h], fill=FG_COLOR, width=width_hand+int(1*SCALE))
        
        return finalize_image(img)
    return maker

def create_ball(speed=1.0, bounce_height_factor=1.0):
    def maker(t):
        img = get_base_image()
        draw = ImageDraw.Draw(img)
        
        ground_y = DRAW_SIZE * 0.8
        radius = DRAW_SIZE * 0.08
        bounce_height = DRAW_SIZE * 0.5 * bounce_height_factor
        
        # Speed affects phase multiplier
        # 1.0 speed = 2 bounces per DURATION
        freq = 2 * speed
        
        phase = t / (DURATION / freq)
        h = abs(math.sin(phase * math.pi))
        
        y = ground_y - (h * bounce_height)
        x = DRAW_SIZE / 2
        
        bbox = [x - radius, y - radius, x + radius, y + radius]
        draw.ellipse(bbox, fill=FG_COLOR)
        
        return finalize_image(img)
    return maker


def generate_gif(filename, maker_func):
    print(f"Generating {filename}...")
    clip = VideoClip(maker_func, duration=DURATION)
    clip.write_gif(os.path.join(OUTPUT_DIR, filename), fps=FPS, logger=None)

def generate_html_preview(categories_data):
    import time
    timestamp = int(time.time())
    
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Vector GIFs Preview</title>
        <style>
            body { 
                background-color: #0d0d0d; 
                color: #888; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                padding: 60px; 
                display: flex;
                justify-content: center;
                margin: 0;
            }
            .grid-container {
                display: grid; 
                grid-template-columns: repeat(5, auto); 
                gap: 20px; 
                max_width: 800px;
            }
            .section-label { 
                grid-column: 1 / -1; 
                font-size: 11px; 
                font-weight: 700; 
                text-transform: uppercase; 
                letter-spacing: 1.5px; 
                margin-top: 30px; 
                margin-bottom: 5px; 
                color: #555;
            }
            .icon-box { 
                width: 72px; 
                height: 72px; 
                background: #141414; 
                border-radius: 18px; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                transition: transform 0.2s, background 0.2s;
            }
            .icon-box:hover {
                background: #1f1f1f;
                transform: scale(1.05);
            }
            img { 
                width: 48px; 
                height: 48px; 
                object-fit: contain; 
                opacity: 0.9;
            }
        </style>
    </head>
    <body>
        <div class="grid-container">
            {content}
        </div>
    </body>
    </html>
    """
    
    content_html = ""
    
    for label, base_name, count in categories_data:
        content_html += f'<div class="section-label">{label}</div>\n'
        for i in range(1, count + 1):
            fname = f"{base_name}_{i}.gif"
            content_html += f'''
            <div class="icon-box">
                <img src="{fname}?v={timestamp}" alt="{label} {i}">
            </div>
            '''
            
    with open(os.path.join(OUTPUT_DIR, "preview.html"), "w") as f:
        f.write(html_template.replace("{content}", content_html))
    
    print(f"Generated preview: {os.path.join(OUTPUT_DIR, 'preview.html')}")

def main():
    print("Starting Vector GIF Generation (Variations)...")
    
    # Define variations
    # Each entry: (Label, base_filename, [list of makers])
    
    # 1. Spinners
    spinners = [
        create_spinner(speed=1.0),                  # Normal
        create_spinner(speed=3.0),                  # Very Fast
        create_spinner(speed=0.5, arc_deg=90),      # Slow, quarter circle
        create_spinner(speed=1.0, reverse=True),    # Reverse
        create_spinner(speed=2.0, arc_deg=340)      # Fast, full circle
    ]
    
    # 2. Dots
    dots = [
        create_dots(speed=1.0),                     # Normal
        create_dots(speed=2.0),                     # Fast pulse
        create_dots(speed=1.0, phase_offset=2.0),   # Wave
        create_dots(speed=0.5),                     # Slow breath
        create_dots(speed=3.0, phase_offset=0.5)    # Chaotic
    ]
    
    # 3. Fade Circles
    fades = [
        create_fade_circles(speed=1.0),             # Normal
        create_fade_circles(speed=2.5),             # Fast spin
        create_fade_circles(speed=0.5, count=6),    # Low count, slow
        create_fade_circles(speed=-1.0),            # Reverse
        create_fade_circles(speed=1.0, tail_length=0.2) # Very short tail
    ]
    
    # 4. Ball
    balls = [
        create_ball(speed=1.0),                     # Normal
        create_ball(speed=2.0, bounce_height_factor=0.5), # Fast low bounce
        create_ball(speed=0.5, bounce_height_factor=1.4), # Slow high bounce
        create_ball(speed=1.5, bounce_height_factor=0.2), # Dribble
        create_ball(speed=0.8, bounce_height_factor=0.8)  # Gentle
    ]
    
    # 5. Clock
    clocks = [
        create_clock(speed=1.0, start_hour=12),     # Normal
        create_clock(speed=5.0, start_hour=3),      # Time flies
        create_clock(speed=0.2, start_hour=6),      # Slow motion
        create_clock(speed=-2.0, start_hour=9),     # Rewind
        create_clock(speed=10.0, start_hour=12)     # Hyper speed
    ]
    
    # 6. Wifi
    wifis = [
        create_wifi(speed=1.0),                     # Normal
        create_wifi(speed=2.0),                     # Fast search
        create_wifi(speed=0.5),                     # Slow connection
        create_wifi(speed=3.0, reverse=True),       # Rapid drain
        create_wifi(speed=1.0, reverse=True)        # Disconnecting
    ]
    
    tasks = [
        ("CIRCLE", "spinner", spinners),
        ("DOTS", "dots_pulse", dots),
        ("FADE CIRCLES", "fade_circles", fades),
        ("BALL", "ball_bounce", balls),
        ("TIME", "clock", clocks),
        ("WIFI", "wifi", wifis)
    ]
    
    preview_data = []
    
    for label, base_name, variants in tasks:
        preview_data.append((label, base_name, len(variants)))
        for i, maker in enumerate(variants, 1):
            fname = f"{base_name}_{i}.gif"
            try:
                generate_gif(fname, maker)
            except Exception as e:
                print(f"Error generating {fname}: {e}")
                
    generate_html_preview(preview_data)
    print(f"Done! Check {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
