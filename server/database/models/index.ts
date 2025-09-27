import { AlertModel } from "@/server/database/models/alert";
import { DeploymentLogModel } from "@/server/database/models/deployment-logs";
import { DisruptionModel } from "@/server/database/models/disruption";
import { HistoricalAlertModel } from "@/server/database/models/historical-alert";
import { SessionModel } from "@/server/database/models/session";
import { UserModel } from "@/server/database/models/user";

export const ALERTS = AlertModel.instance;
export const DEPLOYMENT_LOGS = DeploymentLogModel.instance;
export const DISRUPTIONS = DisruptionModel.instance;
export const HISTORICAL_ALERTS = HistoricalAlertModel.instance;
export const SESSIONS = SessionModel.instance;
export const USERS = UserModel.instance;
