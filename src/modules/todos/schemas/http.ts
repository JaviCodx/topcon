import { Static, Type } from "@sinclair/typebox";

export const BadRequest = Type.Object(
  {
    statusCode: Type.Number(),
    code: Type.String(),
    error: Type.String(),
    message: Type.String(),
  },
  {
    examples: [
      {
        statusCode: 400,
        code: "FST_ERR_VALIDATION",
        error: "Bad Request",
        message:
          "",
      },
    ],
  }
);

export type BadRequest = Static<typeof BadRequest>;