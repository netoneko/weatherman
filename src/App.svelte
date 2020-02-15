<script>
import moment from "moment";

export let weatherman;
let forecasts = [];

(async () => {
    forecasts = await weatherman.weather("QmYenYjdgvqV9jdDyTnBUs84TiayAyiCX9EokZZ9Fp1PmK", 12);
})();

const resizeIcon = (icon, size) => icon.replace("small", size);

const formatDate = (date) => moment(date).format("hh:mm A");// moment(date).calendar();

const getIcon = (isDaytime) => isDaytime ? "./land_day.svg" : "./land_night.svg";
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

</style>
<div class="centered">
<h2>Weather in Denver for the next 12 hours</h2>

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
</div>