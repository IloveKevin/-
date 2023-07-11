import SingletonBase from "../Base/SingletonBase";
import { EventType } from "../Config/EnumConfig";

export default class EventSystem extends SingletonBase {
    private EventMap: Map<EventType, Array<Function>> = new Map<EventType, Array<Function>>();
    //添加事件
    public AddEvent(eventType: EventType, func: Function): void {
        if (!this.EventMap.has(eventType)) {
            this.EventMap.set(eventType, new Array<Function>());
        }
        let eventList: Array<Function> = this.EventMap.get(eventType);
        eventList.push(func);
    }
    //移除事件
    public RemoveEvent(eventType: EventType, func: Function): void {
        if (!this.EventMap.has(eventType)) return;
        let eventList: Array<Function> = this.EventMap.get(eventType);
        let index = eventList.indexOf(func);
        if (index != -1) {
            eventList.splice(index, 1);
        }
    }
    //移除所有事件
    public RemoveAllEvent(eventType: EventType): void {
        if (!this.EventMap.has(eventType)) return;
        let eventList: Array<Function> = this.EventMap.get(eventType);
        eventList = new Array<Function>();
    }
    //触发事件
    public EmitEvent(eventType: EventType, args: object): void {
        if (!this.EventMap.has(eventType)) return;
        let eventList: Array<Function> = this.EventMap.get(eventType);
        for (let i = 0; i < eventList.length; i++) {
            eventList[i](args);
        }
    }
}

