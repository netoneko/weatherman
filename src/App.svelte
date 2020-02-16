<script>
import moment from "moment";
import { isEmpty, lowerFirst } from "lodash";

export let weatherman;
export let i;

let forecasts = [];
let updatedAt = null;
let hash = "";

(async () => {
    [hash, updatedAt] = await weatherman.getDatasource();
    forecasts = await weatherman.getWeather(hash, 12);
})();

const resizeIcon = (icon, size) => icon.replace("small", size);

const formatDate = (date) => moment(date).format("hh:mm A");// moment(date).calendar();

const getIcon = (isDaytime) => isDaytime ? "./land_day.svg" : "./land_night.svg";

const lastUpdatedAt = () => lowerFirst(moment(Number(updatedAt / BigInt(1000000))).calendar());

const sourceURL = (hash) => `${i}/api/v0/block/get/${hash}`;
</script>

<style>
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.forecast {
    border-collapse: collapse;
}

.forecast td {
    padding: 5px;
}

.time td {
    background-color: #e2c044;
    /* min-width: 80px; */
}

.icons {
    background-color: whitesmoke;
}

.icons td img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.temperature {
    font-size: 2em;
    background-color: #587b7f;
    color: white;
}


.short {
    background-color: #587b7f;
    color: white;
}

a {
    color: #1e2019;
}

</style>
<div class="centered">
<h2>Weather in Denver for the next 12 hours</h2>
{#if updatedAt}
<p>Last updated <a href="{sourceURL(hash)}" target="_blank" title="source data">{lastUpdatedAt()}</a></p>
{/if}
{#if isEmpty(forecasts)}
<p>Loading...</p>
{:else}
<table class="forecast">
<tr class="time">
{#each forecasts as { StartTime, IsDaytime, Temperature, ShortForecast, Icon } }
<td>{formatDate(StartTime)}</td>
{/each}
</tr>
<tr class="icons">
{#each forecasts as { StartTime, IsDaytime, Temperature, ShortForecast, Icon } }
<!-- <td><img src="{resizeIcon(Icon, "small")}" alt="{ShortForecast}" /></td> -->
<td><img src="{getIcon(IsDaytime)}" alt="{ShortForecast}" /></td>
{/each}
</tr>
<tr class="temperature">
{#each forecasts as { StartTime, IsDaytime, Temperature, ShortForecast, Icon } }
<td>{Temperature}°</td>
{/each}
</tr>
<tr class="short">
{#each forecasts as { StartTime, IsDaytime, Temperature, ShortForecast, Icon } }
<td>{ShortForecast}</td>
{/each}
</tr>
</table>
{/if}

<p>Powered by IPFS oracle on <a href="https://orbs.com">ORBS</a>:
<a href="https://github.com/orbs-network/orbs-network-go/compare/experimental/denver-hackathon#diff-caf51ea546fd78b33ed5849164bde68e" target="_blank">blockchain node changes</a>,
<a href="https://github.com/netoneko/weatherman/blob/master/src/worker.js" target="_blank">oracle worker source</a>,
<a href="https://github.com/netoneko/weatherman/blob/master/src/contract/weatherman/contract.go" target="_blank">smart contract source</a>
</p>
</div>