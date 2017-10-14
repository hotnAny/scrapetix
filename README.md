![alt text](https://cdnd.icons8.com/wp-content/uploads/2015/06/Website-Under-Construction.jpg "under construction")

# scrapetix

a script to scrape (sports) tickets deals from SeatGeek (https://seatgeek.com/)

### Installing
installing required packages:
```
npm i
```

## Getting Started
use phantomjs to run the scraping script:
```
./phantomjs scrapetix.js
```
### Customization
1. to receive deal alert via email, you need to create a [private.yml](private.yml) file with your email information
```
smtp: <smtp server of you preferred email service>
port: <the port number>
user: <your user name>
pass: <your password>
```
2. you can customize [config.yml](config.yml) file to choose your favorite team, price, etc.
```
# [your info]
email: 'xiangchen@acm.org'

# [your team]
urlGames: 'https://seatgeek.com/pittsburgh-penguins-tickets'
# use the team's name (replace space with -) to indicate location
# e.g., 'penguins' means at pittsburgh
locGames: 'penguins'

# [filtering criteria]
greatDealScore: 97
okDealScore: 88
cheapPrice: 30

# [scraping frequency]
fixedInterval: 50000 # 50 sec
flexibleInterval: 150000 # 150 sec
```

## (Mainly) Built With
* [node.js](https://nodejs.org/)
* [phantomjs](http://phantomjs.org/)

## License

this project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
