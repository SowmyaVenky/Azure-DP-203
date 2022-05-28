-- https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-stream-analytics-query-patterns

--Example to read stream and push to 2 outputs - raw to blob, and summaries
SELECT
	*
INTO
	ArchiveOutput
FROM
	Input TIMESTAMP BY Time

SELECT
	Make,
	System.TimeStamp() AS Time,
	COUNT(*) AS [Count]
INTO
	AlertOutput
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Make,
	TumblingWindow(second, 10)
HAVING
	[Count] >= 3

-- This is a more efficient way to write the same query, less readers are used. Favor WITH clause
WITH ReaderQuery AS (
	SELECT
		*
	FROM
		Input TIMESTAMP BY Time
)

SELECT * INTO ArchiveOutput FROM ReaderQuery

SELECT 
	Make,
	System.TimeStamp() AS Time,
	COUNT(*) AS [Count] 
INTO AlertOutput 
FROM ReaderQuery
GROUP BY
	Make,
	TumblingWindow(second, 10)
HAVING [Count] >= 3

-- Filter the input stream to include the data based on criteria. Only licence plates with A ending in 9
SELECT
	*
FROM
	Input TIMESTAMP BY Time
WHERE
	License_plate LIKE 'A%9'

-- Use LAG to peek into the input stream one event back, retrieving the Make value and comparing
-- it to the Make value of the current event and output the event.

-- As events are consumed by the system in real time, there’s no function that can determine 
-- if an event will be the last one to arrive for that window of time. 
-- To achieve this, the input stream needs to be joined with another where the time of an 
-- event is the maximum time for all events at that window.

WITH LastInWindow AS
(
	SELECT 
		MAX(Time) AS LastEventTime
	FROM 
		Input TIMESTAMP BY Time
	GROUP BY 
		TumblingWindow(minute, 10)
)

SELECT 
	Input.License_plate,
	Input.Make,
	Input.Time
FROM
	Input TIMESTAMP BY Time 
	INNER JOIN LastInWindow
	ON DATEDIFF(minute, Input, LastInWindow) BETWEEN 0 AND 10
	AND Input.Time = LastInWindow.LastEventTime

-- Aggregate over events over a window.
SELECT
	Make,
	COUNT(*) AS Count
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Make,
	TumblingWindow(second, 10)

-- Emit the last event that was seen
SELECT
	System.Timestamp() AS Window_end,
	TopOne() OVER (ORDER BY Time DESC) AS Last_event
FROM
	Input TIMESTAMP BY Time
GROUP BY
	HOPPINGWINDOW(second, 300, 5)

https://docs.microsoft.com/en-us/stream-analytics-query/topone-azure-stream-analytics

-- Aggregate Function Syntax
TopOne() OVER (ORDER BY (<column name> [ASC |DESC])+)  

-- Analytic Function Syntax
TopOne() OVER ([<PARTITION BY clause>] ORDER BY (<column name> [ASC |DESC])+ <LIMIT DURATION clause> [<WHEN clause>])

-- LAG SYNTAX
LAG(<scalar_expression >, [<offset >], [<default>])  
     OVER ([PARTITION BY <partition key>] LIMIT DURATION(<unit>, <length>) [WHEN boolean_expression])
     
-- Emit event when 2 cars of same make go thro toll in 90 sec
SELECT
	Make,
	Time,
	License_plate AS Current_car_license_plate,
	LAG(License_plate, 1) OVER (LIMIT DURATION(second, 90)) AS First_car_license_plate,
	LAG(Time, 1) OVER (LIMIT DURATION(second, 90)) AS First_car_time
FROM
	Input TIMESTAMP BY Time
WHERE
	LAG(Make, 1) OVER (LIMIT DURATION(second, 90)) = Make

-- Duration between two events

SELECT
	[user],
	feature,
	DATEDIFF(
		second,
		LAST(Time) OVER (PARTITION BY [user], feature LIMIT DURATION(hour, 1) WHEN Event = 'start'),
		Time) as duration
FROM input TIMESTAMP BY Time
WHERE
	Event = 'end'

--Count unique values
SELECT
     COUNT(DISTINCT Make) AS Count_make,
     System.TIMESTAMP() AS Time
