# Run `python generate_breakout.py` to generate.

from pdfrw.objects.pdfname import PdfName
from pdfrw.objects.pdfstring import PdfString
from pdfrw.objects.pdfdict import PdfDict
from pdfrw.objects.pdfarray import PdfArray

from generate import make_field, make_js_action, generate_pdf

PAGE_WIDTH = 612
PAGE_HEIGHT = 792

CANVAS_WIDTH = 612
CANVAS_HEIGHT = 400
CANVAS_BOTTOM = PAGE_HEIGHT - CANVAS_HEIGHT

PADDLE_WIDTH = 70
PADDLE_HEIGHT = 10

BALL_WIDTH = 15
BALL_HEIGHT = 15

fields = []

paddle = make_field(
    'paddle',
    x=(CANVAS_WIDTH - PADDLE_WIDTH)/2, y=CANVAS_BOTTOM,
    width=PADDLE_WIDTH, height=PADDLE_HEIGHT,
    r=0.1, g=1.0, b=0.1
)
fields.append(paddle)

ball = make_field(
    'ball',
    x=(CANVAS_WIDTH - PADDLE_WIDTH)/2, y=CANVAS_BOTTOM - 10,
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

    fields.append(band)

fields.append(make_field(
    'whole', x=0, y=CANVAS_BOTTOM,
    width=CANVAS_WIDTH, height=CANVAS_HEIGHT,
    r=0, g=1, b=1
))

with open('breakout.js', 'r') as js_file:
    script = js_file.read()

    generate_pdf('breakout.pdf', fields, """

    var CANVAS_WIDTH = %(CANVAS_WIDTH)s;
    var CANVAS_HEIGHT = %(CANVAS_HEIGHT)s;
    var CANVAS_BOTTOM = %(CANVAS_BOTTOM)s;

    var PADDLE_WIDTH = %(PADDLE_WIDTH)s;
    var PADDLE_HEIGHT = %(PADDLE_HEIGHT)s;

    var BALL_WIDTH = %(BALL_WIDTH)s;
    var BALL_HEIGHT = %(BALL_HEIGHT)s;

    %(script)s

    """ % locals())
