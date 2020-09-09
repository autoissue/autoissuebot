const { SingleResponseData, MultiResponseData, FailResponseData, FilterMultiIssueResponse, validate } = require('./validate'); 
const results = require('../__tests__/getAllBlockerIssues.sample.json');


test('FilterMultiIssueResponse', () => {

  const [  accepted, rejected, ] = FilterMultiIssueResponse(results);

  const expectedRejected = {
    reason: {
      name: expect.stringMatching('HttpError'),
      status: 404,
    },
    status: 'rejected',
  };
  expect(rejected).toEqual(
    expect.arrayContaining([
      expect.objectContaining(expectedRejected),
    ])
  );


  const expectedAccepted = {
    //body: expect.stringMatching(/blocked by/gim),
    ghApiResponseStatus: 'fulfilled',
    number: expect.any(Number),
    state: expect.stringMatching('open'),
    status: expect.any(Number), //200,
  };

  accepted.forEach((recv) => {
    expect(recv).toMatchObject(expectedAccepted);
  });
});



