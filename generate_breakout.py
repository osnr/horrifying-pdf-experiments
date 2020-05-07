from pdfrw import PdfWriter, PdfReader
from pdfrw.objects.pdfname import PdfName
from pdfrw.objects.pdfstring import PdfString
from pdfrw.objects.pdfdict import PdfDict
from pdfrw.objects.pdfarray import PdfArray

from generate import make_field, make_js_action, make_page

PAGE_WIDTH = 612
PAGE_HEIGHT = 792

CANVAS_WIDTH = 612
CANVAS_HEIGHT = 400
CANVAS_BOTTOM = PAGE_HEIGHT - CANVAS_HEIGHT

PADDLE_WIDTH = 70
PADDLE_HEIGHT = 10
PADDLE_OFFSET_BOTTOM = CANVAS_BOTTOM + 10

BALL_WIDTH = 15
BALL_HEIGHT = 15

BRICK_ROW_COUNT = 5
BRICK_COLUMN_COUNT = 4
BRICK_WIDTH = 75
BRICK_HEIGHT = 20
BRICK_PADDING = 10

BRICK_OFFSET_BOTTOM = CANVAS_BOTTOM + 120
BRICK_OFFSET_LEFT = 100

# Every object we move, toggle on and off, or take events from must be
# an input widget for this to work in Chrome. In this case, we just
# use text fields.

# Chrome also doesn't implement `addField`, so we can't dynamically
# make these at runtime; we have to do it now at PDF creation time.

fields = []

# User won't see this default value; it gets set in JS.
fields.append(make_field(
    'countdown', x=280, y=650,
    width=300, height=100,
    r=1, g=1, b=1,
    value='Open in Chrome!'
))

paddle = make_field(
    'paddle',
    x=(CANVAS_WIDTH - PADDLE_WIDTH)/2, y=PADDLE_OFFSET_BOTTOM,
    width=PADDLE_WIDTH, height=PADDLE_HEIGHT,
    r=0.1, g=1.0, b=0.1
)
fields.append(paddle)

for c in range(0, BRICK_COLUMN_COUNT):
    for r in range(0, BRICK_ROW_COUNT):
        brick_x = r*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT
        brick_y = c*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM
        brick = make_field(
            'brick%d,%d' % (c, r),
            x=brick_x, y=brick_y,
            width=BRICK_WIDTH, height=BRICK_HEIGHT,
            r=0.5, g=0.5, b=0.5
        )
        fields.append(brick)

ball = make_field(
    'ball',
    x=(CANVAS_WIDTH - PADDLE_WIDTH)/2, y=CANVAS_BOTTOM + 30,
    width=BALL_WIDTH, height=BALL_HEIGHT,
    r=0.1, g=1.0, b=0.1
)
fields.append(ball)

score = make_field(
    'score',
    x=0, y=PAGE_HEIGHT - 50,
    width=50, height=20,
    r=0.9, g=0.9, b=0.9
)
fields.append(score)
lives = make_field(
    'lives',
    x=0, y=PAGE_HEIGHT - 100,
    width=50, height=20,
    r=0.9, g=0.9, b=0.9
)
fields.append(lives)

# A weird trick: Chrome PDFium doesn't expose mouse coordinates in its
# subset of PDF API, so there's no way to get a precise mouse X. So I
# create a tall text area at each pixel column and then just track the
# mouse-enter events on all the columns.
for x in range(0, CANVAS_WIDTH):
    band = make_field(
        'band' + str(x),
        x=x, y=0,
        width=1, height=CANVAS_BOTTOM,
        r=1, g=1, b=1
    )
    band.AA = PdfDict()
    band.AA.E = make_js_action("""
    global.mouseX = %d;
    """ % x)
    band.AA.Fo = make_js_action("""
    if (global.count < 0) global.paused = !global.paused;
    """)

    fields.append(band)

# See `breakout.js`: used to force rendering cleanup in Chrome.
fields.append(make_field(
    'whole', x=0, y=CANVAS_BOTTOM,
    width=CANVAS_WIDTH, height=CANVAS_HEIGHT,
    r=1, g=1, b=1
))

with open('breakout.js', 'r') as js_file:
    script = js_file.read()

# Share our constants with the JS script.
page = make_page(fields, """

var CANVAS_WIDTH = %(CANVAS_WIDTH)s;
var CANVAS_HEIGHT = %(CANVAS_HEIGHT)s;
var CANVAS_BOTTOM = %(CANVAS_BOTTOM)s;

var PADDLE_WIDTH = %(PADDLE_WIDTH)s;
var PADDLE_HEIGHT = %(PADDLE_HEIGHT)s;
var PADDLE_OFFSET_BOTTOM = %(PADDLE_OFFSET_BOTTOM)s;

var BALL_WIDTH = %(BALL_WIDTH)s;
var BALL_HEIGHT = %(BALL_HEIGHT)s;

var BRICK_ROW_COUNT = %(BRICK_ROW_COUNT)s;
var BRICK_COLUMN_COUNT = %(BRICK_COLUMN_COUNT)s;
var BRICK_WIDTH = %(BRICK_WIDTH)s;
var BRICK_HEIGHT = %(BRICK_HEIGHT)s;
var BRICK_PADDING = %(BRICK_PADDING)s;

var BRICK_OFFSET_BOTTOM = %(BRICK_OFFSET_BOTTOM)s;
var BRICK_OFFSET_LEFT = %(BRICK_OFFSET_LEFT)s;

%(script)s

""" % locals())

page.Contents.stream = """
BT
/F1 24 Tf
150 300 Td (Move your mouse down here!) Tj
40 -100 Td (also, README below...) Tj
ET
"""

readme = PdfReader('README.pdf')

out = PdfWriter()
out.addpage(page)
for readme_page in readme.pages:
    out.addpage(readme_page)
out.write('breakout.pdf')
