all: breakout.pdf

install-deps:
	sudo pip install pdfrw

breakout.pdf:
	python generate_breakout.py

run-breakout.pdf: breakout.pdf
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" breakout.pdf

clean:
	rm breakout.pdf
