
curl --location 'https://api-southeastern.stage.otrl.io/ojp-gateway/journey-plan' \--header 'accept: application/json, text/plain, */*' \--header 'content-type: application/json' \--header 'x-access-token: 86512cad76131783f5dae4346ddc3fb39f6f7c0f74b3039bff70ca4015ade034' \--header 'x-brand-id: southeastern' \--header 'x-customer-token: 9ca4180cfe7f4193c9a9ede4c7e5ee30b802ee5640f97e6e32aaf35e774786b1' \--header 'x-trace-token: southeastern.travelcompanion.dev/ios/198850f2-aec7-4b42-a424-007946e20503' \--header 'user-agent: southeastern.travelcompanion.dev/5.0.12 (iOS; OS 26.2; iPhone 17 Pro) DEV' \--data '{    "origin": "ZES",    "destination": "LIV",    "directTrains": false,    "realtimeEnquiry": "STANDARD",    "outwardTime": "2026-03-28T08:58:18",    "includeAdditionalInformation": false}'


This is an example of Curl that will find journey information.

You can return details on any journey from point A to point B on the network.

But the journey has to be in advance of now.

The API takes an origin CRS code and a destination CRS code.

Direct trains must always be false.

Real-time enquiry should always be standard.

Outward time can be anything more than now.

Including additional information should also be false.

This response would return a structured JSON like this:

