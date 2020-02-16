package main

import (
	"encoding/json"

	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/service"
)

var PUBLIC = sdk.Export(getAdvice)
var SYSTEM = sdk.Export(_init)

func _init() {

}

type Forecast struct {
	StartTime string
	IsDaytime bool

	Temperature int
	WindSpeed   int

	ShortForecast string
	Icon          string
}

func getAdvice(forecastContractAddress string, hash string, hours uint32) string {
	var forecasts []Forecast
	rawData := service.CallMethod(forecastContractAddress, "getWeather", hash, hours)[0].(string)

	if err := json.Unmarshal([]byte(rawData), &forecasts); err != nil {
		panic(err)
	}

	avg := _averageTemperature(forecasts)
	if avg > 25 {
		return "It's pretty hot, wear whatever you want"
	}

	if avg > 15 {
		return "Light coat is advisable"
	}

	if avg > 10 {
		return "It's getting chilly, you better put on a hat and a proper coat"
	}

	if avg > -10 {
		return "Winter coat and a hat are a must in this weather"
	}

	return "You better never leave the house unless you have to"
}

func _averageTemperature(forecasts []Forecast) int {
	averageTemperature := 0
	for _, forecast := range forecasts {
		averageTemperature += forecast.Temperature
	}

	return averageTemperature / len(forecasts)
}
