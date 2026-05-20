import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import uploadsRouter from "./uploads";
import restaurantsRouter from "./restaurants";
import sponsorsRouter from "./sponsors";
import eventsRouter from "./events";
import submissionsRouter from "./submissions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(uploadsRouter);
router.use(restaurantsRouter);
router.use(sponsorsRouter);
router.use(eventsRouter);
router.use(submissionsRouter);

export default router;
