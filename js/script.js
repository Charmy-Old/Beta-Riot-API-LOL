let API_key = "RGAPI-2a87ab91-20a8-441c-976c-23bf1646698a";
let server_url = "";
let summonerName = "";

// ===== 搜尋按鈕 ===== //
async function SearchSummoner() {
    document.querySelector(".information").style.display = "none";
    document.querySelector(".total").style.display = "none";
    document.querySelector(".statistics").style.display = "none";
    document.querySelector(".record").style.display = "none";

    summonerName = document.querySelector(".enterSummonerName").value;
    // console.log("輸入要搜尋的 ID：", summonerName);
    let removeRecordBlock = document.querySelectorAll('.recordBlock');
    removeRecordBlock.forEach(function (element) {
        element.parentNode.removeChild(element);
    });
    let removeStatisticsBlock = document.querySelectorAll('.statisticsBlock');
    removeStatisticsBlock.forEach(function (element) {
        element.parentNode.removeChild(element);
    });
    data();
}

document.addEventListener("DOMContentLoaded", function () {
    var playerBlocks = document.querySelectorAll(".playerInfomationBlock");
    playerBlocks.forEach(function (block) {
        block.addEventListener("click", function (event) {
            var playerID = this.querySelector(".playerID").textContent;
            // console.log("Clicked player ID:", playerID);
            document.querySelector(".information").style.display = "none";
            document.querySelector(".total").style.display = "none";
            document.querySelector(".statistics").style.display = "none";
            document.querySelector(".record").style.display = "none";
            summonerName = playerID;
            // console.log("輸入要搜尋的 ID：", summonerName);
            let removeRecordBlock = document.querySelectorAll(".recordBlock");
            removeRecordBlock.forEach(function (element) {
                element.parentNode.removeChild(element);
            });
            data();
        });
    });
});

