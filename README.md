# nTweetStreamer

This is a [nodejs][nodejs] server used to access multiple twitter streams and store their tweets.

Currently using [mongodb][mongodb] for persistance.

[nodejs]: http://nodejs.org
[mongodb]: http://www.mongodb.org/

### Rest API

####Streams
---
*  URL: `/streams`
* Methods:
    * `GET`: `/streams/:id` will get you a single stream, `/streams` will return all streams.
    * `POST`: `/streams` posting a stream will insert/update depending on if a record matching that id exists.
    * `DELETE`: `/streams/:id` will delete a stream and any tweets related to it.

####Stream Control
---
* URL: `/streamcontrol`
* Methods:
    * `POST`: `/streamcontrol/:action/:id` specify an action of `start` or `stop` and a stream id to start and stop streams.

####Tweets
---
* URL:  `/tweets`
* Methods:
    * `GET`: `/tweets/:id` will get all tweets from the specified stream.
