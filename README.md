# CanvasBitCup
Streamlabs Tip Jar mod made for artists. 


The concept is simple: You have two images. One is a **visual** image that everyone will see on your stream. The other is the **wall** image this mod will use to generate the barriers that bits and other objects bounce off of.

Example:

**Visual** Image: https://i.imgur.com/uOJDOjO.png

**Wall** Image: https://i.imgur.com/ZAYnLz9.png

Some guidelines for creating the **wall** image:
- Make the wall image on a separate layer so you can export both with the same resolution. That will also help with positioning.
- Colors dont matter. The mod just looks for parts that are not fully transparent. 
- Use a brush set to around 30px. There were be slight accuracy lost so focus more on broad strokes



## Adding images


Once both images are ready:
- Export as png (other formats should work as well but png was what I did all my testing with).
- Use imgur to upload the images (there were issues when trying to use images hosted as discord links. imgur has been working without issue.)
- Right click on the images in imgur and select *Open image in new tab*.
- Copy the link in the address bar.
- Open streamlabs and navigate to the Tip Jar. 
- Next to *Enable Custom HTML/CSS* select Enabled.
- Ignore the HTML tab, if there is anything in it just delete the contents of it.
- Click on CSS and replace the contents of the editor with what is currently in [this](./src/CSS.css).
- Click on JS and replace the contents of the editor with what is currently in [this](./src/JavaScript.js).
- See below image for guide to adding both the **visual** and **wall** images to the code. (Ignore the fact that the same url is used for both the wall and visual images, I may or may not have been testing something silly).



![visual setup guide](visual_setup_guide.png)

## I want to see what you create!
Feel free to [tweet](https://twitter.com/_Script_Daddy_) at me with your creations! I love seeing what people come up with!

I can also be found on [Twitch](https://www.twitch.tv/script_daddy)

## FAQ


Q: Do I need to know how to code to set this up?

A: No! I have spent days trying to make everything about this as simple as possible so that anyone can follow the instructions to set it up. I will be trying to find ways to make it even easier for people.

Q: When I click on Test, the walls come out as oddly shaped blocks. Is this normal? 

A: Yes! This was done because of difficulties with adding walls that were oddly shaped. This is a compromise in design that reduces accuracy of the resulting walls but gives larger benefits to performance and is actually less buggy for curved shapes.


Q: Why is my test jar missing large sections of the walls i drew? 

A: In rare cases, an image with small complex details will take too long to map out. To prevent severe lag, there is a point where it will abandon the grouping and move on to looking for other groupings. There are countermeasures in place to prevent this and I have not been able to force it to occur since. 


Q: Does the wall image have to match parts of the visual image?

A: NOPE! You can make them completely separate drawings with no overlap between them at all! The code itself doesnt even look at the visual image for anything. We just place it there so that Streamlabs' code can show it. The wall image is the one we actually analyze.


Q: My walls are slightly offset from the visual image by a noticeable amount, is this normal?

A: This has been a tricky bug that I have been trying to fix. Right now, just update your **wall** image by moving it slightly in the opposite direction. I have never been able to replicate it on my machine but I have seen this happen to a couple of friends in different browsers. It is a strange bug.




























