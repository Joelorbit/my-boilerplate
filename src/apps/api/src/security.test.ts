import { describe, expect, it } from "vitest";
import { isCrossSiteUnsafeRequest } from "./security";

function request(method: string, site?: string) {
  return {
    method,
    get: (header: string) => (header === "sec-fetch-site" ? site : undefined),
  } as never;
}

describe("isCrossSiteUnsafeRequest", () => {
  it("allows safe methods regardless of browser site metadata", () => {
    expect(isCrossSiteUnsafeRequest(request("GET", "cross-site"))).toBe(false);
  });

  it("rejects unsafe cross-site and same-site browser requests", () => {
    expect(isCrossSiteUnsafeRequest(request("POST", "cross-site"))).toBe(true);
    expect(isCrossSiteUnsafeRequest(request("PATCH", "same-site"))).toBe(true);
  });

  it("keeps same-origin unsafe requests available to authenticated procedures", () => {
    expect(isCrossSiteUnsafeRequest(request("POST", "same-origin"))).toBe(
      false
    );
  });
});
