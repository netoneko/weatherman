package main

import (
	"encoding/json"
	"time"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/env"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/ipfs"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(updateDatasource, getDatasource, getWeather)
var SYSTEM = sdk.Export(_init)

var DATASOURCE = []byte("datasource")
var UPDATED_AT = []byte("updated_at")

func _init() {

}

func updateDatasource(hash string) {
	state.WriteString(DATASOURCE, hash)
	state.WriteUint64(UPDATED_AT, env.GetBlockTimestamp())
}

func getDatasource() (hash string, updatedAt uint64) {
	hash = state.ReadString(DATASOURCE)
	updatedAt = state.ReadUint64(UPDATED_AT)
	return 
}

type Forecast struct {
	StartTime string
	IsDaytime bool

	Temperature int
	WindSpeed int

	ShortForecast string
	Icon string
}

func getWeather(hash string, hours uint32) string {
	rawData := ipfs.Read(hash)
	data := make(map[string]interface{})	
	json.Unmarshal(rawData, &data)

	periods := data["properties"].(map[string]interface{})["periods"].([]interface{})
	format := "2006-01-02T15:04:05-07:00"

	var forecasts []Forecast
	for _, p := range periods[:hours] {
		period := p.(map[string]interface{})
		startTimeString := period["startTime"].(string)
		startTime, _ := time.Parse(format, startTimeString)
		temperature := int(period["temperature"].(float64))

		forecast := Forecast{
			StartTime: startTime.Format(time.RFC3339),
			Temperature: temperature,
			ShortForecast: period["shortForecast"].(string),
			Icon: period["icon"].(string),
			IsDaytime: period["isDaytime"].(bool),
		}

		forecasts = append(forecasts, forecast)
	}

	jsonRaw, _ := json.Marshal(forecasts)
	return string(jsonRaw)
}
