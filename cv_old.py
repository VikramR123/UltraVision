# import the necessary packages
#from scipy.spatial import distance as dist
# from imutils import perspective
# from imutils import contours
import numpy as np
import argparse
from PIL import Image
from math import sqrt

img = Image.open("./assets/ultrasound.png")
pixels = np.array(img)

width, height, channels = pixels.shape

actual_height = 46
actual_units = "cm"

(x1, y1) = (330, 580)
(x2, y2) = (333, 635)

pixel_distance = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

actual_distance = (pixel_distance / height) * actual_height

print(f"The distance between the two points is about {actual_distance:.3f} {actual_units}")


# import imutils
# import cv2
# def midpoint(ptA, ptB):
# 	return ((ptA[0] + ptB[0]) * 0.5, (ptA[1] + ptB[1]) * 0.5)
# # construct the argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("-i", "--image", required=True,
# 	help="path to the input image")
# ap.add_argument("-w", "--width", type=float, required=True,
# 	help="width of the left-most object in the image (in inches)")
# args = vars(ap.parse_args())