import { PrismaClient } from "@prisma/client";
import { InferType, object, string } from "yup";
import sendGridClient from "@sendgrid/client";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const schema = object({ templateId: string().required() });

  let postParams: InferType<typeof schema>;
  try {
    postParams = await schema.validate(body);
  } catch (error: any) {
    setResponseStatus(event, 400);
    return { message: "Invalid payload" };
  }
  const templateId = postParams.templateId;
  try {
    sendGridClient.setApiKey(useRuntimeConfig().sendgridApiKey);
    const [response, _] = await sendGridClient.request({
      url: `/v3/templates/${templateId}`,
      method: "GET",
    });
    if (response.statusCode === 404) throw new Error();
  } catch (error: any) {
    setResponseStatus(event, 400);
    return { message: "Template id not found on SendGrid API" };
  }

  try {
    const newsletter = await prisma.newsletter.create({
      data: {
        templateId,
        draftedAt: new Date(),
      },
    });
    setResponseStatus(event, 201);
    return newsletter;
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { message: "Database error" };
  }
});
