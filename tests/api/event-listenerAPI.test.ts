import axios from 'axios'

describe("event-listenerAPI", () => {
    it("should return statusCode 200 and the recived event", async () => {
        const result = await axios.post('http://localhost:5005/event-listener', { event: 'new Event' })

        expect(result.data).toEqual({ event: 'new Event' })
    })
})