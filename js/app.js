$(function () {
  let actionShow = "all";
  let actionSort = "1h";
  function init() {
    refresh();
    setInterval(function () {
      refresh();
    }, 10 * 1000);

    $(".filter-button").on("click", function () {
      actionShow = $(this).attr("action");
      refresh();
      //  $("tbody tr").hide();
      //  $(`tbody tr[interval="${action}"][isDuotou=1]`).show();
    })

    $(".sort-button").on("click", function () {
      $(".sort-button").removeClass("actived");
      $(this).addClass("actived");
      actionSort = $(this).attr("action");
      refresh();
    })
  }

  function voicePlay(word) {
    let url = "https://tts.baidu.com/text2audio?cuid=baike&spd=5&lan=ZH&ctp=1&pdt=301&vol=4&rate=32&per=0&tex=' " + encodeURI(word);
    let n = new Audio(url);
    n.src = url;
    n.play();//播放阅读
  }

  function refresh(qs) {
    $.ajax({
      type: "GET",
      url: "//monitor.alinger.cn/ema_info",
      success: function (result) {
        if (result.data) {
          renderHtml(result.data);
        }
      },
    });
  }

  function renderHtml(list) {
    let container = $("#emaList");
    container.html("");
    let sortList = list.sort((a, b) => {
      // let { price:price1, last1hPrice:last1hPrice1, last4hPrice:last4hPrice1, last24hPrice:last24hPrice1, symbol:symbol/1} = a;
      // let { price:price2, last1hPrice:last1hPrice2, last4hPrice:last4hPrice2, last24hPrice:last24hPrice2, symbol:symbol2} = b;
      let lastPrice1 = a[`last${actionSort}Price`], lastPrice2 = b[`last${actionSort}Price`], price1 = a.price, price2 = b.price;
      let p1_cent = (price1 - lastPrice1) / lastPrice1;
      let p2_cent = (price2 - lastPrice2) / lastPrice2;
      return Number(p2_cent) * 100 - Number(p1_cent) * 100;
    })
    sortList.forEach((item) => {
      let symbol = item.symbol.replace("usdt", "");
      let list = item.list;
      let duotouCount = 0;
      let isAllTemp = "";
      let { price, last1hPrice, last4hPrice, last24hPrice, maxPrice } = item;

      let last1hPrice_percent = Number((price - last1hPrice) / last1hPrice * 100).toFixed(2);
      let last4hPrice_percent = Number((price - last4hPrice) / last4hPrice * 100).toFixed(2);
      let last24hPrice_percent = Number((price - last24hPrice) / last24hPrice * 100).toFixed(2);

      let last1hPriceShow = last1hPrice_percent > 0 ? `<span class="up">${last1hPrice_percent}%</span>` : `<span class="down">${last1hPrice_percent}%</span>`;
      let last4hPriceShow = last4hPrice_percent > 0 ? `<span class="up">${last4hPrice_percent}%</span>` : `<span class="down">${last4hPrice_percent}%</span>`;
      let last24hPriceShow = last24hPrice_percent > 0 ? `<span class="up">${last24hPrice_percent}%</span>` : `<span class="down">${last24hPrice_percent}%</span>`;

      for (let i = 0; i < list.length; i++) {
        let ema = list[i];
        if (actionShow == "all" || actionShow == "allDuotou" || (actionShow == ema.interval)) {
          let temp = $("#emaTemp").html();
          if (ema.isDuotou) {
            duotouCount++;
          }
          temp = temp
            .replace("{{coinId}}", symbol)
            .replace("{{name}}", actionShow != "all" || actionShow == "allDuotou" || i == 0 ? `${symbol}【${price}】` : '')
            .replace(/{{interval}}/ig, ema.interval)
            .replace("{{atr}}", Number(ema.atr / price * 100).toFixed(2) + "%")
            .replace("{{last1hPrice}}", actionShow != "all" || actionShow == "allDuotou" || i == 0 ? last1hPriceShow : '')
            .replace("{{last4hPrice}}", actionShow != "all" || actionShow == "allDuotou" || i == 0 ? last4hPriceShow : '')
            .replace("{{last24hPrice}}", actionShow != "all" || actionShow == "allDuotou" || i == 0 ? last24hPriceShow : '')
            .replace("{{maxPrice}}", actionShow != "all" || actionShow == "allDuotou" || i == 0 ? maxPrice : '')
            .replace("{{isDuotouFlag}}", ema.isDuotou)
            .replace("{{isDuotou}}", ema.isDuotou ? '<span class="up">是</span>' : '<span class="down">否</span>')
            .replace("{{isEma21Gold}}", ema.isEma21Gold ? '<span class="up">是</span>' : '<span class="down">否</span>')
            .replace("{{isEma55Gold}}", ema.isEma55Gold ? '<span class="up">是</span>' : '<span class="down">否</span>')
            .replace("{{isEma100Gold}}", ema.isEma100Gold ? '<span class="up">是</span>' : '<span class="down">否</span>')
            .replace("{{isEma21Died}}", ema.isEma21Died ? '<span class="up">是</span>' : '<span class="down">否</span>');
          if (actionShow == "allDuotou") {
            isAllTemp += temp;
          }
          if (actionShow == "allDuotou") {
            if (duotouCount == 4) {
              container.append(isAllTemp)
            }
          } else {
            container.append(temp);
          }

        }

      }
      // $($(`.${symbol} .name`)[0]).attr("rowspan", list.length)
      // $("#emaList tr:first td:first").attr("rowspan", list.length);
    });
  }
  init();

});
