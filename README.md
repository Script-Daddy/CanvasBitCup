# CanvasBitCup
Streamlabs Tip Jar mod made for artists. 


Image you want the people to see: https://i.imgur.com/uOJDOjO.png

Image to determine where the walls are: https://i.imgur.com/ZAYnLz9.png

Create two images. The first will be what you want people to see. The second is just a completely transparent image that you draw out the walls with.
Some guidelines for creating the walls:
* Colors dont matter. I use black just to keep it simple. 
* Use a brush set to around 30px. There were be slight accuracy lost so focus more on broad strokes

Once both images are ready:
* Export as png (other formats should work as well).
* Use imgur to upload the wall image (there were issues when trying to use images hosted as discord links. imgur has been working without issue.)
* Right click on the image and select *Open image in new tab*
* Copy the link in the address bar.
* Open streamlabs and navigate to the Tip Jar. 
* For the wall image (the one you want to control what the bits bounce off of) locate the line that says *this.cupBarrierImg*
	*In between the single quotes (') replace the link that is there by default with your new one.
* Do the same for your actual tip jar image but place it in the line that starts with "jarEl.src"
* Click Test to see how the walls are getting built. Make sure there are no large gaps where there shouldnt. (as long as you kept to a large enough brush size)




















FAQ
Q: When I click on Test, the walls come out as oddly shaped blocks. Is this normal?
A: Yes! This was done because of difficulties with adding walls that were oddly shaped. This is a compromise in design that reduces accuracy of the resulting walls but gives larger benefits to performance and is actually less buggy for curved shapes.



Q: Why is my test jar missing large sections of the walls i drew? 
A: in rare cases, an image with small complex details will take too long to map out. To prevent severe lag, there is a point where it will abandon the grouping and move on to looking for other groupings. This SHOULD be a rare occurance.
































