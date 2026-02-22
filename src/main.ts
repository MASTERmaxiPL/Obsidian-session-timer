import {Notice, Platform, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, SessionTimerPluginSettings, SessionTimerSettingTab} from "./settings";

export default class SessionTimerPlugin extends Plugin {
	settings: SessionTimerPluginSettings;
	timer: number | null = null;
	totalElapsedSeconds: number = 0;
	timerPaused: boolean = false;
	statusBarItemEl: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();
		new Notice('Session Timer Plugin activated!');

		if (!Platform.isMobile) {
    		this.statusBarItemEl = this.addStatusBarItem();
		}
		else {
			this.addRibbonIcon('clock', 'Session Time', () => {
				const time = this.formatTime(this.totalElapsedSeconds);
				new Notice(`Session Time: ${time}`);
			});
    	}

		this.addSettingTab(new SessionTimerSettingTab(this.app, this));

		this.timer = Date.now();

		this.registerInterval(window.setInterval(() => this.updateTimer(), 1000));

		this.addCommand({
            id: 'toggle-timer-pause',
            name: 'Toggle Timer Pause',
			hotkeys: [
				{
					modifiers: ["Mod", "Shift"],
					key: "P"
				}
			],
            callback: () => {
                this.settings.SessionPauseTimerSetting = !this.settings.SessionPauseTimerSetting;
                this.saveSettings();
                new Notice(this.settings.SessionPauseTimerSetting ? "Timer paused" : "Timer resumed");
            }
        });

		this.addCommand({
    		id: 'show-session-time',
    		name: 'Show Session Time',
    		callback: () => {
        		const timeString = this.formatTime(this.totalElapsedSeconds);
        		new Notice(`⏳ Session time: ${timeString}`, 3000);
    		}
		});
	}

	updateTimer() {
		if (this.settings.SessionPauseTimerSetting && !document.hasFocus()) {
			return;
		}
		this.totalElapsedSeconds += 1;

		const timeString = this.formatTime(this.totalElapsedSeconds);

		this.statusBarItemEl?.setText(`Session Time: ${timeString}`);
	}

	formatTime(totalSeconds: number): string {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}