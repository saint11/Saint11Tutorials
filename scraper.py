import json

from autoscraper import AutoScraper

url = 'https://saint11.org/blog/pixel-art-tutorials/'

examples = ["""
<h5 id="1-bit-monochrome-black-and-white-one-color">#1-bit #monochrome #black and white #one color</h5>
<p><img src="../../img/pixel-tutorials/1-bit.gif" alt="alt text" title="1-bit"></p>
""", """<h5 id="wings-birds-fly">#wings #birds #fly</h5>
<p><img src="../../img/pixel-tutorials/Wings.gif" alt="alt text" title="Wings"></p>
"""]

scraper = AutoScraper()
result = scraper.build(url, examples)

f = open("scraped.json", "w")
f.write(json.dump(result))
f.close()
