import { should } from "chai";
import { describe, it } from "mocha";
import { client } from "../config";
import { IResponse } from "../../src/configuration";

should();

const resources = [
  { name: "healthcheck", methods: ["ping"] },
  {
    name: "accounts",
    methods: ["list", "retrieve"],
  },
  {
    name: "entities",
    methods: ["list", "retrieve"],
  },
  {
    name: "payments",
    methods: ["list"],
  },
  {
    name: "merchants",
    methods: ["list"],
  },
];

describe("API Resources - last_response check", () => {
  resources.forEach((resource) => {
    describe(`${resource.name} methods`, () => {
      resource.methods.forEach((method) => {
        it(`should return a last_response object for ${method}`, async () => {
          const response: IResponse<any> =
            resource.name == "healthcheck"
              ? await client[method]()
              : await client[resource.name][method]();
          response.should.have.property("last_response");
          response.last_response.should.have.property("request_id");
          response.last_response.should.have.property("idempotency_status");
          response.last_response.should.have.property("method");
          response.last_response.should.have.property("path");
          response.last_response.should.have.property("status");
          response.last_response.should.have.property("request_start_time");
          response.last_response.should.have.property("request_end_time");
          response.last_response.should.have.property("pagination");
        });
      });
    });
  });
});
