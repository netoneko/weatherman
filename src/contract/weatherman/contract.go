package main

import (
	"encoding/json"
	"time"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/ipfs"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(add, value, weather)
var SYSTEM = sdk.Export(_init)

var COUNTER_KEY = []byte("counter")

func _init() {

}

func add(i uint64) uint64 {
	v := value() + i
	state.WriteUint64(COUNTER_KEY, v)

	return v
}

func value() uint64 {
	return state.ReadUint64(COUNTER_KEY)
}

type Forecast struct {
	StartTime string
	IsDaytime bool

	Temperature int
	WindSpeed int

	ShortForecast string
	Icon string
}

func weather(hash string, hours uint32) string {
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
