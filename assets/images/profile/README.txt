HERO PROFILE FRAMES
Replace the placeholder frame-01.svg ... frame-08.svg with your own photos / animation frames.
Name them frame-01.jpg, frame-02.jpg ...   then in js/data.js:
  hero.frames = { folder:"assets/images/profile/", prefix:"frame-", pad:2, ext:"jpg", count:<how many>, fps:<speed>, start:1 }
Use a single image by setting count:1.
