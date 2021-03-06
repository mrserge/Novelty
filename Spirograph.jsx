﻿//DESCRIPTION:Draw Spirograph
// Jongware, 27-Jun-2010

myDialog = app.dialogs.add ({name:"Spirograph Swirlies",canCancel:true});

with (myDialog)
{
	with (dialogColumns.add())
	{
		with (dialogRows.add())
		{
			with (dialogColumns.add())
			{
				with (borderPanels.add())
				{
					with (dialogColumns.add())
					{
						with (dialogRows.add())
							staticTexts.add ({staticLabel:"Outer radius"});
						with (dialogRows.add())
							aBox = textEditboxes.add({editContents:"80"});
					}
					with (dialogColumns.add())
					{
						with (dialogRows.add())
							staticTexts.add ({staticLabel:"Outer radius 2"});
						with (dialogRows.add())
							a2Box = textEditboxes.add({editContents:""});
					}
				}
				with (borderPanels.add())
				{
					with (dialogColumns.add())
					{
						with (dialogRows.add())
							staticTexts.add ({staticLabel:"Inner radius"});
						with (dialogRows.add())
							bBox = textEditboxes.add({editContents:"13"});
					}
				}
				with (dialogRows.add())
					staticTexts.add ({staticLabel:"Thickness"});
				with (dialogRows.add())
					hBox = textEditboxes.add({editContents:"20"});
				with (dialogRows.add())
					staticTexts.add ({staticLabel:"Repeats"});
				with (dialogRows.add())
					rBox = textEditboxes.add({editContents:"5"});
				if (app.documents.length > 0)
				{
					with (dialogRows.add())
						dBox = checkboxControls.add({staticLabel:"New document", checkedState:true});
				}
			}
		}
	}
}
if (!myDialog.show())
{
	myDialog.destroy();
	exit(0);
}

a = Number(aBox.editContents);
if (a2Box.editContents.length)
	a2 = Number(a2Box.editContents);
else
	a2 = a;
b = Number(bBox.editContents);
h = Number(hBox.editContents);
reps = Number(rBox.editContents);
if (reps < 1) reps = 1;

if (app.documents.length == 0)
	newdoc = true;
else
	newdoc = dBox.checkedState;

hmeasure = app.viewPreferences.horizontalMeasurementUnits;
vmeasure = app.viewPreferences.verticalMeasurementUnits;

if (newdoc)
	doc = app.documents.add();
else
	doc = app.activeDocument;

doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

if (newdoc)
{
	doc.documentPreferences.pageWidth = 2*Math.abs(a2)-2*Math.abs(b)+2*Math.abs(h)+20;
	doc.documentPreferences.pageHeight = 2*Math.abs(a)-2*Math.abs(b)+2*Math.abs(h)+20;
	doc.pages[0].marginPreferences.left = 10;
	doc.pages[0].marginPreferences.right = 10;
	doc.pages[0].marginPreferences.top = 10;
	doc.pages[0].marginPreferences.bottom = 10;
}

doc.zeroPoint = [ app.activeDocument.documentPreferences.pageWidth/2, app.activeDocument.documentPreferences.pageHeight/2 ];

aa = Math.max(a,a2);
bb = b;
while (Math.round(aa) != aa || Math.round(bb) != bb)
{
	aa *= 10;
	bb *= 10;
}

nLoop = bb/greatestCommonFactor(aa,bb);
dif = 360*nLoop/reps;

color = 4;
if (color >= app.activeDocument.swatches.length)
	color = 2;

for (l=0; l<reps; l++)
{
	p = null;
	path = [];
	for (t=0; t<=nLoop*360; t+= 0.5)
	{
	
		x = (a2 - b) * Math.cos(t*Math.PI/180) + h * Math.cos ((t+l*dif)*((a - b)/b)*Math.PI/180);
		y = (a - b)  * Math.sin(t*Math.PI/180) - h * Math.sin ((t+l*dif)*((a - b)/b)*Math.PI/180);

		path.push ([x,y]);
		if (path.length > 10000)
		{
			if (p == null)
			{
				p = doc.graphicLines.add().paths[0];
				p.parent.strokeWeight = 0.1;
				p.parent.strokeColor = app.activeDocument.swatches[color];
			} else
				p = p.parent.paths.add();
			p.entirePath = path;
			path = [ [x,y] ];
		}
	}

	if (path.length > 1)
	{
		if (p == null)
		{
			p = doc.graphicLines.add().paths[0];
			p.parent.strokeWeight = 0.1;
			p.parent.strokeColor = app.activeDocument.swatches[color];
		} else
			p = p.parent.paths.add();
		p.entirePath = path;
	}
	color++;
	if (color == 3) color++;
	if (color >= app.activeDocument.swatches.length)
		color = 2;
}

function greatestCommonFactor (x,y)
{
	while (y != 0)
	{
		w = x % y;
		x = y;
		y = w;
	}
	return x;
}

doc.viewPreferences.horizontalMeasurementUnits = hmeasure;
doc.viewPreferences.verticalMeasurementUnits = vmeasure;