{
    "responseDetails": null,
    "generatedTime": "2026-03-17T20:34:15.630Z",
    "outwardJourney": [
        {
            "id": 1,
            "origin": "ZES",
            "destination": "LIV",
            "realtimeClassification": "NORMAL",
            "scheduledTime": {
                "departure": "2026-03-28T09:07:00.000Z",
                "arrival": "2026-03-28T11:59:00.000Z"
            },
            "realTime": {
                "departure": null,
                "arrival": null
            },
            "journeySequence": {
                "legs": [
                    {
                        "id": 1,
                        "board": {
                            "crs": "ZES",
                            "stationType": "LU",
                            "stepFreeAccessCoverage": null,
                            "stepFreeAccessNote": null
                        },
                        "alight": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "origins": [],
                        "destinations": [],
                        "originPlatform": null,
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "WALK",
                        "operator": null,
                        "scheduledTime": {
                            "departure": "2026-03-28T09:07:00.000Z",
                            "arrival": "2026-03-28T09:15:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [
                            "From Euston Square Underground Station walk to Euston Underground Station (approximately 8 minutes)."
                        ],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 2,
                        "board": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "alight": {
                            "crs": "WBQ",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>This station has step-free access to all platforms / the platform</p>"
                        },
                        "origins": [
                            "EUS"
                        ],
                        "destinations": [
                            "GLC"
                        ],
                        "originPlatform": "1",
                        "destinationPlatform": "3",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "VT",
                            "name": "Avanti West Coast"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T09:30:00.000Z",
                            "arrival": "2026-03-28T11:14:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 3,
                        "board": {
                            "crs": "WBQ",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>This station has step-free access to all platforms / the platform</p>"
                        },
                        "alight": {
                            "crs": "NLW",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<ul><li>Category A Station</li><li>Scooter Friendly Station</li></ul><p> Station Lifts available</p><p>To find our more about travelling around this station, please see the 360 map <a href=\"https://tourmkr.com/F1gqtVYOSW/35771942p&27.57h&88.63t\" title=\"\">click here</a></p>"
                        },
                        "origins": [
                            "LLD"
                        ],
                        "destinations": [
                            "MIA"
                        ],
                        "originPlatform": "4",
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "AW",
                            "name": "Transport for Wales"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T11:20:00.000Z",
                            "arrival": "2026-03-28T11:31:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 4,
                        "board": {
                            "crs": "NLW",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<ul><li>Category A Station</li><li>Scooter Friendly Station</li></ul><p> Station Lifts available</p><p>To find our more about travelling around this station, please see the 360 map <a href=\"https://tourmkr.com/F1gqtVYOSW/35771942p&27.57h&88.63t\" title=\"\">click here</a></p>"
                        },
                        "alight": {
                            "crs": "LIV",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": null
                        },
                        "origins": [
                            "MCV"
                        ],
                        "destinations": [
                            "LIV"
                        ],
                        "originPlatform": null,
                        "destinationPlatform": "3",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "TP",
                            "name": "TransPennine Express"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T11:41:00.000Z",
                            "arrival": "2026-03-28T11:59:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    }
                ],
                "fares": [],
                "serviceBulletins": []
            }
        },
        {
            "id": 2,
            "origin": "ZES",
            "destination": "LIV",
            "realtimeClassification": "NORMAL",
            "scheduledTime": {
                "departure": "2026-03-28T09:20:00.000Z",
                "arrival": "2026-03-28T12:04:00.000Z"
            },
            "realTime": {
                "departure": null,
                "arrival": null
            },
            "journeySequence": {
                "legs": [
                    {
                        "id": 1,
                        "board": {
                            "crs": "ZES",
                            "stationType": "LU",
                            "stepFreeAccessCoverage": null,
                            "stepFreeAccessNote": null
                        },
                        "alight": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "origins": [],
                        "destinations": [],
                        "originPlatform": null,
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "WALK",
                        "operator": null,
                        "scheduledTime": {
                            "departure": "2026-03-28T09:20:00.000Z",
                            "arrival": "2026-03-28T09:28:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [
                            "From Euston Square Underground Station walk to Euston Underground Station (approximately 8 minutes)."
                        ],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 2,
                        "board": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "alight": {
                            "crs": "LIV",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": null
                        },
                        "origins": [
                            "EUS"
                        ],
                        "destinations": [
                            "LIV"
                        ],
                        "originPlatform": "5",
                        "destinationPlatform": "9",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "VT",
                            "name": "Avanti West Coast"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T09:43:00.000Z",
                            "arrival": "2026-03-28T12:04:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    }
                ],
                "fares": [],
                "serviceBulletins": []
            }
        },
        {
            "id": 3,
            "origin": "ZES",
            "destination": "LIV",
            "realtimeClassification": "NORMAL",
            "scheduledTime": {
                "departure": "2026-03-28T09:44:00.000Z",
                "arrival": "2026-03-28T12:23:00.000Z"
            },
            "realTime": {
                "departure": null,
                "arrival": null
            },
            "journeySequence": {
                "legs": [
                    {
                        "id": 1,
                        "board": {
                            "crs": "ZES",
                            "stationType": "LU",
                            "stepFreeAccessCoverage": null,
                            "stepFreeAccessNote": null
                        },
                        "alight": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "origins": [],
                        "destinations": [],
                        "originPlatform": null,
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "WALK",
                        "operator": null,
                        "scheduledTime": {
                            "departure": "2026-03-28T09:44:00.000Z",
                            "arrival": "2026-03-28T09:52:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [
                            "From Euston Square Underground Station walk to Euston Underground Station (approximately 8 minutes)."
                        ],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 2,
                        "board": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "alight": {
                            "crs": "LIV",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": null
                        },
                        "origins": [
                            "EUS"
                        ],
                        "destinations": [
                            "LIV"
                        ],
                        "originPlatform": "15",
                        "destinationPlatform": "10",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "VT",
                            "name": "Avanti West Coast"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T10:07:00.000Z",
                            "arrival": "2026-03-28T12:23:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    }
                ],
                "fares": [],
                "serviceBulletins": []
            }
        },
        {
            "id": 4,
            "origin": "ZES",
            "destination": "LIV",
            "realtimeClassification": "NORMAL",
            "scheduledTime": {
                "departure": "2026-03-28T10:07:00.000Z",
                "arrival": "2026-03-28T12:59:00.000Z"
            },
            "realTime": {
                "departure": null,
                "arrival": null
            },
            "journeySequence": {
                "legs": [
                    {
                        "id": 1,
                        "board": {
                            "crs": "ZES",
                            "stationType": "LU",
                            "stepFreeAccessCoverage": null,
                            "stepFreeAccessNote": null
                        },
                        "alight": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "origins": [],
                        "destinations": [],
                        "originPlatform": null,
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "WALK",
                        "operator": null,
                        "scheduledTime": {
                            "departure": "2026-03-28T10:07:00.000Z",
                            "arrival": "2026-03-28T10:15:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [
                            "From Euston Square Underground Station walk to Euston Underground Station (approximately 8 minutes)."
                        ],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 2,
                        "board": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "alight": {
                            "crs": "WBQ",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>This station has step-free access to all platforms / the platform</p>"
                        },
                        "origins": [
                            "EUS"
                        ],
                        "destinations": [
                            "GLC"
                        ],
                        "originPlatform": "1",
                        "destinationPlatform": "3",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "VT",
                            "name": "Avanti West Coast"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T10:30:00.000Z",
                            "arrival": "2026-03-28T12:14:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 3,
                        "board": {
                            "crs": "WBQ",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>This station has step-free access to all platforms / the platform</p>"
                        },
                        "alight": {
                            "crs": "NLW",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<ul><li>Category A Station</li><li>Scooter Friendly Station</li></ul><p> Station Lifts available</p><p>To find our more about travelling around this station, please see the 360 map <a href=\"https://tourmkr.com/F1gqtVYOSW/35771942p&27.57h&88.63t\" title=\"\">click here</a></p>"
                        },
                        "origins": [
                            "LLD"
                        ],
                        "destinations": [
                            "MIA"
                        ],
                        "originPlatform": "4",
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "AW",
                            "name": "Transport for Wales"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T12:20:00.000Z",
                            "arrival": "2026-03-28T12:31:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 4,
                        "board": {
                            "crs": "NLW",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<ul><li>Category A Station</li><li>Scooter Friendly Station</li></ul><p> Station Lifts available</p><p>To find our more about travelling around this station, please see the 360 map <a href=\"https://tourmkr.com/F1gqtVYOSW/35771942p&27.57h&88.63t\" title=\"\">click here</a></p>"
                        },
                        "alight": {
                            "crs": "LIV",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": null
                        },
                        "origins": [
                            "MCV"
                        ],
                        "destinations": [
                            "LIV"
                        ],
                        "originPlatform": null,
                        "destinationPlatform": "3",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "TP",
                            "name": "TransPennine Express"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T12:41:00.000Z",
                            "arrival": "2026-03-28T12:59:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    }
                ],
                "fares": [],
                "serviceBulletins": []
            }
        },
        {
            "id": 5,
            "origin": "ZES",
            "destination": "LIV",
            "realtimeClassification": "NORMAL",
            "scheduledTime": {
                "departure": "2026-03-28T10:20:00.000Z",
                "arrival": "2026-03-28T13:04:00.000Z"
            },
            "realTime": {
                "departure": null,
                "arrival": null
            },
            "journeySequence": {
                "legs": [
                    {
                        "id": 1,
                        "board": {
                            "crs": "ZES",
                            "stationType": "LU",
                            "stepFreeAccessCoverage": null,
                            "stepFreeAccessNote": null
                        },
                        "alight": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "origins": [],
                        "destinations": [],
                        "originPlatform": null,
                        "destinationPlatform": null,
                        "realtimeClassification": "NORMAL",
                        "mode": "WALK",
                        "operator": null,
                        "scheduledTime": {
                            "departure": "2026-03-28T10:20:00.000Z",
                            "arrival": "2026-03-28T10:28:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [
                            "From Euston Square Underground Station walk to Euston Underground Station (approximately 8 minutes)."
                        ],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    },
                    {
                        "id": 2,
                        "board": {
                            "crs": "EUS",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": "<p>Suitable for disabled passengers. Level access to all platforms via ramps. Lifts provided between concourse, taxi & car park and London Underground ticket hall.</p><p>Lift access is available to the Underground ticket hall, however the Underground station itself has only escalators & stairs. Nearby Euston Square station has step-free access Westbound only to the Circle, Hammersmith & City and Metropolitan Lines. </p><p>For more information on the accessibility on London Transport <a href=\"https://tfl.gov.uk/transport-accessibility/\" title=\"\">click here</a>.</p>"
                        },
                        "alight": {
                            "crs": "LIV",
                            "stationType": "NR",
                            "stepFreeAccessCoverage": "wholeStation",
                            "stepFreeAccessNote": null
                        },
                        "origins": [
                            "EUS"
                        ],
                        "destinations": [
                            "LIV"
                        ],
                        "originPlatform": "5",
                        "destinationPlatform": "9",
                        "realtimeClassification": "NORMAL",
                        "mode": "TRAIN",
                        "operator": {
                            "code": "VT",
                            "name": "Avanti West Coast"
                        },
                        "scheduledTime": {
                            "departure": "2026-03-28T10:43:00.000Z",
                            "arrival": "2026-03-28T13:04:00.000Z"
                        },
                        "realTime": {
                            "departure": null,
                            "arrival": null
                        },
                        "undergroundTravelInformation": [],
                        "trainUID": null,
                        "trainRetailID": null,
                        "trainRID": null
                    }
                ],
                "fares": [],
                "serviceBulletins": []
            }
        }
    ],
    "inwardJourney": [],
    "nrsStatus": null
}

