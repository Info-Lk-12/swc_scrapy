## SWC Scrapy
#### Web scraping with python, visualized with react

> Developed by [Davis_Software](https://github.com/Davis-Software) and [famijoku](https://github.com/famijoku) &copy; 2023

> This project uses [Software City](https://projects.software-city.org/) infrastructure

## Requirements
- Python 3.10 or higher
- venv and Pip
- Node 17 or higher

## Development
* Clone the repository and cd into it
```bash
git clone https://github.com/Info-Lk-12/swc_scrapy.git
cd swc_scrapy
```
* Activate the virtual environment
```bash
python -m venv venv
source venv/bin/activate
```
* Install dependencies and compile frontend
```bash
pip3 install -r requirements.txt
cd static/js/front_src
npm install
npm run build
cd ../../..
```
* Run the server
```bash
python3 app.py
```