let statistics = "";   // 要加入 statistics 的 HTML
let record = "";   // 要加入 record 的 HTML
// ===== 撈資料 ===== //
async function data() {
    try {
        let summonerName_url = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + API_key;
        let summonerName_fetch = await fetch(summonerName_url);
        // console.log("summonerName_fetch：", summonerName_fetch);
        let summonerData = await summonerName_fetch.json();
        // console.log("summonerData：", summonerData);
        // === 帳號名稱 === //
        // summonerName = summonerData.name;
        document.querySelector(".summonerNameData").innerHTML = summonerName;
        // === 帳號等級 === //
        let summonerLevel = summonerData.summonerLevel;
        document.querySelector(".summonerLevelData").innerHTML = summonerLevel;
        // === 帳號頭像 === //
        let profileIconNumber = summonerData.profileIconId;
        let profileIcon_url = "https://ddragon.leagueoflegends.com/cdn/14.5.1/img/profileicon/" + profileIconNumber + ".png";
        document.querySelector(".summonerProfilePicure_img").src = profileIcon_url;
        // === 戰績 === //
        let summoner_id = summonerData.id;
        let summoner_puuid = summonerData.puuid;
        let entriesSummoner_url = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summoner_id + "?api_key=" + API_key;
        let entriesSummoner_fetch = await fetch(entriesSummoner_url);
        let allGameData = await entriesSummoner_fetch.json();
        let allGameData_0 = allGameData[0];
        // console.log("allGameData_0：", allGameData_0);

        // === 讓區塊呈現 === //
        document.querySelector(".information").style.display = "block";
        document.querySelector(".total").style.display = "block";
        document.querySelector(".statistics").style.display = "grid";
        document.querySelector(".record").style.display = "block";

        // === 勝場 === //
        document.querySelector(".gameWinsNumber").innerHTML = allGameData_0.wins;
        // === 敗場 === //
        document.querySelector(".gameLossesNumber").innerHTML = allGameData_0.losses;
        let summoner_winratio = Math.round((allGameData_0.wins / (allGameData_0.losses + allGameData_0.wins)) * 100)
        // === 勝率 === //
        document.querySelector(".gameWinratioNumber").innerHTML = summoner_winratio + "%";
        // === 牌位 === //
        let division_tier = allGameData_0.tier;

        if (division_tier == "IRON") {
            division_tier = "鐵牌";
            document.querySelector(".gameTier").style.color = "gray";
        } else if (division_tier == "BRONZE") {
            division_tier = "銅牌";
            document.querySelector(".gameTier").style.color = "#5C4E2A";
        } else if (division_tier == "SILVER") {
            division_tier = "銀牌";
            document.querySelector(".gameTier").style.color = "silver";
        } else if (division_tier == "GOLD") {
            division_tier = "金牌";
            document.querySelector(".gameTier").style.color = "gold";
        } else if (division_tier == "PLATINUM") {
            division_tier = "白金";
            document.querySelector(".gameTier").style.color = "#E5E4E2";
        } else if (division_tier == "EMERALD") {
            division_tier = "翡翠";
            document.querySelector(".gameTier").style.color = "#00A86B";
        } else if (division_tier == "DIAMOND") {
            division_tier = "鑽石";
            document.querySelector(".gameTier").style.color = "#B9F2FF";
        } else if (division_tier == "MASTER") {
            division_tier = "大師";
            document.querySelector(".gameTier").style.color = "#8B0000";
        } else if (division_tier == "GRANDMASTER") {
            division_tier = "宗師";
            document.querySelector(".gameTier").style.color = "#555555";
        } else if (division_tier == "CHALLENGER") {
            division_tier = "菁英";
            document.querySelector(".gameTier").style.color = "red";
        }

        let summonerTier = division_tier + allGameData_0.rank;
        let summonerTierScore = allGameData_0.leaguePoints;
        document.querySelector(".gameTier").innerHTML = summonerTier;
        document.querySelector(".gameScore").innerHTML = + summonerTierScore;

        // === 每場代號 === //
        let matches_url = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" + summoner_puuid + "/ids?start=0&count=100&api_key=" + API_key;
        let matches_fetch = await fetch(matches_url);
        let matches_data = await matches_fetch.json();
        // console.log("matches_data：", matches_data);

        // === 出裝代號 === //
        let items_url = "https://ddragon.leagueoflegends.com/cdn/14.5.1/data/en_US/item.json";
        let items_fetch = await fetch(items_url);
        let items_data = await items_fetch.json();
        items_data = items_data.data;
        // console.log("items_data：", items_data);

        // === 符文代號 === //
        let runes_url = "https://ddragon.leagueoflegends.com/cdn/14.5.1/data/en_US/runesReforged.json";
        let runes_fetch = await fetch(runes_url);
        let runes_data = await runes_fetch.json();
        // console.log("runes_data：", runes_data);

        // === 近 10 場數據 === //
        let champsStatistics = [];   // 統計數據
        for (let i = 0; i < 10; i++) {
            let match_url = "https://asia.api.riotgames.com/lol/match/v5/matches/" + matches_data[i] + "?api_key=" + API_key;
            let match_fetch = await fetch(match_url);
            let currentMatchData = await match_fetch.json();
            // console.log("currentMatchData：", currentMatchData);

            // === 單場紅藍隊 === //   // 0 - 4 籃隊 5 - 9 紅隊
            let blueTeam = [];
            let redTeam = [];
            let blueTeamChamps = [];
            let redTeamChamps = [];
            for (let k = 0; k < 10; k++) {
                if (k < 5) {
                    blueTeam.push(currentMatchData.info.participants[k].riotIdGameName);
                    blueTeamChamps.push(currentMatchData.info.participants[k].championName);
                } else {
                    redTeam.push(currentMatchData.info.participants[k].riotIdGameName);
                    redTeamChamps.push(currentMatchData.info.participants[k].championName);
                }
            }
            // console.log("籃隊 ID：", blueTeam);
            // console.log("紅隊 ID：", redTeam);
            // console.log("籃隊英雄：", blueTeamChamps);
            // console.log("紅隊英雄：", redTeamChamps);

            // === 確認搜尋 ID 在紅藍隊 0 ~ 9 的哪個位子 === //
            let participants = currentMatchData.metadata.participants;
            let counter = 0;
            for (let j = 0; j < 10; j++) {
                if (participants[j] == summoner_puuid) {
                    break;
                }
                counter += 1
            }
            let perGameData = currentMatchData.info.participants[counter];
            // console.log("每場遊戲的數據：", perGameData);

            // === 抓出想要的數據 === //
            let setGameData = [];
            setGameData.push("英雄名稱", perGameData.championName);
            setGameData.push("擊殺", perGameData.kills);
            setGameData.push("死亡", perGameData.deaths);
            setGameData.push("助攻", perGameData.assists);
            setGameData.push("CS", perGameData.totalMinionsKilled + perGameData.neutralMinionsKilled);
            // console.log("抓出想要的數據：", setGameData);
            champsStatistics.push(setGameData);
            // console.log("統計數據：", champsStatistics);

            // = 紀錄每個英雄的數據 = //
            const champions = {};

            // 統計英雄數據
            for (let i = 0; i < champsStatistics.length; i++) {
                const championName = champsStatistics[i][1];
                if (champions[championName]) {
                    champions[championName].kills += champsStatistics[i][3];
                    champions[championName].deaths += champsStatistics[i][5];
                    champions[championName].assists += champsStatistics[i][7];
                    champions[championName].cs += champsStatistics[i][9];
                    champions[championName].count++;
                } else {
                    champions[championName] = {
                        kills: champsStatistics[i][3],
                        deaths: champsStatistics[i][5],
                        assists: champsStatistics[i][7],
                        cs: champsStatistics[i][9],
                        count: 1
                    };
                }
            }

            // 統計最終結果 //
            let statistics = "";
            let championAverageData;
            for (const championName in champions) {
                const champion = champions[championName];
                championAverageData = ["英雄名稱：", championName, "出現次數：", champion.count, "擊殺：", champion.kills / champion.count, "死亡：", champion.deaths / champion.count, "助攻：", champion.assists / champion.count, "CS：", champion.cs / champion.count];
                // console.log("英雄平均戰績：", championAverageData);

                // 構建統計 HTML //
                statistics +=
                    "<div class='statisticsBlock' style='border: 1px #000 solid'>" +
                    "<div class='statisticsBlockPicture'><img src='./img/champions/" + championAverageData[1] + ".webp'></div>" +
                    "<div class='statisticsBlockName'>英雄：" + championAverageData[1] + "</div>" +
                    "<div class='statisticsBlockMatch'>場次：" + championAverageData[3] + "</div>" +
                    "<div class='statisticsBlockExploits'>平均戰績：" + (championAverageData[5]).toFixed(2) + " / " + (championAverageData[7]).toFixed(2) + " / " + (championAverageData[9]).toFixed(2) + "</div>";
                if (((championAverageData[5] + championAverageData[9]) / championAverageData[7]).toFixed(2) == "NaN") {
                    statistics += "<div class='statisticsBlockKDA'>平均 KDA：∞</div>";
                } else {
                    statistics += "<div class='statisticsBlockKDA'>平均 KDA：" + ((championAverageData[5] + championAverageData[9]) / championAverageData[7]).toFixed(2) + "</div>";
                }
                statistics +=
                    "<div class='statisticsBlockCS'>平均 CS：" + (championAverageData[11]).toFixed(2) + "</div>" +
                    "</div>";
            }

            // 更新 HTML 元素 //
            document.querySelector(".statistics").innerHTML = statistics;


            // === 單場遊戲時間 === //
            let matchTime = currentMatchData.info.gameDuration;
            let matchMinutes = Math.floor(matchTime / 60);
            let matchSeconds = matchTime % 60;
            // console.log("遊戲時間(總秒數)：", matchTime);
            // console.log("遊戲時間(分)：", matchMinutes);
            // console.log("遊戲時間(秒)：", matchSeconds);

            // === 判斷單場遊戲輸贏 === //
            let matchResult = perGameData.win;
            if (matchResult == false) {
                matchResult = "Defeat";
            } else if (matchResult == true) {
                matchResult = "Victory";
            }

            // === 單場遊戲出裝代號 === //
            let matchItems = [];
            matchItems.push(perGameData.item0);
            matchItems.push(perGameData.item1);
            matchItems.push(perGameData.item2);
            matchItems.push(perGameData.item3);
            matchItems.push(perGameData.item4);
            matchItems.push(perGameData.item5);
            matchItems.push(perGameData.item6);
            // console.log("遊戲出裝代號：", matchItems);

            // === 單場遊戲雙招代號 === //
            let matchSpell1 = perGameData.summoner1Id;
            let matchSpell2 = perGameData.summoner2Id;
            // = 把 number 轉成 string = //
            let str_matchSpell1 = matchSpell1.toString();
            let str_matchSpell2 = matchSpell2.toString();

            let spell_url = "https://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/summoner.json";
            let spell_fetch = await fetch(spell_url);
            let spell_data = await spell_fetch.json();
            // console.log("spell_data：", spell_data);
            let spellKey = Object.values(spell_data.data).map(function (item) {
                return item.key;
            });
            let spellImage = Object.values(spell_data.data).map(function (item) {
                return item.image.full;
            });
            // = 找到 str_matchSpell 對應 spellKey 的位置，再把 str_matchSpell 換成在 spellImage 同位置的值 = //
            let str_matchSpell1_convert = spellKey.indexOf(str_matchSpell1);
            // console.log(str_matchSpell1_convert);
            if (str_matchSpell1_convert !== -1) {
                str_matchSpell1 = spellImage[str_matchSpell1_convert];
            }
            let str_matchSpell2_convert = spellKey.indexOf(str_matchSpell2);
            if (str_matchSpell2_convert !== -1) {
                str_matchSpell2 = spellImage[str_matchSpell2_convert];
            }

            // === 單場主副天賦 === //   // === riot url 資料配合 op.gg 圖檔湊出來的 === //
            let matchMainRune = "";
            let matchSecondRune = "";
            for (let y = 0; y < 5; y++) {
                if (perGameData.perks.styles[0].style == runes_data[y].id) {
                    matchMainRune = perGameData.perks.styles[0].selections[0].perk;
                }
                if (perGameData.perks.styles[1].style == runes_data[y].id) {
                    matchSecondRune = perGameData.perks.styles[1].style;
                }
            }
            // console.log("主天賦：", matchMainRune, "副天賦：", matchSecondRune);

            // 加到 HTML
            record +=
                "<div class='recordBlock'>" +
                "<div class='recordMain'>" +
                "<div class='recordResult'>" + matchResult + "</div>" +
                "<div class='recordMainTop'>" +
                "<div class='recordMainLeft'>" +
                "<div class='recordChampionPicture'><img src='./img/champions/" + setGameData[1] + ".webp'></div>" +
                "<div class='recordDuration'>" + matchMinutes + " 分 " + matchSeconds + " 秒</div>" +
                "</div>" +
                "<div class='recordMainMid'>" +
                "<div class='recordSpells'>" +
                "<img src='https://ddragon.leagueoflegends.com/cdn/14.5.1/img/spell/" + str_matchSpell1 + "'>" +
                "<img src='https://ddragon.leagueoflegends.com/cdn/14.5.1/img/spell/" + str_matchSpell2 + "'>" +
                "</div>" +
                "<div class='recordRunes'>" +
                "<img src='https://opgg-static.akamaized.net/meta/images/lol/14.6.1/perk/" + matchMainRune + ".png'>" +
                "<img src='https://opgg-static.akamaized.net/meta/images/lol/14.6.1/perkStyle/" + matchSecondRune + ".png'>" +
                "</div>" +
                "</div>" +
                "<div class='recordMainRight'>" +
                "<div class='recordChampionName'>" + setGameData[1] + "</div>" +
                "<div class='recordExploits'>" + setGameData[3] + " / " + setGameData[5] + " / " + setGameData[7] + "</div>";
            if (((setGameData[3] + setGameData[7]) / setGameData[5]).toFixed(2) == "NaN") {
                record += "<div class='recordKDA'>KDA：∞</div>";
            } else {
                record += "<div class='recordKDA'>KDA：" + ((setGameData[3] + setGameData[7]) / setGameData[5]).toFixed(2) + "</div>";
            }
            record +=
                "<div class='recordCS'>CS：" + setGameData[9] + "</div>" +
                "</div>" +
                "</div>" +
                "<div class='recordMainDown'>" +
                "<div class='recordItems'>";
            for (let j = 0; j < 7; j++) {
                if (matchItems[j] == 0) {
                    record +=
                        "<img src='./img/other/X.png'>";
                } else {
                    record +=
                        "<img src='https://ddragon.leagueoflegends.com/cdn/14.5.1/img/item/" + matchItems[j] + ".png'>";
                }

            }
            record +=
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='recordDetail'>" +
                "<div class='recordBlueTeam'>"
            for (let j = 0; j < 5; j++) {
                record +=
                    "<div class='recordBlueTeamBlock'><img src='./img/champions/" + blueTeamChamps[j] + ".webp'><span>" + blueTeam[j] + "</span></div>";
            }
            record +=
                "</div>" +
                "<div class='recordRedTeam'>";
            for (let j = 0; j < 5; j++) {
                record +=
                    "<div class='recordRedTeamBlock'><img src='./img/champions/" + redTeamChamps[j] + ".webp'><span>" + redTeam[j] + "</span></div>";
            }
            record +=
                "</div>" +
                "</div>" +
                "</div>";

            document.querySelector(".record").innerHTML = record;
        }
        record = "";   // 清空 record
        statistics = ""   // 清空 statistics
    } catch (error) {
        document.querySelector(".information").style.display = "none";
        alert("查詢不到此 ID，若確認 ID 無誤，可能是正在維修中，請見諒！");
    }
}