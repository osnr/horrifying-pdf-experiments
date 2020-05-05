all: breakout.pdf

install-deps:
	pip3 install pdfrw

breakout.pdf: README.pdf generate_breakout.py breakout.js
	python3 generate_breakout.py

run-breakout.pdf: breakout.pdf
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" breakout.pdf

README.pdf: README.md
	pandoc README.md --variable urlcolor=cyan -o README.pdf

clean:
	rm -f breakout.pdf
	rm -f README.pdf
