from PIL import Image

image_sizes = [48, 32, 16]
icons_dir = '../icons/'
icons_format = 'png'


def resize(w):
    img = Image.open('icons/icon128.png')
    wpercent = (w/float(img.size[0]))
    hsize = int((float(img.size[1])*float(wpercent)))
    img = img.resize((w, hsize), Image.Resampling.LANCZOS)
    img_name = 'icons/icon' + str(w) + '.png'
    img.save(img_name)


for size in image_sizes:
    resize(size)
