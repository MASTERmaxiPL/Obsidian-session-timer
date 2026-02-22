import {App, PluginSettingTab, Setting} from "obsidian";
import SessionTimerPlugin from "./main";

export interface SessionTimerPluginSettings {
	SessionPauseTimerSetting: boolean;
}

export const DEFAULT_SETTINGS: SessionTimerPluginSettings = {
	SessionPauseTimerSetting: false
}

export class SessionTimerSettingTab extends PluginSettingTab {
	plugin: SessionTimerPlugin;

	constructor(app: App, plugin: SessionTimerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.createEl('h2', { text: 'Session Timer Settings' });

		new Setting(containerEl)
			.setName('Pause When Unfocused')
			.setDesc('Pause timer when Obsidian is not focused.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.SessionPauseTimerSetting)
				.onChange(async (value) => {
					this.plugin.settings.SessionPauseTimerSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
