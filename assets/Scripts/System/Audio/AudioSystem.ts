import SingletonBase from "../../Base/SingletonBase";

//播放音频以及播放音乐的管理
export default class AudioSystem extends SingletonBase {
    private musicVolume: number = 1;//音乐音量
    private effectVolume: number = 1;//音效音量
    public SetMusicVolume(volume: number): void {
        this.musicVolume = volume >= 0 && volume <= 1 ? volume : this.musicVolume;
    }
    public GetMusicVolume(): number {
        return this.musicVolume;
    }
    public SetEffectVolume(volume: number): void {
        this.effectVolume = volume >= 0 && volume <= 1 ? volume : this.effectVolume;
    }
    public GetEffectVolume(): number {
        return this.effectVolume;
    }
    public PlayMusic(clip: cc.AudioClip, loop: boolean = false): number {
        return cc.audioEngine.playMusic(clip, loop);
    }
    public PlayEffect(clip: cc.AudioClip, loop: boolean = false): number {
        return cc.audioEngine.playEffect(clip, loop);
    }
    public StopAudio(audioID: number): void {
        cc.audioEngine.stop(audioID);
    }
}
