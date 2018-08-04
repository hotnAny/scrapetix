////////////////////////////////////////////////////////////////////////////////////
//
//	script to scrape deals from seakgeek.com
//
//	by xiangchen@acm.org, v0.0, 10/2017
//
////////////////////////////////////////////////////////////////////////////////////

"use strict";

var page = require("webpage").create();
var yaml = require("js-yaml");
var fs = require("fs");
var process = require("child_process");
require("./xray"); // my javascript array extension

//
//	(to be read from config preriodically)
//
// preferrence
var urlGames;
var locGames;

//	scraping frequency (to be read from config preriodically)
var fixedInterval;
var flexibleInterval;

//	user email
var to;

//	filtering criteria for selecting deals
var filters;

//	other settings
var sendFailuresReport;
var maxNumCrawl;

//
//	other variables
//
var lsGameUrls = [];

var spawn = process.spawn;
var execFile = process.execFile;

var from = '"Tix Scraper 👻" <boo@tixscraper.com>';

var lsDeals = [];
var lsDealsPrev = [];

var delayRetry = 0;
var delayIncr = 250;
var maxNumRetry = 5;

var crawlCounter;

page.onConsoleMessage = function(msg) {
  if (msg == undefined) console.log("undefined!");
  else console.log("[scraptix] " + msg);
};

//
//	the main scraping function
//
var scrape = function() {
  // update config from local disk
  _updateConfig();

  page.open(urlGames, function(status) {
    console.log("open main page with games: " + status);
    if (status === "success") {
      page.includeJs(
        "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
        function() {
          lsGameUrls = page.evaluate(function(locs) {
            var ls = [];
            var checkList = {};
            var urlMain = "https://seatgeek.com";
            var lsEvents = $('a[class^="Desktop__ItemLink"]'); // this might change when the site is updated
            for (var i = 0; i < lsEvents.length; i++) {
              var urlPerGame = $(lsEvents[i]).attr("href");
              for (var j = 0; j < locs.length; j++) {
                if (urlPerGame.indexOf("at-" + locs[j]) >= 0) {
                  if (checkList[urlPerGame] == undefined) {
					ls.push(urlPerGame);
					console.log(urlPerGame)
                    checkList[urlPerGame] = true;
                  }
                  break;
                }
              }
            }
            return ls;
          }, locGames);

          console.log("crawling " + lsGameUrls.length + " games: ");
          crawlGameDeals(0);
        }
      );
    }
  });
};

//
//	second scraper for each game page
//
var p = require("webpage").create();
p.onConsoleMessage = page.onConsoleMessage;
p.settings.resourceTimeout = 5000;
p.viewportSize = {
  width: 480,
  height: 800
};

//
//	routines to scrape each game page
//
var crawlGameDeals = function(idx) {
  if (idx >= lsGameUrls.length) {
    _checkRedundancy();
    console.log("# of gathered deals: " + lsDealsPrev.length);
    console.log("# of incoming deals: " + lsDeals.length);
    if (lsDeals.length > 0) {
      var html = "";
      for (var i = 0; i < lsDeals.length; i++) {
        var deal = lsDeals[i];
        var link =
          deal.title +
          ': <a href="' +
          deal.url +
          '">' +
          deal.score +
          " for $" +
          deal.price +
          "</a><br>";
        console.log(link);
        html += link;
      }
      _sendMail(
        lsDeals.length + " Deal" + (lsDeals.length > 1 ? "s" : "") + "!",
        html
      );
    } else {
      rerun();
    }
    return;
  }

  var url = lsGameUrls[idx];
  console.log(
    "\n\ncrawling game #" +
      (idx + 1) +
      " of " +
      lsGameUrls.length +
      ": " +
      url +
      " ...\n\n"
  );
  p.open(url, function(status) {
    console.log("open individual game page: " + status);
    if (status === "success") {
      delayRetry = 0;
      setTimeout(function() {
        p.includeJs(
          "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
          function() {
            var dealInfos = p.evaluate(function(scraper) {
              var dealInfos = [];
              //   var dealTagClass = "omnibox__listing__deal-score";
              var dealTagClass = "ListingTicket__StyledDealScore";
              //   var dealTags = $("div." + dealTagClass);
			  var dealTags = $('[class^="ListingTicket__StyledDealScore"]');
			//   console.log(dealTags.length)
              var priceTagClass = "omnibox__listing__buy__price";
              var priceTags = $("span." + priceTagClass);
              //   var numTixTags = $("span[data-quantity=true]");

              //
              //	get deal price from specially formatted string
              //
              var _getDealPrice = function(strPrice) {
                var idxPrice = strPrice.indexOf("$");
                strPrice = strPrice.substring(idxPrice + 1);
                // var idxBracket = strPrice.indexOf("<");
				// strPrice = strPrice.substring(1, idxBracket);
				// console.log(strPrice)
                return parseFloat(strPrice);
              };

              console.log("got " + dealTags.length + " deals:");
              for (var i = 0; i < dealTags.length; i++) {
                var dealScore = parseFloat($(dealTags[i]).html());
                var dealPrice = _getDealPrice($(priceTags[i]).html());
                // var numTix = parseInt(
                //   $(numTixTags[i])
                //     .html()
                //     .match(/\d/g)
                //     .join("")
                // );
                console.log(dealScore + ": " + dealPrice); // + " x" + numTix);

                dealInfos.push({
                  title: document.title,
                  score: dealScore,
                  price: dealPrice
                  //   num: numTix
                });
              }

              return dealInfos;
            });

            for (var i = 0; i < dealInfos.length; i++) {
              var deal = dealInfos[i];
              deal.year = url.indexOf("2017") >= 0 ? 2017 : 2018;
              if (_filter(deal)) {
                deal.url = url;
                deal.id = _getGameId(deal.url);
                console.log("this is in: ");
                console.log(deal.title + ": " + deal.score + " $" + deal.price);
                lsDeals.push(deal);
              }
            }
          }
        );

        setTimeout(function() {
          crawlGameDeals(idx + 1);
        }, 250 + Math.random() * 750);
      }, 1000);
    } else {
      if (delayRetry >= delayIncr * maxNumRetry) {
        delayRetry = delayIncr;
        if (sendFailuresReport) _sendMail("Too-Many-Failures Report", "-_-b");
        else crawlGameDeals(idx + 1);
      }
      delayRetry += delayIncr;
      setTimeout(function() {
        crawlGameDeals(idx);
      }, 1000 + Math.random() * 1000 + delayRetry);
    }
  });
};

