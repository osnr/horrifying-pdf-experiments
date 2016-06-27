from pdfrw import PdfWriter
from pdfrw.objects.pdfname import PdfName
from pdfrw.objects.pdfstring import PdfString
from pdfrw.objects.pdfdict import PdfDict
from pdfrw.objects.pdfarray import PdfArray

page = PdfDict()
page.Type = PdfName.Page

page.Resources = PdfDict()
page.Resources.Font = PdfDict()
page.Resources.Font.F1 = PdfDict()
page.Resources.Font.F1.Type = PdfName.Font
page.Resources.Font.F1.Subtype = PdfName.Type1
page.Resources.Font.F1.BaseFont = PdfName.Helvetica

page.MediaBox = PdfArray([0, 0, 612, 792])

page.Contents = PdfDict()
page.Contents.stream = """
BT
/F1 24 Tf
250 700 Td (Open me in Chrome!) Tj
ET
"""

annot = PdfDict()
annot.Type = PdfName.Annot
annot.Subtype = PdfName.Widget
annot.FT = PdfName.Tx
annot.Ff = 2
annot.Rect = PdfArray([250, 500, 400, 535])
annot.T = PdfString.encode('TextBox01')
annot.V = PdfString.encode('wow weird. click me and type!!')

annot.AP = PdfDict()
ap = annot.AP.N = PdfDict()
ap.Type = PdfName.XObject
ap.Subtype = PdfName.Form
ap.FormType = 1
ap.BBox = PdfArray([0.0, 0.0, 150.0, 32.0])
ap.Matrix = PdfArray([1.0, 0.0, 0.0, 1.0, 0.0, 0.0])
ap.Length = 61
ap.stream = """
0.75 g
0.0 0.0 150 32 re f
0.00 G
0.5 0.5 149 31 re s
"""

page.Annots = PdfArray([annot])

page.AA = PdfDict()
page.AA.O = PdfDict()
page.AA.O.S = PdfName.JavaScript
page.AA.O.JS = """
global.origX = this.getField("TextBox01").rect[0];
global.vx = -5;
app.setInterval('(' + (function() {
  var field = this.getField("TextBox01");
  field.rect = [field.rect[0] + global.vx, field.rect[1], field.rect[2], field.rect[3]];
  if (field.rect[0] < 5) {
    global.vx = 5;
  } 
  if (field.rect[0] > global.origX) {
    global.vx = -5;
  }
}).toString() + ')()', 20)
"""


out = PdfWriter()
out.addpage(page)
out.write('result.pdf')
