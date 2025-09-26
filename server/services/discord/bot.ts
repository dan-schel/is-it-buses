import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  hyperlink,
  inlineCode,
  spoiler,
} from "discord.js";

export class DiscordBot {
  private client: Client;

  constructor(
    private readonly token: string,
    private readonly channel: string,
  ) {
    this.client = new Client({
      intents: [GatewayIntentBits.GuildMembers],
    });

    this._init();
  }

  private _init() {
    this.client.on(Events.InteractionCreate, async (readyClient) => {
      if (readyClient.isButton()) {
        // Handle the event to delete the message containing login credentials
        if (readyClient.customId === "delete_credentials") {
          try {
            await readyClient.message.delete();
          } catch (error) {
            console.warn("Failed to delete message");
            console.warn(error);
          }
        }
      }
    });

    this.client.login(this.token);
  }

  async getMembers() {
    try {
      const members = await (
        await this.client.guilds.fetch(this.channel)
      ).members.list({ limit: 10 });

      return members
        .filter((member) => !member.user.bot)
        .map((member) => member.user);
    } catch {
      return [];
    }
  }

  async inviteAdmin(
    id: string,
    username: string,
    password: string,
    origin: string,
  ) {
    try {
      const dm = await this.client.users.createDM(id);

      const linkButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(`${origin}/admin`)
        .setLabel("Login");
      const deleteButton = new ButtonBuilder()
        .setCustomId("delete_credentials")
        .setLabel("Delete Message")
        .setStyle(ButtonStyle.Danger);
      const actions = new ActionRowBuilder<ButtonBuilder>().addComponents(
        linkButton,
        deleteButton,
      );

      await dm.send({
        content:
          `You've been made an admin for Is is buses?! Below are your credentials :point_down:\n` +
          spoiler(`Username: ${username}\n` + `Password: ${password}`),
        components: [actions.toJSON()],
      });
    } catch (error) {
      console.warn("Failed to send invitation");
      console.warn(error);
    }
  }

  async logDeployment(
    hash: string,
    previouslyDeployed: boolean,
  ): Promise<void> {
    try {
      const channel = await this.client.guilds.fetch(this.channel);
      if (channel) {
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.find((wh) => wh.token);

        if (webhook) {
          await webhook.send({
            embeds: [this._buildMessage(hash, previouslyDeployed)],
          });
        }
      }
    } catch (error) {
      console.warn(`🔴 Failed to send message to Discord`);
      console.warn(error);
    }
  }

  private _buildMessage(hash: string, previouslyDeployed: boolean) {
    return new EmbedBuilder()
      .setTitle("Deployment Successful!")
      .setColor(previouslyDeployed ? "Orange" : "Green")
      .setDescription(
        `**Is it buses?** deployed ${previouslyDeployed ? "using an existing commit" : "successfully"}.`,
      )
      .addFields([
        {
          name: "Commit Hash",
          value: hyperlink(
            inlineCode(hash),
            `https://github.com/dan-schel/is-it-buses/commit/${hash}`,
          ),
        },
      ])
      .setTimestamp();
  }
}