//
//	send mail to alert user of deals
//
var _sendMail = function(subject, html) {
  console.log(["sendMail.js", from, to, subject, html]);
  var child = spawn("node", ["sendMail.js", from, to, subject, html]);

  child.stdout.on("data", function(data) {
    console.log("spawnSTDOUT:", JSON.stringify(data));
  });

  child.stderr.on("data", function(data) {
    console.log("spawnSTDERR:", JSON.stringify(data));
  });

  child.on("exit", function(code) {
    console.log("spawnEXIT:", code);
    rerun();
  });
};

//
//	apply filter to select games (e.g., high deal score, low price)
//
var _filter = function(dealInfo) {
  for (var i = 0; i < filters.length; i++) {
    var score = filters[i].score || 0;
    var minPrice = filters[i].minPrice || 0;
    var maxPrice = filters[i].maxPrice || 100;
    var year = filters[i].year || dealInfo.year;
    var minNum = filters[i].minNum || 0;
    var maxNum = filters[i].maxNum || Number.MAX_VALUE;
    if (
      dealInfo.score >= score &&
      minPrice <= dealInfo.price &&
      dealInfo.price < maxPrice &&
      dealInfo.year == year
      //&&
      //   dealInfo.num >= minNum &&
      //   dealInfo.num <= maxNum
    ) {
      return true;
    }
  }
};

//
//	get game id from url
//
var _getGameId = function(url) {
  var idxLastSlash = url.lastIndexOf("/");
  return url.substring(idxLastSlash + 1);
};

//
//	check redundancy between gathered deals and incoming deals
//
var _checkRedundancy = function() {
  var toRemove = [];
  var toRemoveFromPrev = [];
  for (var i = 0; i < lsDealsPrev.length; i++) {
    var dealPrev = lsDealsPrev[i];
    var stillThere = false;
    for (var j = 0; j < lsDeals.length; j++) {
      var deal = lsDeals[j];
      if (
        deal.id == dealPrev.id &&
        deal.score == dealPrev.score &&
        deal.price == dealPrev.price
      ) {
        toRemove.push(deal);
        stillThere = true;
        break;
      }
    }
    if (!stillThere) toRemoveFromPrev.push(dealPrev);
  }

  for (var i = 0; i < toRemove.length; i++) lsDeals.remove(toRemove[i]);
  for (var i = 0; i < toRemoveFromPrev.length; i++)
    lsDealsPrev.remove(toRemoveFromPrev[i]);
};

//
//	update config by re-reading local yml file
//
var _updateConfig = function() {
  var config = yaml.safeLoad(fs.read("config.yml", "utf8"));
  to = config.email;
  urlGames = config.urlGames;
  locGames = config.locGames;
  fixedInterval = config.fixedInterval;
  flexibleInterval = config.flexibleInterval;
  filters = config.filters;
  sendFailuresReport = config.sendFailuresReport;
  maxNumCrawl = config.maxNumCrawl;
};

//
//	update gathered deals, rerun the scrape after a fixed+random time
//
var rerun = function() {
  if (++crawlCounter > maxNumCrawl) phantom.exit();

  lsDealsPrev = lsDealsPrev.concat(lsDeals);
  lsDeals = [];

  var interval = fixedInterval + Math.random() * flexibleInterval;
  var min = (interval / 1000 / 60) | 0;
  var sec = ((interval - min * 60 * 1000) / 1000) | 0;
  console.log("running again in " + min + " min " + sec + " sec ...");
  setTimeout(scrape, interval);
};

//
//	initial entrance
//
scrape();
