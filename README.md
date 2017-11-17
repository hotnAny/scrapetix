<!-- ![alt text](https://cdnd.icons8.com/wp-content/uploads/2015/06/Website-Under-Construction.jpg "under construction") -->

# scrapetix

a script to scrape (sports) tickets deals from SeatGeek (https://seatgeek.com/), which means it has limited generalizability beyond this particular website ...

main features:
* customized tickets scraping for your favorite team, price range, etc. (see the customization section)
* recurring scraping with email notification of new deals
* edit configuration file on-the-fly without having to restart the script

### Installing
might need to [install phantomjs](http://phantomjs.org/download.html) first

then install other required packages:
```shell
npm i
```

### Getting Started
use phantomjs to run the scraping script:
```shell
node run_scrape.js
```

### Customization
1. to receive deal alert via email, you need to create a [private.yml](private.yml) file with your email information
```yaml
smtp: <smtp server of you preferred email service>
port: <the port number>
user: <your user name>
pass: <your password>
```
2. you can customize [config.yml](config.yml) file to choose your favorite team, price, etc.
```yaml
# [your info]
email: 'xiangchen@acm.org'

# [your team]
urlGames: 'https://seatgeek.com/pittsburgh-penguins-tickets'
# use the team's name (replace space if there's any with '-'') 
# to indicate location, e.g., 'penguins' means at pittsburgh
locGames: 'penguins'

# [interval between two consective scrapes]
# = fixed + random(0, 1) * flexible
fixedInterval: 50000 # 50 sec
flexibleInterval: 150000 # 150 sec

# [filtering criteria]
# - OR between entries
# - AND within each entry
# e.g., the following means scraping ticket deals that satisfy
# (score>=95) OR (score>=88 AND maxPrice<$30 AND year==2017)
#
# accepting the following criteria:
# - score
# - maxPrice/minPrice
# - year
filters:
  - score: 95
  - score: 88
    maxPrice: 30
    year: 2017
```

## (Mainly) Built With
* [node.js](https://nodejs.org/)
* [phantomjs](http://phantomjs.org/)

## License

this project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
