from PIL import Image, ImageDraw
import os

os.makedirs('icons', exist_ok=True)

def draw(size):
    scale = 4
    S = size * scale
    s = S / 128.0
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # rounded dark square with subtle gradient feel (solid + accent border)
    d.rounded_rectangle([4*s, 4*s, 124*s, 124*s], radius=26*s, fill=(38, 36, 33, 255))
    d.rounded_rectangle([4*s, 4*s, 124*s, 124*s], radius=26*s, outline=(129, 182, 76, 255), width=int(3*s))
    # white king silhouette (scaled from cburnett proportions, simplified)
    cx = 64*s
    # cross on top
    d.rectangle([60*s, 14*s, 68*s, 30*s], fill=(250, 250, 250, 255))
    d.rectangle([54*s, 20*s, 74*s, 26*s], fill=(250, 250, 250, 255))
    # head circle
    d.ellipse([50*s, 26*s, 78*s, 54*s], fill=(250, 250, 250, 255))
    # body (trapezoid)
    d.polygon([(46*s, 52*s), (82*s, 52*s), (92*s, 96*s), (36*s, 96*s)], fill=(250, 250, 250, 255))
    # base
    d.rounded_rectangle([30*s, 96*s, 98*s, 112*s], radius=6*s, fill=(250, 250, 250, 255))
    # inner accent line
    d.rounded_rectangle([34*s, 100*s, 94*s, 108*s], radius=4*s, fill=(129, 182, 76, 255))
    img = img.resize((size, size), Image.LANCZOS)
    img.save(f'icons/icon-{size}.png')
    print(f'icons/icon-{size}.png {size}x{size}')

for size in (16, 48, 128):
    draw(size)
