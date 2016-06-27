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

def makeField(name, rect):
    annot = PdfDict()
    annot.Type = PdfName.Annot
    annot.Subtype = PdfName.Widget
    annot.FT = PdfName.Tx
    annot.Ff = 2 | (1 << 12)
    annot.Rect = PdfArray(rect)
    annot.T = PdfString.encode(name)
    annot.V = PdfString.encode("f\nwtf")

    annot.AP = PdfDict()
    ap = annot.AP.N = PdfDict()
    ap.Type = PdfName.XObject
    ap.Subtype = PdfName.Form
    ap.FormType = 1

    return annot

annots = [makeField('hello',[0, 0, 160*2, 144*2])]

page.Annots = PdfArray(annots)

page.AA = PdfDict()
page.AA.O = PdfDict()
page.AA.O.S = PdfName.JavaScript
page.AA.O.JS = """
/*global.help = 0;
app.setInterval('(' + (function() {
  var field = this.getField("TextBox01");
  field.value = 'hi' + 'there';
}).toString() + ')()', 20)*/
"""


out = PdfWriter()
out.addpage(page)
out.write('result.pdf')
