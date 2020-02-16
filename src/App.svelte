<script>
import moment from "moment";
import { isEmpty, lowerFirst } from "lodash";

export let weatherman;
export let oracleEndpoint;
export let advice;

let forecasts = [];
let updatedAt = null;
let hash = "";
let recommendation = null;

const updateForecast = async (hash, hours) => {
    forecasts = await weatherman.getWeather(hash, hours);
}

const updateRecommendation = async (hash, hours) => {
    recommendation = await advice.getAdvice(weatherman.contractName, hash, hours);
}

const resizeIcon = (icon, size) => icon.replace("small", size);

const formatDate = (date) => moment(date).format("hh:mm A");// moment(date).calendar();

const getIcon = (isDaytime) => isDaytime ? "./land_day.svg" : "./land_night.svg";

const lastUpdatedAt = () => lowerFirst(moment(Number(updatedAt / BigInt(1000000))).calendar());

const sourceURL = (hash) => `${oracleEndpoint}/${hash}`;

(async () => {
    [hash, updatedAt] = await weatherman.getDatasource();
    updateForecast(hash, 12);
    updateRecommendation(hash, 12);
})();
</script>

<style>
.centered {
  margin: 0 auto;
  max-width: calc(6.5*120px);
}

.all-forecasts {
    max-width: calc(6.5*120px);
}

.forecast {
    padding: 5px;
    width: 120px;
    display: inline-block;
}

.time {
    background-color: #e2c044;
    padding: 5px;
}

.icons {
    background-color: whitesmoke;
}

.icons {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.temperature {
    font-size: 2em;
    background-color: #587b7f;
    color: white;
    padding: 5px;
}

.short {
    background-color: #587b7f;
    color: white;
    padding: 5px;
}

a {
    color: #1e2019;
}

.recommendation {
    font-style: italic;
}

</style>
<div class="centered">
<h2>Weather in Denver for the next 12 hours</h2>
{#if updatedAt}
<p>Last updated <a href="{sourceURL(hash)}" target="_blank" title="raw data">{lastUpdatedAt()}</a></p>
{/if}

{#if recommendation}
<p class="recommendation">{recommendation}</p>
{/if}

{#if isEmpty(forecasts)}
<p>Loading...</p>
{:else}
<div class="all-forecasts">
{#each forecasts as { StartTime, IsDaytime, Temperature, ShortForecast, Icon } }
<div class="forecast">
<div class="time row">
{formatDate(StartTime)}
</div>
<div class="icons row">
<img src="{getIcon(IsDaytime)}" alt="{ShortForecast}" />
</div>
<div class="temperature row">
{Temperature}°
</div>
<div class="short row">
{ShortForecast}
</div>
</div>
{/each}
</div>
{/if}

<p>Powered by IPFS oracle on <a href="https://orbs.com">ORBS</a>:
<a href="https://github.com/orbs-network/orbs-network-go/compare/experimental/denver-hackathon#diff-caf51ea546fd78b33ed5849164bde68e" target="_blank">blockchain node changes</a>,
<a href="https://github.com/netoneko/weatherman/blob/master/src/worker.js" target="_blank">oracle worker source</a>,
<a href="https://github.com/netoneko/weatherman/blob/master/src/contract/weatherman/contract.go" target="_blank">smart contract source</a>
</p>
</div>