FROM Input TIMESTAMP BY TIME
GROUP BY 
     TumblingWindow(second, 2)

-- Get the 1st event in a window
SELECT 
	License_plate,
	Make,
	Time
FROM 
	Input TIMESTAMP BY Time
WHERE 
	IsFirst(minute, 10) = 1

-- This can give first car of each make in every 10 min window
SELECT 
	License_plate,
	Make,
	Time
FROM 
	Input TIMESTAMP BY Time
WHERE 
	IsFirst(minute, 10) OVER (PARTITION BY Make) = 1

-- Remove duplicate events in a window
With Temp AS (
SELECT
	COUNT(DISTINCT Time) AS CountTime,
	Value,
	DeviceId
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Value,
	DeviceId,
	SYSTEM.TIMESTAMP()
)

SELECT
    AVG(Value) AS AverageValue, DeviceId
INTO Output
FROM Temp
GROUP BY DeviceId,TumblingWindow(minute, 5)

-- CASE statement in a window query
SELECT
	Make
	CASE
		WHEN Make = "Make1" THEN "A"
		ELSE "B"
	END AS Dispatch_to_lane,
	System.TimeStamp() AS Time
FROM
	Input TIMESTAMP BY Time

-- CAST example
SELECT
	Make,
	SUM(CAST(Weight AS BIGINT)) AS Weight
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Make,
	TumblingWindow(second, 10)

-- Calulate duration of bad events - assume weight > 20000 is bad data
WITH SelectPreviousEvent AS
(
SELECT
	*,
	LAG([time]) OVER (LIMIT DURATION(hour, 24)) as previous_time,
	LAG([weight]) OVER (LIMIT DURATION(hour, 24)) as previous_weight
FROM input TIMESTAMP BY [time]
)

SELECT 
	LAG(time) OVER (LIMIT DURATION(hour, 24) WHEN previous_weight < 20000 ) [Start_fault],
	previous_time [End_fault]
FROM SelectPreviousEvent
WHERE
	[weight] < 20000
	AND previous_weight > 20000

-- Say each toll booth has a time mismatch. We can consider its own time
SELECT
      TollId,
      COUNT(*) AS Count
FROM input
      TIMESTAMP BY Time OVER TollId
GROUP BY TUMBLINGWINDOW(second, 5), TollId

-- How long a user interacted on site 
SELECT
	user_id,
	MIN(time) as StartTime,
	MAX(time) as EndTime,
	DATEDIFF(second, MIN(time), MAX(time)) AS duration_in_seconds
FROM input TIMESTAMP BY time
GROUP BY
	user_id,
	SessionWindow(minute, 1, 60) OVER (PARTITION BY user_id)

-- Check whether vehicle has gone outside boundary - memorize
SELECT
	input.Equipment_id AS Equipment_id,
	input.Equipment_current_location AS Equipment_current_location,
	input.Time AS Time
FROM input TIMESTAMP BY time
JOIN
	referenceInput 
	ON input.Equipment_id = referenceInput.Equipment_id
	WHERE 
		ST_WITHIN(input.Equipment_currenct_location, referenceInput.Equipment_lease_location) = 1

-- Custom deserializer to use with ASA
https://docs.microsoft.com/en-us/azure/stream-analytics/custom-deserializer


-- Directory structure recommened for IOT storage
{raw/regionID}/{YYYY}/{MM}/{DD}/{HH}/{mm}/{deviceID}.json

{raw/regionID} is the first level because raw is the container name for the raw data. 
RegionID follows it for ease of managing security. 

{YYYY}/{MM}/{DD}/{HH}/{mm}/{deviceID}.json instead of {deviceID}/{YYYY}/{MM}/{DD}/{HH}/{mm}.json.
The primary reason is that you want your namespace structure to have as few folders as high up 
and narrow those down as you get deeper into your structure.

For example, if you have 1 year worth of data and 25 million devices, 
using {YYYY}/{MM}/{DD}/{HH}/{mm}/ results in 2.1 million folders
 (1 year * 12 months * 30 days [estimate] * 24 hours * 60 minutes). 
If you start your folder structure with {deviceID}, you end up with 25 million folders 
- one for each device - before you even get to including the date in the hierarchy.