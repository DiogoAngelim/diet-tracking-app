
import argparse
from PIL import Image
import pytesseract

def main():
    parser = argparse.ArgumentParser(description='OCR script (Tesseract version)')
    parser.add_argument('--image', required=True, help='Path to the image file')
    args = parser.parse_args()

    # Open the image
    image = Image.open(args.image)
    # Run OCR
    text = pytesseract.image_to_string(image)
    print('OCR Result:')
    print(text)

if __name__ == '__main__':
    main()
