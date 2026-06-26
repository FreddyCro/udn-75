const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./1PcQ14Cs.js","./error-404.BvlUbWm_.css","./sflnC1py.js","./error-500.CVBJSNjH.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function yp(n){const e=Object.create(null);for(const t of n.split(","))e[t]=1;return t=>t in e}const yt={},sa=[],_r=()=>{},E0=()=>!1,ql=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&(n.charCodeAt(2)>122||n.charCodeAt(2)<97),$u=n=>n.startsWith("onUpdate:"),Tn=Object.assign,Sp=(n,e)=>{const t=n.indexOf(e);t>-1&&n.splice(t,1)},DS=Object.prototype.hasOwnProperty,xt=(n,e)=>DS.call(n,e),Ke=Array.isArray,oa=n=>Yl(n)==="[object Map]",T0=n=>Yl(n)==="[object Set]",Vm=n=>Yl(n)==="[object Date]",et=n=>typeof n=="function",kt=n=>typeof n=="string",Ci=n=>typeof n=="symbol",bt=n=>n!==null&&typeof n=="object",Mp=n=>(bt(n)||et(n))&&et(n.then)&&et(n.catch),w0=Object.prototype.toString,Yl=n=>w0.call(n),LS=n=>Yl(n).slice(8,-1),A0=n=>Yl(n)==="[object Object]",qu=n=>kt(n)&&n!=="NaN"&&n[0]!=="-"&&""+parseInt(n,10)===n,oo=yp(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Yu=n=>{const e=Object.create(null);return(t=>e[t]||(e[t]=n(t)))},IS=/-\w/g,Gn=Yu(n=>n.replace(IS,e=>e.slice(1).toUpperCase())),NS=/\B([A-Z])/g,Os=Yu(n=>n.replace(NS,"-$1").toLowerCase()),ju=Yu(n=>n.charAt(0).toUpperCase()+n.slice(1)),Sf=Yu(n=>n?`on${ju(n)}`:""),kn=(n,e)=>!Object.is(n,e),Mf=(n,...e)=>{for(let t=0;t<n.length;t++)n[t](...e)},R0=(n,e,t,i=!1)=>{Object.defineProperty(n,e,{configurable:!0,enumerable:!1,writable:i,value:t})},US=n=>{const e=parseFloat(n);return isNaN(e)?n:e},FS=n=>{const e=kt(n)?Number(n):NaN;return isNaN(e)?n:e};let Gm;const Ku=()=>Gm||(Gm=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function jl(n){if(Ke(n)){const e={};for(let t=0;t<n.length;t++){const i=n[t],r=kt(i)?HS(i):jl(i);if(r)for(const s in r)e[s]=r[s]}return e}else if(kt(n)||bt(n))return n}const OS=/;(?![^(]*\))/g,BS=/:([^]+)/,kS=/\/\*[^]*?\*\//g;function HS(n){const e={};return n.replace(kS,"").split(OS).forEach(t=>{if(t){const i=t.split(BS);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function Zu(n){let e="";if(kt(n))e=n;else if(Ke(n))for(let t=0;t<n.length;t++){const i=Zu(n[t]);i&&(e+=i+" ")}else if(bt(n))for(const t in n)n[t]&&(e+=t+" ");return e.trim()}function zS(n){if(!n)return null;let{class:e,style:t}=n;return e&&!kt(e)&&(n.class=Zu(e)),t&&(n.style=jl(t)),n}const VS="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",GS=yp(VS);function C0(n){return!!n||n===""}function WS(n,e){if(n.length!==e.length)return!1;let t=!0;for(let i=0;t&&i<n.length;i++)t=bp(n[i],e[i]);return t}function bp(n,e){if(n===e)return!0;let t=Vm(n),i=Vm(e);if(t||i)return t&&i?n.getTime()===e.getTime():!1;if(t=Ci(n),i=Ci(e),t||i)return n===e;if(t=Ke(n),i=Ke(e),t||i)return t&&i?WS(n,e):!1;if(t=bt(n),i=bt(e),t||i){if(!t||!i)return!1;const r=Object.keys(n).length,s=Object.keys(e).length;if(r!==s)return!1;for(const o in n){const a=n.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!bp(n[o],e[o]))return!1}}return String(n)===String(e)}const P0=n=>!!(n&&n.__v_isRef===!0),no=n=>kt(n)?n:n==null?"":Ke(n)||bt(n)&&(n.toString===w0||!et(n.toString))?P0(n)?no(n.value):JSON.stringify(n,D0,2):String(n),D0=(n,e)=>P0(e)?D0(n,e.value):oa(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((t,[i,r],s)=>(t[bf(i,s)+" =>"]=r,t),{})}:T0(e)?{[`Set(${e.size})`]:[...e.values()].map(t=>bf(t))}:Ci(e)?bf(e):bt(e)&&!Ke(e)&&!A0(e)?String(e):e,bf=(n,e="")=>{var t;return Ci(n)?`Symbol(${(t=n.description)!=null?t:e})`:n};let dn;class L0{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&dn&&(dn.active?(this.parent=dn,this.index=(dn.scopes||(dn.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){const t=dn;try{return dn=this,e()}finally{dn=t}}}on(){++this._on===1&&(this.prevScope=dn,dn=this)}off(){if(this._on>0&&--this._on===0){if(dn===this)dn=this.prevScope;else{let e=dn;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,i;for(t=0,i=this.effects.length;t<i;t++)this.effects[t].stop();for(this.effects.length=0,t=0,i=this.cleanups.length;t<i;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,i=this.scopes.length;t<i;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function XS(n){return new L0(n)}function Ep(){return dn}function $S(n,e=!1){dn&&dn.cleanups.push(n)}let Bt;const Ef=new WeakSet;class I0{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,dn&&(dn.active?dn.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ef.has(this)&&(Ef.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||U0(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Wm(this),F0(this);const e=Bt,t=Ji;Bt=this,Ji=!0;try{return this.fn()}finally{O0(this),Bt=e,Ji=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ap(e);this.deps=this.depsTail=void 0,Wm(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ef.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Lh(this)&&this.run()}get dirty(){return Lh(this)}}let N0=0,ul,fl;function U0(n,e=!1){if(n.flags|=8,e){n.next=fl,fl=n;return}n.next=ul,ul=n}function Tp(){N0++}function wp(){if(--N0>0)return;if(fl){let e=fl;for(fl=void 0;e;){const t=e.next;e.next=void 0,e.flags&=-9,e=t}}let n;for(;ul;){let e=ul;for(ul=void 0;e;){const t=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){n||(n=i)}e=t}}if(n)throw n}function F0(n){for(let e=n.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function O0(n){let e,t=n.depsTail,i=t;for(;i;){const r=i.prevDep;i.version===-1?(i===t&&(t=r),Ap(i),qS(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}n.deps=e,n.depsTail=t}function Lh(n){for(let e=n.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(B0(e.dep.computed)||e.dep.version!==e.version))return!0;return!!n._dirty}function B0(n){if(n.flags&4&&!(n.flags&16)||(n.flags&=-17,n.globalVersion===Rl)||(n.globalVersion=Rl,!n.isSSR&&n.flags&128&&(!n.deps&&!n._dirty||!Lh(n))))return;n.flags|=2;const e=n.dep,t=Bt,i=Ji;Bt=n,Ji=!0;try{F0(n);const r=n.fn(n._value);(e.version===0||kn(r,n._value))&&(n.flags|=128,n._value=r,e.version++)}catch(r){throw e.version++,r}finally{Bt=t,Ji=i,O0(n),n.flags&=-3}}function Ap(n,e=!1){const{dep:t,prevSub:i,nextSub:r}=n;if(i&&(i.nextSub=r,n.prevSub=void 0),r&&(r.prevSub=i,n.nextSub=void 0),t.subs===n&&(t.subs=i,!i&&t.computed)){t.computed.flags&=-5;for(let s=t.computed.deps;s;s=s.nextDep)Ap(s,!0)}!e&&!--t.sc&&t.map&&t.map.delete(t.key)}function qS(n){const{prevDep:e,nextDep:t}=n;e&&(e.nextDep=t,n.prevDep=void 0),t&&(t.prevDep=e,n.nextDep=void 0)}let Ji=!0;const k0=[];function qr(){k0.push(Ji),Ji=!1}function Yr(){const n=k0.pop();Ji=n===void 0?!0:n}function Wm(n){const{cleanup:e}=n;if(n.cleanup=void 0,e){const t=Bt;Bt=void 0;try{e()}finally{Bt=t}}}let Rl=0;class YS{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ju{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Bt||!Ji||Bt===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Bt)t=this.activeLink=new YS(Bt,this),Bt.deps?(t.prevDep=Bt.depsTail,Bt.depsTail.nextDep=t,Bt.depsTail=t):Bt.deps=Bt.depsTail=t,H0(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const i=t.nextDep;i.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=i),t.prevDep=Bt.depsTail,t.nextDep=void 0,Bt.depsTail.nextDep=t,Bt.depsTail=t,Bt.deps===t&&(Bt.deps=i)}return t}trigger(e){this.version++,Rl++,this.notify(e)}notify(e){Tp();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{wp()}}}function H0(n){if(n.dep.sc++,n.sub.flags&4){const e=n.dep.computed;if(e&&!n.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)H0(i)}const t=n.dep.subs;t!==n&&(n.prevSub=t,t&&(t.nextSub=n)),n.dep.subs=n}}const du=new WeakMap,ao=Symbol(""),Ih=Symbol(""),Cl=Symbol("");function Hn(n,e,t){if(Ji&&Bt){let i=du.get(n);i||du.set(n,i=new Map);let r=i.get(t);r||(i.set(t,r=new Ju),r.map=i,r.key=t),r.track()}}function Or(n,e,t,i,r,s){const o=du.get(n);if(!o){Rl++;return}const a=l=>{l&&l.trigger()};if(Tp(),e==="clear")o.forEach(a);else{const l=Ke(n),c=l&&qu(t);if(l&&t==="length"){const u=Number(i);o.forEach((h,f)=>{(f==="length"||f===Cl||!Ci(f)&&f>=u)&&a(h)})}else switch((t!==void 0||o.has(void 0))&&a(o.get(t)),c&&a(o.get(Cl)),e){case"add":l?c&&a(o.get("length")):(a(o.get(ao)),oa(n)&&a(o.get(Ih)));break;case"delete":l||(a(o.get(ao)),oa(n)&&a(o.get(Ih)));break;case"set":oa(n)&&a(o.get(ao));break}}wp()}function jS(n,e){const t=du.get(n);return t&&t.get(e)}function Lo(n){const e=_t(n);return e===n?e:(Hn(e,"iterate",Cl),Ai(n)?e:e.map(Qi))}function Qu(n){return Hn(n=_t(n),"iterate",Cl),n}function cr(n,e){return yr(n)?ya(ws(n)?Qi(e):e):Qi(e)}const KS={__proto__:null,[Symbol.iterator](){return Tf(this,Symbol.iterator,n=>cr(this,n))},concat(...n){return Lo(this).concat(...n.map(e=>Ke(e)?Lo(e):e))},entries(){return Tf(this,"entries",n=>(n[1]=cr(this,n[1]),n))},every(n,e){return Ar(this,"every",n,e,void 0,arguments)},filter(n,e){return Ar(this,"filter",n,e,t=>t.map(i=>cr(this,i)),arguments)},find(n,e){return Ar(this,"find",n,e,t=>cr(this,t),arguments)},findIndex(n,e){return Ar(this,"findIndex",n,e,void 0,arguments)},findLast(n,e){return Ar(this,"findLast",n,e,t=>cr(this,t),arguments)},findLastIndex(n,e){return Ar(this,"findLastIndex",n,e,void 0,arguments)},forEach(n,e){return Ar(this,"forEach",n,e,void 0,arguments)},includes(...n){return wf(this,"includes",n)},indexOf(...n){return wf(this,"indexOf",n)},join(n){return Lo(this).join(n)},lastIndexOf(...n){return wf(this,"lastIndexOf",n)},map(n,e){return Ar(this,"map",n,e,void 0,arguments)},pop(){return za(this,"pop")},push(...n){return za(this,"push",n)},reduce(n,...e){return Xm(this,"reduce",n,e)},reduceRight(n,...e){return Xm(this,"reduceRight",n,e)},shift(){return za(this,"shift")},some(n,e){return Ar(this,"some",n,e,void 0,arguments)},splice(...n){return za(this,"splice",n)},toReversed(){return Lo(this).toReversed()},toSorted(n){return Lo(this).toSorted(n)},toSpliced(...n){return Lo(this).toSpliced(...n)},unshift(...n){return za(this,"unshift",n)},values(){return Tf(this,"values",n=>cr(this,n))}};function Tf(n,e,t){const i=Qu(n),r=i[e]();return i!==n&&!Ai(n)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=t(s.value)),s}),r}const ZS=Array.prototype;function Ar(n,e,t,i,r,s){const o=Qu(n),a=o!==n&&!Ai(n),l=o[e];if(l!==ZS[e]){const h=l.apply(n,s);return a?Qi(h):h}let c=t;o!==n&&(a?c=function(h,f){return t.call(this,cr(n,h),f,n)}:t.length>2&&(c=function(h,f){return t.call(this,h,f,n)}));const u=l.call(o,c,i);return a&&r?r(u):u}function Xm(n,e,t,i){const r=Qu(n),s=r!==n&&!Ai(n);let o=t,a=!1;r!==n&&(s?(a=i.length===0,o=function(c,u,h){return a&&(a=!1,c=cr(n,c)),t.call(this,c,cr(n,u),h,n)}):t.length>3&&(o=function(c,u,h){return t.call(this,c,u,h,n)}));const l=r[e](o,...i);return a?cr(n,l):l}function wf(n,e,t){const i=_t(n);Hn(i,"iterate",Cl);const r=i[e](...t);return(r===-1||r===!1)&&ef(t[0])?(t[0]=_t(t[0]),i[e](...t)):r}function za(n,e,t=[]){qr(),Tp();const i=_t(n)[e].apply(n,t);return wp(),Yr(),i}const JS=yp("__proto__,__v_isRef,__isVue"),z0=new Set(Object.getOwnPropertyNames(Symbol).filter(n=>n!=="arguments"&&n!=="caller").map(n=>Symbol[n]).filter(Ci));function QS(n){Ci(n)||(n=String(n));const e=_t(this);return Hn(e,"has",n),e.hasOwnProperty(n)}class V0{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,i){if(t==="__v_skip")return e.__v_skip;const r=this._isReadonly,s=this._isShallow;if(t==="__v_isReactive")return!r;if(t==="__v_isReadonly")return r;if(t==="__v_isShallow")return s;if(t==="__v_raw")return i===(r?s?cM:$0:s?X0:W0).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=Ke(e);if(!r){let l;if(o&&(l=KS[t]))return l;if(t==="hasOwnProperty")return QS}const a=Reflect.get(e,t,en(e)?e:i);if((Ci(t)?z0.has(t):JS(t))||(r||Hn(e,"get",t),s))return a;if(en(a)){const l=o&&qu(t)?a:a.value;return r&&bt(l)?Uh(l):l}return bt(a)?r?Uh(a):Ds(a):a}}class G0 extends V0{constructor(e=!1){super(!1,e)}set(e,t,i,r){let s=e[t];const o=Ke(e)&&qu(t);if(!this._isShallow){const c=yr(s);if(!Ai(i)&&!yr(i)&&(s=_t(s),i=_t(i)),!o&&en(s)&&!en(i))return c||(s.value=i),!0}const a=o?Number(t)<e.length:xt(e,t),l=Reflect.set(e,t,i,en(e)?e:r);return e===_t(r)&&(a?kn(i,s)&&Or(e,"set",t,i):Or(e,"add",t,i)),l}deleteProperty(e,t){const i=xt(e,t);e[t];const r=Reflect.deleteProperty(e,t);return r&&i&&Or(e,"delete",t,void 0),r}has(e,t){const i=Reflect.has(e,t);return(!Ci(t)||!z0.has(t))&&Hn(e,"has",t),i}ownKeys(e){return Hn(e,"iterate",Ke(e)?"length":ao),Reflect.ownKeys(e)}}class eM extends V0{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}}const tM=new G0,nM=new eM,iM=new G0(!0);const Nh=n=>n,ic=n=>Reflect.getPrototypeOf(n);function rM(n,e,t){return function(...i){const r=this.__v_raw,s=_t(r),o=oa(s),a=n==="entries"||n===Symbol.iterator&&o,l=n==="keys"&&o,c=r[n](...i),u=t?Nh:e?ya:Qi;return!e&&Hn(s,"iterate",l?Ih:ao),Tn(Object.create(c),{next(){const{value:h,done:f}=c.next();return f?{value:h,done:f}:{value:a?[u(h[0]),u(h[1])]:u(h),done:f}}})}}function rc(n){return function(...e){return n==="delete"?!1:n==="clear"?void 0:this}}function sM(n,e){const t={get(r){const s=this.__v_raw,o=_t(s),a=_t(r);n||(kn(r,a)&&Hn(o,"get",r),Hn(o,"get",a));const{has:l}=ic(o),c=e?Nh:n?ya:Qi;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!n&&Hn(_t(r),"iterate",ao),r.size},has(r){const s=this.__v_raw,o=_t(s),a=_t(r);return n||(kn(r,a)&&Hn(o,"has",r),Hn(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=_t(a),c=e?Nh:n?ya:Qi;return!n&&Hn(l,"iterate",ao),a.forEach((u,h)=>r.call(s,c(u),c(h),o))}};return Tn(t,n?{add:rc("add"),set:rc("set"),delete:rc("delete"),clear:rc("clear")}:{add(r){const s=_t(this),o=ic(s),a=_t(r),l=!e&&!Ai(r)&&!yr(r)?a:r;return o.has.call(s,l)||kn(r,l)&&o.has.call(s,r)||kn(a,l)&&o.has.call(s,a)||(s.add(l),Or(s,"add",l,l)),this},set(r,s){!e&&!Ai(s)&&!yr(s)&&(s=_t(s));const o=_t(this),{has:a,get:l}=ic(o);let c=a.call(o,r);c||(r=_t(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?kn(s,u)&&Or(o,"set",r,s):Or(o,"add",r,s),this},delete(r){const s=_t(this),{has:o,get:a}=ic(s);let l=o.call(s,r);l||(r=_t(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&Or(s,"delete",r,void 0),c},clear(){const r=_t(this),s=r.size!==0,o=r.clear();return s&&Or(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{t[r]=rM(r,n,e)}),t}function Rp(n,e){const t=sM(n,e);return(i,r,s)=>r==="__v_isReactive"?!n:r==="__v_isReadonly"?n:r==="__v_raw"?i:Reflect.get(xt(t,r)&&r in i?t:i,r,s)}const oM={get:Rp(!1,!1)},aM={get:Rp(!1,!0)},lM={get:Rp(!0,!1)};const W0=new WeakMap,X0=new WeakMap,$0=new WeakMap,cM=new WeakMap;function uM(n){switch(n){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function fM(n){return n.__v_skip||!Object.isExtensible(n)?0:uM(LS(n))}function Ds(n){return yr(n)?n:Cp(n,!1,tM,oM,W0)}function Qs(n){return Cp(n,!1,iM,aM,X0)}function Uh(n){return Cp(n,!0,nM,lM,$0)}function Cp(n,e,t,i,r){if(!bt(n)||n.__v_raw&&!(e&&n.__v_isReactive))return n;const s=fM(n);if(s===0)return n;const o=r.get(n);if(o)return o;const a=new Proxy(n,s===2?i:t);return r.set(n,a),a}function ws(n){return yr(n)?ws(n.__v_raw):!!(n&&n.__v_isReactive)}function yr(n){return!!(n&&n.__v_isReadonly)}function Ai(n){return!!(n&&n.__v_isShallow)}function ef(n){return n?!!n.__v_raw:!1}function _t(n){const e=n&&n.__v_raw;return e?_t(e):n}function hM(n){return!xt(n,"__v_skip")&&Object.isExtensible(n)&&R0(n,"__v_skip",!0),n}const Qi=n=>bt(n)?Ds(n):n,ya=n=>bt(n)?Uh(n):n;function en(n){return n?n.__v_isRef===!0:!1}function At(n){return q0(n,!1)}function Pl(n){return q0(n,!0)}function q0(n,e){return en(n)?n:new dM(n,e)}class dM{constructor(e,t){this.dep=new Ju,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:_t(e),this._value=t?e:Qi(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){const t=this._rawValue,i=this.__v_isShallow||Ai(e)||yr(e);e=i?e:_t(e),kn(e,t)&&(this._rawValue=e,this._value=i?e:Qi(e),this.dep.trigger())}}function pt(n){return en(n)?n.value:n}function pM(n){return et(n)?n():pt(n)}const mM={get:(n,e,t)=>e==="__v_raw"?n:pt(Reflect.get(n,e,t)),set:(n,e,t,i)=>{const r=n[e];return en(r)&&!en(t)?(r.value=t,!0):Reflect.set(n,e,t,i)}};function Y0(n){return ws(n)?n:new Proxy(n,mM)}class _M{constructor(e){this.__v_isRef=!0,this._value=void 0;const t=this.dep=new Ju,{get:i,set:r}=e(t.track.bind(t),t.trigger.bind(t));this._get=i,this._set=r}get value(){return this._value=this._get()}set value(e){this._set(e)}}function gM(n){return new _M(n)}class vM{constructor(e,t,i){this._object=e,this._defaultValue=i,this.__v_isRef=!0,this._value=void 0,this._key=Ci(t)?t:String(t),this._raw=_t(e);let r=!0,s=e;if(!Ke(e)||Ci(this._key)||!qu(this._key))do r=!ef(s)||Ai(s);while(r&&(s=s.__v_raw));this._shallow=r}get value(){let e=this._object[this._key];return this._shallow&&(e=pt(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&en(this._raw[this._key])){const t=this._object[this._key];if(en(t)){t.value=e;return}}this._object[this._key]=e}get dep(){return jS(this._raw,this._key)}}class xM{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function yM(n,e,t){return en(n)?n:et(n)?new xM(n):bt(n)&&arguments.length>1?SM(n,e,t):At(n)}function SM(n,e,t){return new vM(n,e,t)}class MM{constructor(e,t,i){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Ju(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Rl-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&Bt!==this)return U0(this,!0),!0}get value(){const e=this.dep.track();return B0(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function bM(n,e,t=!1){let i,r;return et(n)?i=n:(i=n.get,r=n.set),new MM(i,r,t)}const sc={},pu=new WeakMap;let js;function EM(n,e=!1,t=js){if(t){let i=pu.get(t);i||pu.set(t,i=[]),i.push(n)}}function TM(n,e,t=yt){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=t,c=x=>r?x:Ai(x)||r===!1||r===0?ms(x,1):ms(x);let u,h,f,d,p=!1,m=!1;if(en(n)?(h=()=>n.value,p=Ai(n)):ws(n)?(h=()=>c(n),p=!0):Ke(n)?(m=!0,p=n.some(x=>ws(x)||Ai(x)),h=()=>n.map(x=>{if(en(x))return x.value;if(ws(x))return c(x);if(et(x))return l?l(x,2):x()})):et(n)?e?h=l?()=>l(n,2):n:h=()=>{if(f){qr();try{f()}finally{Yr()}}const x=js;js=u;try{return l?l(n,3,[d]):n(d)}finally{js=x}}:h=_r,e&&r){const x=h,b=r===!0?1/0:r;h=()=>ms(x(),b)}const _=Ep(),g=()=>{u.stop(),_&&_.active&&Sp(_.effects,u)};if(s&&e){const x=e;e=(...b)=>{x(...b),g()}}let y=m?new Array(n.length).fill(sc):sc;const v=x=>{if(!(!(u.flags&1)||!u.dirty&&!x))if(e){const b=u.run();if(r||p||(m?b.some((T,w)=>kn(T,y[w])):kn(b,y))){f&&f();const T=js;js=u;try{const w=[b,y===sc?void 0:m&&y[0]===sc?[]:y,d];y=b,l?l(e,3,w):e(...w)}finally{js=T}}}else u.run()};return a&&a(v),u=new I0(h),u.scheduler=o?()=>o(v,!1):v,d=x=>EM(x,!1,u),f=u.onStop=()=>{const x=pu.get(u);if(x){if(l)l(x,4);else for(const b of x)b();pu.delete(u)}},e?i?v(!0):y=u.run():o?o(v.bind(null,!0),!0):u.run(),g.pause=u.pause.bind(u),g.resume=u.resume.bind(u),g.stop=g,g}function ms(n,e=1/0,t){if(e<=0||!bt(n)||n.__v_skip||(t=t||new Map,(t.get(n)||0)>=e))return n;if(t.set(n,e),e--,en(n))ms(n.value,e,t);else if(Ke(n))for(let i=0;i<n.length;i++)ms(n[i],e,t);else if(T0(n)||oa(n))n.forEach(i=>{ms(i,e,t)});else if(A0(n)){for(const i in n)ms(n[i],e,t);for(const i of Object.getOwnPropertySymbols(n))Object.prototype.propertyIsEnumerable.call(n,i)&&ms(n[i],e,t)}return n}function Kl(n,e,t,i){try{return i?n(...i):n()}catch(r){Ua(r,e,t)}}function Sr(n,e,t,i){if(et(n)){const r=Kl(n,e,t,i);return r&&Mp(r)&&r.catch(s=>{Ua(s,e,t)}),r}if(Ke(n)){const r=[];for(let s=0;s<n.length;s++)r.push(Sr(n[s],e,t,i));return r}}function Ua(n,e,t,i=!0){const r=e?e.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||yt;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${t}`;for(;a;){const u=a.ec;if(u){for(let h=0;h<u.length;h++)if(u[h](n,l,c)===!1)return}a=a.parent}if(s){qr(),Kl(s,null,10,[n,l,c]),Yr();return}}wM(n,t,r,i,o)}function wM(n,e,t,i=!0,r=!1){if(r)throw n;console.error(n)}const ei=[];let sr=-1;const aa=[];let ds=null,Jo=0;const j0=Promise.resolve();let mu=null;function _u(n){const e=mu||j0;return n?e.then(this?n.bind(this):n):e}function AM(n){let e=sr+1,t=ei.length;for(;e<t;){const i=e+t>>>1,r=ei[i],s=Dl(r);s<n||s===n&&r.flags&2?e=i+1:t=i}return e}function Pp(n){if(!(n.flags&1)){const e=Dl(n),t=ei[ei.length-1];!t||!(n.flags&2)&&e>=Dl(t)?ei.push(n):ei.splice(AM(e),0,n),n.flags|=1,K0()}}function K0(){mu||(mu=j0.then(Z0))}function Fh(n){Ke(n)?aa.push(...n):ds&&n.id===-1?ds.splice(Jo+1,0,n):n.flags&1||(aa.push(n),n.flags|=1),K0()}function $m(n,e,t=sr+1){for(;t<ei.length;t++){const i=ei[t];if(i&&i.flags&2){if(n&&i.id!==n.uid)continue;ei.splice(t,1),t--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function gu(n){if(aa.length){const e=[...new Set(aa)].sort((t,i)=>Dl(t)-Dl(i));if(aa.length=0,ds){ds.push(...e);return}for(ds=e,Jo=0;Jo<ds.length;Jo++){const t=ds[Jo];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}ds=null,Jo=0}}const Dl=n=>n.id==null?n.flags&2?-1:1/0:n.id;function Z0(n){try{for(sr=0;sr<ei.length;sr++){const e=ei[sr];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Kl(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;sr<ei.length;sr++){const e=ei[sr];e&&(e.flags&=-2)}sr=-1,ei.length=0,gu(),mu=null,(ei.length||aa.length)&&Z0()}}let ni=null,J0=null;function vu(n){const e=ni;return ni=n,J0=n&&n.type.__scopeId||null,e}function Dp(n,e=ni,t){if(!e||n._n)return n;const i=(...r)=>{i._d&&Mu(-1);const s=vu(e);let o;try{o=n(...r)}finally{vu(s),i._d&&Mu(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function or(n,e,t,i){const r=n.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(qr(),Sr(l,t,8,[n.el,a,n,e]),Yr())}}function Q0(n,e){if(Rn){let t=Rn.provides;const i=Rn.parent&&Rn.parent.provides;i===t&&(t=Rn.provides=Object.create(i)),t[n]=e}}function lo(n,e,t=!1){const i=Fa();if(i||uo){let r=uo?uo._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&n in r)return r[n];if(arguments.length>1)return t&&et(e)?e.call(i&&i.proxy):e}}function tf(){return!!(Fa()||uo)}const RM=Symbol.for("v-scx"),CM=()=>lo(RM);function PM(n,e){return nf(n,null,e)}function DM(n,e){return nf(n,null,{flush:"sync"})}function jc(n,e,t){return nf(n,e,t)}function nf(n,e,t=yt){const{immediate:i,deep:r,flush:s,once:o}=t,a=Tn({},t),l=e&&i||!e&&s!=="post";let c;if(ba){if(s==="sync"){const d=CM();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=_r,d.resume=_r,d.pause=_r,d}}const u=Rn;a.call=(d,p,m)=>Sr(d,u,p,m);let h=!1;s==="post"?a.scheduler=d=>{Kn(d,u&&u.suspense)}:s!=="sync"&&(h=!0,a.scheduler=(d,p)=>{p?d():Pp(d)}),a.augmentJob=d=>{e&&(d.flags|=4),h&&(d.flags|=2,u&&(d.id=u.uid,d.i=u))};const f=TM(n,e,a);return ba&&(c?c.push(f):l&&f()),f}function LM(n,e,t){const i=this.proxy,r=kt(n)?n.includes(".")?ev(i,n):()=>i[n]:n.bind(i,i);let s;et(e)?s=e:(s=e.handler,t=e);const o=Zl(this),a=nf(r,s.bind(i),t);return o(),a}function ev(n,e){const t=e.split(".");return()=>{let i=n;for(let r=0;r<t.length&&i;r++)i=i[t[r]];return i}}const IM=Symbol("_vte"),NM=n=>n.__isTeleport,UM=Symbol("_leaveCb");function Lp(n,e){n.shapeFlag&6&&n.component?(n.transition=e,Lp(n.component.subTree,e)):n.shapeFlag&128?(n.ssContent.transition=e.clone(n.ssContent),n.ssFallback.transition=e.clone(n.ssFallback)):n.transition=e}function Tr(n,e){return et(n)?Tn({name:n.name},e,{setup:n}):n}function Ip(n){n.ids=[n.ids[0]+n.ids[2]+++"-",0,0]}function qm(n,e){let t;return!!((t=Object.getOwnPropertyDescriptor(n,e))&&!t.configurable)}const xu=new WeakMap;function la(n,e,t,i,r=!1){if(Ke(n)){n.forEach((m,_)=>la(m,e&&(Ke(e)?e[_]:e),t,i,r));return}if(co(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&la(n,e,t,i.component.subTree);return}const s=i.shapeFlag&4?Bp(i.component):i.el,o=r?null:s,{i:a,r:l}=n,c=e&&e.r,u=a.refs===yt?a.refs={}:a.refs,h=a.setupState,f=_t(h),d=h===yt?E0:m=>qm(u,m)?!1:xt(f,m),p=(m,_)=>!(_&&qm(u,_));if(c!=null&&c!==l){if(Ym(e),kt(c))u[c]=null,d(c)&&(h[c]=null);else if(en(c)){const m=e;p(c,m.k)&&(c.value=null),m.k&&(u[m.k]=null)}}if(et(l))Kl(l,a,12,[o,u]);else{const m=kt(l),_=en(l);if(m||_){const g=()=>{if(n.f){const y=m?d(l)?h[l]:u[l]:p()||!n.k?l.value:u[n.k];if(r)Ke(y)&&Sp(y,s);else if(Ke(y))y.includes(s)||y.push(s);else if(m)u[l]=[s],d(l)&&(h[l]=u[l]);else{const v=[s];p(l,n.k)&&(l.value=v),n.k&&(u[n.k]=v)}}else m?(u[l]=o,d(l)&&(h[l]=o)):_&&(p(l,n.k)&&(l.value=o),n.k&&(u[n.k]=o))};if(o){const y=()=>{g(),xu.delete(n)};y.id=-1,xu.set(n,y),Kn(y,t)}else Ym(n),g()}}}function Ym(n){const e=xu.get(n);e&&(e.flags|=8,xu.delete(n))}let jm=!1;const Io=()=>{jm||(console.error("Hydration completed but contains mismatches."),jm=!0)},FM=n=>n.namespaceURI.includes("svg")&&n.tagName!=="foreignObject",OM=n=>n.namespaceURI.includes("MathML"),oc=n=>{if(n.nodeType===1){if(FM(n))return"svg";if(OM(n))return"mathml"}},ta=n=>n.nodeType===8;function BM(n){const{mt:e,p:t,o:{patchProp:i,createText:r,nextSibling:s,parentNode:o,remove:a,insert:l,createComment:c}}=n,u=(v,x)=>{if(!x.hasChildNodes()){t(null,v,x),gu(),x._vnode=v;return}h(x.firstChild,v,null,null,null),gu(),x._vnode=v},h=(v,x,b,T,w,S=!1)=>{S=S||!!x.dynamicChildren;const E=ta(v)&&v.data==="[",A=()=>m(v,x,b,T,w,E),{type:D,ref:L,shapeFlag:H,patchFlag:z}=x;let k=v.nodeType;x.el=v,z===-2&&(S=!1,x.dynamicChildren=null);let B=null;switch(D){case fo:k!==3?x.children===""?(l(x.el=r(""),o(v),v),B=v):B=A():(v.data!==x.children&&(Io(),v.data=x.children),B=s(v));break;case Mr:y(v)?(B=s(v),g(x.el=v.content.firstChild,v,b)):k!==8||E?B=A():B=s(v);break;case dl:if(E&&(v=s(v),k=v.nodeType),k===1||k===3){B=v;const U=!x.children.length;for(let G=0;G<x.staticCount;G++)U&&(x.children+=B.nodeType===1?B.outerHTML:B.data),G===x.staticCount-1&&(x.anchor=B),B=s(B);return E?s(B):B}else A();break;case ln:E?B=p(v,x,b,T,w,S):B=A();break;default:if(H&1)(k!==1||x.type.toLowerCase()!==v.tagName.toLowerCase())&&!y(v)?B=A():B=f(v,x,b,T,w,S);else if(H&6){x.slotScopeIds=w;const U=o(v);if(E?B=_(v):ta(v)&&v.data==="teleport start"?B=_(v,v.data,"teleport end"):B=s(v),e(x,U,null,b,T,oc(U),S),co(x)&&!x.type.__asyncResolved){let G;E?(G=Nt(ln),G.anchor=B?B.previousSibling:U.lastChild):G=v.nodeType===3?ua(""):Nt("div"),G.el=v,x.component.subTree=G}}else H&64?k!==8?B=A():B=x.type.hydrate(v,x,b,T,w,S,n,d):H&128&&(B=x.type.hydrate(v,x,b,T,oc(o(v)),w,S,n,h))}return L!=null&&la(L,null,T,x),B},f=(v,x,b,T,w,S)=>{S=S||!!x.dynamicChildren;const{type:E,props:A,patchFlag:D,shapeFlag:L,dirs:H,transition:z}=x,k=E==="input"||E==="option";if(k||D!==-1){H&&or(x,null,b,"created");let B=!1;if(y(v)){B=wv(null,z)&&b&&b.vnode.props&&b.vnode.props.appear;const G=v.content.firstChild;if(B){const ee=G.getAttribute("class");ee&&(G.$cls=ee),z.beforeEnter(G)}g(G,v,b),x.el=v=G}if(L&16&&!(A&&(A.innerHTML||A.textContent))){let G=d(v.firstChild,x,v,b,T,w,S);for(;G;){ac(v,1)||Io();const ee=G;G=G.nextSibling,a(ee)}}else if(L&8){let G=x.children;G[0]===`
`&&(v.tagName==="PRE"||v.tagName==="TEXTAREA")&&(G=G.slice(1));const{textContent:ee}=v;ee!==G&&ee!==G.replace(/\r\n|\r/g,`
`)&&(ac(v,0)||Io(),v.textContent=x.children)}if(A){if(k||!S||D&48){const G=v.tagName.includes("-");for(const ee in A)(k&&(ee.endsWith("value")||ee==="indeterminate")||ql(ee)&&!oo(ee)||ee[0]==="."||G&&!oo(ee))&&i(v,ee,null,A[ee],void 0,b)}else if(A.onClick)i(v,"onClick",null,A.onClick,void 0,b);else if(D&4&&ws(A.style))for(const G in A.style)A.style[G]}let U;(U=A&&A.onVnodeBeforeMount)&&Ui(U,b,x),H&&or(x,null,b,"beforeMount"),((U=A&&A.onVnodeMounted)||H||B)&&Lv(()=>{U&&Ui(U,b,x),B&&z.enter(v),H&&or(x,null,b,"mounted")},T)}return v.nextSibling},d=(v,x,b,T,w,S,E)=>{E=E||!!x.dynamicChildren;const A=x.children,D=A.length;for(let L=0;L<D;L++){const H=E?A[L]:A[L]=Si(A[L]),z=H.type===fo;v?(z&&!E&&L+1<D&&Si(A[L+1]).type===fo&&(l(r(v.data.slice(H.children.length)),b,s(v)),v.data=H.children),v=h(v,H,T,w,S,E)):z&&!H.children?l(H.el=r(""),b):(ac(b,1)||Io(),t(null,H,b,null,T,w,oc(b),S))}return v},p=(v,x,b,T,w,S)=>{const{slotScopeIds:E}=x;E&&(w=w?w.concat(E):E);const A=o(v),D=d(s(v),x,A,b,T,w,S);return D&&ta(D)&&D.data==="]"?s(x.anchor=D):(Io(),l(x.anchor=c("]"),A,D),D)},m=(v,x,b,T,w,S)=>{if(ac(v.parentElement,1)||Io(),x.el=null,S){const D=_(v);for(;;){const L=s(v);if(L&&L!==D)a(L);else break}}const E=s(v),A=o(v);return a(v),t(null,x,A,E,b,T,oc(A),w),b&&(b.vnode.el=x.el,af(b,x.el)),E},_=(v,x="[",b="]")=>{let T=0;for(;v;)if(v=s(v),v&&ta(v)&&(v.data===x&&T++,v.data===b)){if(T===0)return s(v);T--}return v},g=(v,x,b)=>{const T=x.parentNode;T&&T.replaceChild(v,x);let w=b;for(;w;)w.vnode.el===x&&(w.vnode.el=w.subTree.el=v),w=w.parent},y=v=>v.nodeType===1&&v.tagName==="TEMPLATE";return[u,h]}const Km="data-allow-mismatch",kM={0:"text",1:"children",2:"class",3:"style",4:"attribute"};function ac(n,e){if(e===0||e===1)for(;n&&!n.hasAttribute(Km);)n=n.parentElement;const t=n&&n.getAttribute(Km);if(t==null)return!1;if(t==="")return!0;{const i=t.split(",");return e===0&&i.includes("children")?!0:i.includes(kM[e])}}Ku().requestIdleCallback;Ku().cancelIdleCallback;function HM(n,e){if(ta(n)&&n.data==="["){let t=1,i=n.nextSibling;for(;i;){if(i.nodeType===1){if(e(i)===!1)break}else if(ta(i))if(i.data==="]"){if(--t===0)break}else i.data==="["&&t++;i=i.nextSibling}}else e(n)}const co=n=>!!n.type.__asyncLoader;function Zm(n){et(n)&&(n={loader:n});const{loader:e,loadingComponent:t,errorComponent:i,delay:r=200,hydrate:s,timeout:o,suspensible:a=!0,onError:l}=n;let c=null,u,h=0;const f=()=>(h++,c=null,d()),d=()=>{let p;return c||(p=c=e().catch(m=>{if(m=m instanceof Error?m:new Error(String(m)),l)return new Promise((_,g)=>{l(m,()=>_(f()),()=>g(m),h+1)});throw m}).then(m=>p!==c&&c?c:(m&&(m.__esModule||m[Symbol.toStringTag]==="Module")&&(m=m.default),u=m,m)))};return Tr({name:"AsyncComponentWrapper",__asyncLoader:d,__asyncHydrate(p,m,_){let g=!1;(m.bu||(m.bu=[])).push(()=>g=!0);const y=()=>{g||_()},v=s?()=>{const x=s(y,b=>HM(p,b));x&&(m.bum||(m.bum=[])).push(x)}:y;u?v():d().then(()=>!m.isUnmounted&&v())},get __asyncResolved(){return u},setup(){const p=Rn;if(Ip(p),u)return()=>lc(u,p);const m=v=>{c=null,Ua(v,p,13,!i)};if(a&&p.suspense||ba)return d().then(v=>()=>lc(v,p)).catch(v=>(m(v),()=>i?Nt(i,{error:v}):null));const _=At(!1),g=At(),y=At(!!r);return r&&setTimeout(()=>{y.value=!1},r),o!=null&&setTimeout(()=>{if(!_.value&&!g.value){const v=new Error(`Async component timed out after ${o}ms.`);m(v),g.value=v}},o),d().then(()=>{_.value=!0,p.parent&&Np(p.parent.vnode)&&p.parent.update()}).catch(v=>{m(v),g.value=v}),()=>{if(_.value&&u)return lc(u,p);if(g.value&&i)return Nt(i,{error:g.value});if(t&&!y.value)return lc(t,p)}}})}function lc(n,e){const{ref:t,props:i,children:r,ce:s}=e.vnode,o=Nt(n,i,r);return o.ref=t,o.ce=s,delete e.vnode.ce,o}const Np=n=>n.type.__isKeepAlive;function tv(n,e){iv(n,"a",e)}function nv(n,e){iv(n,"da",e)}function iv(n,e,t=Rn){const i=n.__wdc||(n.__wdc=()=>{let r=t;for(;r;){if(r.isDeactivated)return;r=r.parent}return n()});if(rf(e,i,t),t){let r=t.parent;for(;r&&r.parent;)Np(r.parent.vnode)&&zM(i,e,t,r),r=r.parent}}function zM(n,e,t,i){const r=rf(e,n,i,!0);rv(()=>{Sp(i[e],r)},t)}function rf(n,e,t=Rn,i=!1){if(t){const r=t[n]||(t[n]=[]),s=e.__weh||(e.__weh=(...o)=>{qr();const a=Zl(t),l=Sr(e,t,n,o);return a(),Yr(),l});return i?r.unshift(s):r.push(s),s}}const ts=n=>(e,t=Rn)=>{(!ba||n==="sp")&&rf(n,(...i)=>e(...i),t)},VM=ts("bm"),jr=ts("m"),GM=ts("bu"),WM=ts("u"),Bs=ts("bum"),rv=ts("um"),XM=ts("sp"),$M=ts("rtg"),qM=ts("rtc");function sv(n,e=Rn){rf("ec",n,e)}const ov="components";function ZL(n,e){return lv(ov,n,!0,e)||n}const av=Symbol.for("v-ndc");function YM(n){return kt(n)?lv(ov,n,!1)||n:n||av}function lv(n,e,t=!0,i=!1){const r=ni||Rn;if(r){const s=r.type;{const a=Ob(s,!1);if(a&&(a===e||a===Gn(e)||a===ju(Gn(e))))return s}const o=Jm(r[n]||s[n],e)||Jm(r.appContext[n],e);return!o&&i?s:o}}function Jm(n,e){return n&&(n[e]||n[Gn(e)]||n[ju(Gn(e))])}function sf(n,e,t,i){let r;const s=t,o=Ke(n);if(o||kt(n)){const a=o&&ws(n);let l=!1,c=!1;a&&(l=!Ai(n),c=yr(n),n=Qu(n)),r=new Array(n.length);for(let u=0,h=n.length;u<h;u++)r[u]=e(l?c?ya(Qi(n[u])):Qi(n[u]):n[u],u,void 0,s)}else if(typeof n=="number"){r=new Array(n);for(let a=0;a<n;a++)r[a]=e(a+1,a,void 0,s)}else if(bt(n))if(n[Symbol.iterator])r=Array.from(n,(a,l)=>e(a,l,void 0,s));else{const a=Object.keys(n);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=e(n[u],u,l,s)}}else r=[];return r}function cv(n,e,t={},i,r){if(ni.ce||ni.parent&&co(ni.parent)&&ni.parent.ce){const c=Object.keys(t).length>0;return e!=="default"&&(t.name=e),wt(),_s(ln,null,[Nt("slot",t,i&&i())],c?-2:64)}let s=n[e];s&&s._c&&(s._d=!1),wt();const o=s&&uv(s(t)),a=t.key||o&&o.key,l=_s(ln,{key:(a&&!Ci(a)?a:`_${e}`)+(!o&&i?"_fb":"")},o||(i?i():[]),o&&n._===1?64:-2);return s&&s._c&&(s._d=!0),l}function uv(n){return n.some(e=>Ma(e)?!(e.type===Mr||e.type===ln&&!uv(e.children)):!0)?n:null}const Oh=n=>n?Ov(n)?Bp(n):Oh(n.parent):null,hl=Tn(Object.create(null),{$:n=>n,$el:n=>n.vnode.el,$data:n=>n.data,$props:n=>n.props,$attrs:n=>n.attrs,$slots:n=>n.slots,$refs:n=>n.refs,$parent:n=>Oh(n.parent),$root:n=>Oh(n.root),$host:n=>n.ce,$emit:n=>n.emit,$options:n=>hv(n),$forceUpdate:n=>n.f||(n.f=()=>{Pp(n.update)}),$nextTick:n=>n.n||(n.n=_u.bind(n.proxy)),$watch:n=>LM.bind(n)}),Af=(n,e)=>n!==yt&&!n.__isScriptSetup&&xt(n,e),jM={get({_:n},e){if(e==="__v_skip")return!0;const{ctx:t,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=n;if(e[0]!=="$"){const f=o[e];if(f!==void 0)switch(f){case 1:return i[e];case 2:return r[e];case 4:return t[e];case 3:return s[e]}else{if(Af(i,e))return o[e]=1,i[e];if(r!==yt&&xt(r,e))return o[e]=2,r[e];if(xt(s,e))return o[e]=3,s[e];if(t!==yt&&xt(t,e))return o[e]=4,t[e];Bh&&(o[e]=0)}}const c=hl[e];let u,h;if(c)return e==="$attrs"&&Hn(n.attrs,"get",""),c(n);if((u=a.__cssModules)&&(u=u[e]))return u;if(t!==yt&&xt(t,e))return o[e]=4,t[e];if(h=l.config.globalProperties,xt(h,e))return h[e]},set({_:n},e,t){const{data:i,setupState:r,ctx:s}=n;return Af(r,e)?(r[e]=t,!0):i!==yt&&xt(i,e)?(i[e]=t,!0):xt(n.props,e)||e[0]==="$"&&e.slice(1)in n?!1:(s[e]=t,!0)},has({_:{data:n,setupState:e,accessCache:t,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(t[a]||n!==yt&&a[0]!=="$"&&xt(n,a)||Af(e,a)||xt(s,a)||xt(i,a)||xt(hl,a)||xt(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(n,e,t){return t.get!=null?n._.accessCache[e]=0:xt(t,"value")&&this.set(n,e,t.value,null),Reflect.defineProperty(n,e,t)}};function yu(n){return Ke(n)?n.reduce((e,t)=>(e[t]=null,e),{}):n}function KM(n,e){return!n||!e?n||e:Ke(n)&&Ke(e)?n.concat(e):Tn({},yu(n),yu(e))}let Bh=!0;function ZM(n){const e=hv(n),t=n.proxy,i=n.ctx;Bh=!1,e.beforeCreate&&Qm(e.beforeCreate,n,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:h,mounted:f,beforeUpdate:d,updated:p,activated:m,deactivated:_,beforeDestroy:g,beforeUnmount:y,destroyed:v,unmounted:x,render:b,renderTracked:T,renderTriggered:w,errorCaptured:S,serverPrefetch:E,expose:A,inheritAttrs:D,components:L,directives:H,filters:z}=e;if(c&&JM(c,i,null),o)for(const U in o){const G=o[U];et(G)&&(i[U]=G.bind(t))}if(r){const U=r.call(t,t);bt(U)&&(n.data=Ds(U))}if(Bh=!0,s)for(const U in s){const G=s[U],ee=et(G)?G.bind(t,t):et(G.get)?G.get.bind(t,t):_r,F=!et(G)&&et(G.set)?G.set.bind(t):_r,ve=lf({get:ee,set:F});Object.defineProperty(i,U,{enumerable:!0,configurable:!0,get:()=>ve.value,set:Te=>ve.value=Te})}if(a)for(const U in a)fv(a[U],i,t,U);if(l){const U=et(l)?l.call(t):l;Reflect.ownKeys(U).forEach(G=>{Q0(G,U[G])})}u&&Qm(u,n,"c");function B(U,G){Ke(G)?G.forEach(ee=>U(ee.bind(t))):G&&U(G.bind(t))}if(B(VM,h),B(jr,f),B(GM,d),B(WM,p),B(tv,m),B(nv,_),B(sv,S),B(qM,T),B($M,w),B(Bs,y),B(rv,x),B(XM,E),Ke(A))if(A.length){const U=n.exposed||(n.exposed={});A.forEach(G=>{Object.defineProperty(U,G,{get:()=>t[G],set:ee=>t[G]=ee,enumerable:!0})})}else n.exposed||(n.exposed={});b&&n.render===_r&&(n.render=b),D!=null&&(n.inheritAttrs=D),L&&(n.components=L),H&&(n.directives=H),E&&Ip(n)}function JM(n,e,t=_r){Ke(n)&&(n=kh(n));for(const i in n){const r=n[i];let s;bt(r)?"default"in r?s=lo(r.from||i,r.default,!0):s=lo(r.from||i):s=lo(r),en(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function Qm(n,e,t){Sr(Ke(n)?n.map(i=>i.bind(e.proxy)):n.bind(e.proxy),e,t)}function fv(n,e,t,i){let r=i.includes(".")?ev(t,i):()=>t[i];if(kt(n)){const s=e[n];et(s)&&jc(r,s)}else if(et(n))jc(r,n.bind(t));else if(bt(n))if(Ke(n))n.forEach(s=>fv(s,e,t,i));else{const s=et(n.handler)?n.handler.bind(t):e[n.handler];et(s)&&jc(r,s,n)}}function hv(n){const e=n.type,{mixins:t,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=n.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!t&&!i?l=e:(l={},r.length&&r.forEach(c=>Su(l,c,o,!0)),Su(l,e,o)),bt(e)&&s.set(e,l),l}function Su(n,e,t,i=!1){const{mixins:r,extends:s}=e;s&&Su(n,s,t,!0),r&&r.forEach(o=>Su(n,o,t,!0));for(const o in e)if(!(i&&o==="expose")){const a=QM[o]||t&&t[o];n[o]=a?a(n[o],e[o]):e[o]}return n}const QM={data:e_,props:t_,emits:t_,methods:Qa,computed:Qa,beforeCreate:qn,created:qn,beforeMount:qn,mounted:qn,beforeUpdate:qn,updated:qn,beforeDestroy:qn,beforeUnmount:qn,destroyed:qn,unmounted:qn,activated:qn,deactivated:qn,errorCaptured:qn,serverPrefetch:qn,components:Qa,directives:Qa,watch:tb,provide:e_,inject:eb};function e_(n,e){return e?n?function(){return Tn(et(n)?n.call(this,this):n,et(e)?e.call(this,this):e)}:e:n}function eb(n,e){return Qa(kh(n),kh(e))}function kh(n){if(Ke(n)){const e={};for(let t=0;t<n.length;t++)e[n[t]]=n[t];return e}return n}function qn(n,e){return n?[...new Set([].concat(n,e))]:e}function Qa(n,e){return n?Tn(Object.create(null),n,e):e}function t_(n,e){return n?Ke(n)&&Ke(e)?[...new Set([...n,...e])]:Tn(Object.create(null),yu(n),yu(e??{})):e}function tb(n,e){if(!n)return e;if(!e)return n;const t=Tn(Object.create(null),n);for(const i in e)t[i]=qn(n[i],e[i]);return t}function dv(){return{app:null,config:{isNativeTag:E0,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let nb=0;function ib(n,e){return function(i,r=null){et(i)||(i=Tn({},i)),r!=null&&!bt(r)&&(r=null);const s=dv(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:nb++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:kb,get config(){return s.config},set config(u){},use(u,...h){return o.has(u)||(u&&et(u.install)?(o.add(u),u.install(c,...h)):et(u)&&(o.add(u),u(c,...h))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,h){return h?(s.components[u]=h,c):s.components[u]},directive(u,h){return h?(s.directives[u]=h,c):s.directives[u]},mount(u,h,f){if(!l){const d=c._ceVNode||Nt(i,r);return d.appContext=s,f===!0?f="svg":f===!1&&(f=void 0),h&&e?e(d,u):n(d,u,f),l=!0,c._container=u,u.__vue_app__=c,Bp(d.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Sr(a,c._instance,16),n(null,c._container),delete c._container.__vue_app__)},provide(u,h){return s.provides[u]=h,c},runWithContext(u){const h=uo;uo=c;try{return u()}finally{uo=h}}};return c}}let uo=null;function rb(n,e,t=yt){const i=Fa(),r=Gn(e),s=Os(e),o=pv(n,r),a=gM((l,c)=>{let u,h=yt,f;return DM(()=>{const d=n[r];kn(u,d)&&(u=d,c())}),{get(){return l(),t.get?t.get(u):u},set(d){const p=t.set?t.set(d):d;if(!kn(p,u)&&!(h!==yt&&kn(d,h)))return;const m=i.vnode.props;m&&(e in m||r in m||s in m)&&(`onUpdate:${e}`in m||`onUpdate:${r}`in m||`onUpdate:${s}`in m)||(u=d,c()),i.emit(`update:${e}`,p),kn(d,p)&&kn(d,h)&&!kn(p,f)&&c(),h=d,f=p}}});return a[Symbol.iterator]=()=>{let l=0;return{next(){return l<2?{value:l++?o||yt:a,done:!1}:{done:!0}}}},a}const pv=(n,e)=>e==="modelValue"||e==="model-value"?n.modelModifiers:n[`${e}Modifiers`]||n[`${Gn(e)}Modifiers`]||n[`${Os(e)}Modifiers`];function sb(n,e,...t){if(n.isUnmounted)return;const i=n.vnode.props||yt;let r=t;const s=e.startsWith("update:"),o=s&&pv(i,e.slice(7));o&&(o.trim&&(r=t.map(u=>kt(u)?u.trim():u)),o.number&&(r=t.map(US)));let a,l=i[a=Sf(e)]||i[a=Sf(Gn(e))];!l&&s&&(l=i[a=Sf(Os(e))]),l&&Sr(l,n,6,r);const c=i[a+"Once"];if(c){if(!n.emitted)n.emitted={};else if(n.emitted[a])return;n.emitted[a]=!0,Sr(c,n,6,r)}}const ob=new WeakMap;function mv(n,e,t=!1){const i=t?ob:e.emitsCache,r=i.get(n);if(r!==void 0)return r;const s=n.emits;let o={},a=!1;if(!et(n)){const l=c=>{const u=mv(c,e,!0);u&&(a=!0,Tn(o,u))};!t&&e.mixins.length&&e.mixins.forEach(l),n.extends&&l(n.extends),n.mixins&&n.mixins.forEach(l)}return!s&&!a?(bt(n)&&i.set(n,null),null):(Ke(s)?s.forEach(l=>o[l]=null):Tn(o,s),bt(n)&&i.set(n,o),o)}function of(n,e){return!n||!ql(e)?!1:(e=e.slice(2).replace(/Once$/,""),xt(n,e[0].toLowerCase()+e.slice(1))||xt(n,Os(e))||xt(n,e))}function Rf(n){const{type:e,vnode:t,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:h,data:f,setupState:d,ctx:p,inheritAttrs:m}=n,_=vu(n);let g,y;try{if(t.shapeFlag&4){const x=r||i,b=x;g=Si(c.call(b,x,u,h,d,f,p)),y=a}else{const x=e;g=Si(x.length>1?x(h,{attrs:a,slots:o,emit:l}):x(h,null)),y=e.props?a:lb(a)}}catch(x){pl.length=0,Ua(x,n,1),g=Nt(Mr)}let v=g;if(y&&m!==!1){const x=Object.keys(y),{shapeFlag:b}=v;x.length&&b&7&&(s&&x.some($u)&&(y=cb(y,s)),v=Vr(v,y,!1,!0))}return t.dirs&&(v=Vr(v,null,!1,!0),v.dirs=v.dirs?v.dirs.concat(t.dirs):t.dirs),t.transition&&Lp(v,t.transition),g=v,vu(_),g}function ab(n,e=!0){let t;for(let i=0;i<n.length;i++){const r=n[i];if(Ma(r)){if(r.type!==Mr||r.children==="v-if"){if(t)return;t=r}}else return}return t}const lb=n=>{let e;for(const t in n)(t==="class"||t==="style"||ql(t))&&((e||(e={}))[t]=n[t]);return e},cb=(n,e)=>{const t={};for(const i in n)(!$u(i)||!(i.slice(9)in e))&&(t[i]=n[i]);return t};function ub(n,e,t){const{props:i,children:r,component:s}=n,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return i?n_(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let h=0;h<u.length;h++){const f=u[h];if(_v(o,i,f)&&!of(c,f))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?n_(i,o,c):!0:!!o;return!1}function n_(n,e,t){const i=Object.keys(e);if(i.length!==Object.keys(n).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(_v(e,n,s)&&!of(t,s))return!0}return!1}function _v(n,e,t){const i=n[t],r=e[t];return t==="style"&&bt(i)&&bt(r)?!bp(i,r):i!==r}function af({vnode:n,parent:e,suspense:t},i){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===n&&(r.suspense.vnode.el=r.el=i,n=r),r===n)(n=e.vnode).el=i,e=e.parent;else break}t&&t.activeBranch===n&&(t.vnode.el=i)}const gv={},vv=()=>Object.create(gv),xv=n=>Object.getPrototypeOf(n)===gv;function fb(n,e,t,i=!1){const r={},s=vv();n.propsDefaults=Object.create(null),yv(n,e,r,s);for(const o in n.propsOptions[0])o in r||(r[o]=void 0);t?n.props=i?r:Qs(r):n.type.props?n.props=r:n.props=s,n.attrs=s}function hb(n,e,t,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=n,a=_t(r),[l]=n.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=n.vnode.dynamicProps;for(let h=0;h<u.length;h++){let f=u[h];if(of(n.emitsOptions,f))continue;const d=e[f];if(l)if(xt(s,f))d!==s[f]&&(s[f]=d,c=!0);else{const p=Gn(f);r[p]=Hh(l,a,p,d,n,!1)}else d!==s[f]&&(s[f]=d,c=!0)}}}else{yv(n,e,r,s)&&(c=!0);let u;for(const h in a)(!e||!xt(e,h)&&((u=Os(h))===h||!xt(e,u)))&&(l?t&&(t[h]!==void 0||t[u]!==void 0)&&(r[h]=Hh(l,a,h,void 0,n,!0)):delete r[h]);if(s!==a)for(const h in s)(!e||!xt(e,h))&&(delete s[h],c=!0)}c&&Or(n.attrs,"set","")}function yv(n,e,t,i){const[r,s]=n.propsOptions;let o=!1,a;if(e)for(let l in e){if(oo(l))continue;const c=e[l];let u;r&&xt(r,u=Gn(l))?!s||!s.includes(u)?t[u]=c:(a||(a={}))[u]=c:of(n.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=_t(t),c=a||yt;for(let u=0;u<s.length;u++){const h=s[u];t[h]=Hh(r,l,h,c[h],n,!xt(c,h))}}return o}function Hh(n,e,t,i,r,s){const o=n[t];if(o!=null){const a=xt(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&et(l)){const{propsDefaults:c}=r;if(t in c)i=c[t];else{const u=Zl(r);i=c[t]=l.call(null,e),u()}}else i=l;r.ce&&r.ce._setProp(t,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===Os(t))&&(i=!0))}return i}const db=new WeakMap;function Sv(n,e,t=!1){const i=t?db:e.propsCache,r=i.get(n);if(r)return r;const s=n.props,o={},a=[];let l=!1;if(!et(n)){const u=h=>{l=!0;const[f,d]=Sv(h,e,!0);Tn(o,f),d&&a.push(...d)};!t&&e.mixins.length&&e.mixins.forEach(u),n.extends&&u(n.extends),n.mixins&&n.mixins.forEach(u)}if(!s&&!l)return bt(n)&&i.set(n,sa),sa;if(Ke(s))for(let u=0;u<s.length;u++){const h=Gn(s[u]);i_(h)&&(o[h]=yt)}else if(s)for(const u in s){const h=Gn(u);if(i_(h)){const f=s[u],d=o[h]=Ke(f)||et(f)?{type:f}:Tn({},f),p=d.type;let m=!1,_=!0;if(Ke(p))for(let g=0;g<p.length;++g){const y=p[g],v=et(y)&&y.name;if(v==="Boolean"){m=!0;break}else v==="String"&&(_=!1)}else m=et(p)&&p.name==="Boolean";d[0]=m,d[1]=_,(m||xt(d,"default"))&&a.push(h)}}const c=[o,a];return bt(n)&&i.set(n,c),c}function i_(n){return n[0]!=="$"&&!oo(n)}const Up=n=>n==="_"||n==="_ctx"||n==="$stable",Fp=n=>Ke(n)?n.map(Si):[Si(n)],pb=(n,e,t)=>{if(e._n)return e;const i=Dp((...r)=>Fp(e(...r)),t);return i._c=!1,i},Mv=(n,e,t)=>{const i=n._ctx;for(const r in n){if(Up(r))continue;const s=n[r];if(et(s))e[r]=pb(r,s,i);else if(s!=null){const o=Fp(s);e[r]=()=>o}}},bv=(n,e)=>{const t=Fp(e);n.slots.default=()=>t},Ev=(n,e,t)=>{for(const i in e)(t||!Up(i))&&(n[i]=e[i])},mb=(n,e,t)=>{const i=n.slots=vv();if(n.vnode.shapeFlag&32){const r=e._;r?(Ev(i,e,t),t&&R0(i,"_",r,!0)):Mv(e,i)}else e&&bv(n,e)},_b=(n,e,t)=>{const{vnode:i,slots:r}=n;let s=!0,o=yt;if(i.shapeFlag&32){const a=e._;a?t&&a===1?s=!1:Ev(r,e,t):(s=!e.$stable,Mv(e,r)),o=e}else e&&(bv(n,e),o={default:1});if(s)for(const a in r)!Up(a)&&o[a]==null&&delete r[a]},Kn=Lv;function gb(n){return Tv(n)}function vb(n){return Tv(n,BM)}function Tv(n,e){const t=Ku();t.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:h,nextSibling:f,setScopeId:d=_r,insertStaticContent:p}=n,m=(P,O,q,$=null,N=null,Z=null,fe=void 0,I=null,se=!!O.dynamicChildren)=>{if(P===O)return;P&&!gs(P,O)&&($=ce(P),Te(P,N,Z,!0),P=null),O.patchFlag===-2&&(se=!1,O.dynamicChildren=null);const{type:ne,ref:xe,shapeFlag:K}=O;switch(ne){case fo:_(P,O,q,$);break;case Mr:g(P,O,q,$);break;case dl:P==null&&y(O,q,$,fe);break;case ln:L(P,O,q,$,N,Z,fe,I,se);break;default:K&1?b(P,O,q,$,N,Z,fe,I,se):K&6?H(P,O,q,$,N,Z,fe,I,se):(K&64||K&128)&&ne.process(P,O,q,$,N,Z,fe,I,se,Fe)}xe!=null&&N?la(xe,P&&P.ref,Z,O||P,!O):xe==null&&P&&P.ref!=null&&la(P.ref,null,Z,P,!0)},_=(P,O,q,$)=>{if(P==null)i(O.el=a(O.children),q,$);else{const N=O.el=P.el;O.children!==P.children&&c(N,O.children)}},g=(P,O,q,$)=>{P==null?i(O.el=l(O.children||""),q,$):O.el=P.el},y=(P,O,q,$)=>{[P.el,P.anchor]=p(P.children,O,q,$,P.el,P.anchor)},v=({el:P,anchor:O},q,$)=>{let N;for(;P&&P!==O;)N=f(P),i(P,q,$),P=N;i(O,q,$)},x=({el:P,anchor:O})=>{let q;for(;P&&P!==O;)q=f(P),r(P),P=q;r(O)},b=(P,O,q,$,N,Z,fe,I,se)=>{if(O.type==="svg"?fe="svg":O.type==="math"&&(fe="mathml"),P==null)T(O,q,$,N,Z,fe,I,se);else{const ne=P.el&&P.el._isVueCE?P.el:null;try{ne&&ne._beginPatch(),E(P,O,N,Z,fe,I,se)}finally{ne&&ne._endPatch()}}},T=(P,O,q,$,N,Z,fe,I)=>{let se,ne;const{props:xe,shapeFlag:K,transition:_e,dirs:R}=P;if(se=P.el=o(P.type,Z,xe&&xe.is,xe),K&8?u(se,P.children):K&16&&S(P.children,se,null,$,N,Cf(P,Z),fe,I),R&&or(P,null,$,"created"),w(se,P,P.scopeId,fe,$),xe){for(const W in xe)W!=="value"&&!oo(W)&&s(se,W,null,xe[W],Z,$);"value"in xe&&s(se,"value",null,xe.value,Z),(ne=xe.onVnodeBeforeMount)&&Ui(ne,$,P)}R&&or(P,null,$,"beforeMount");const M=wv(N,_e);M&&_e.beforeEnter(se),i(se,O,q),((ne=xe&&xe.onVnodeMounted)||M||R)&&Kn(()=>{ne&&Ui(ne,$,P),M&&_e.enter(se),R&&or(P,null,$,"mounted")},N)},w=(P,O,q,$,N)=>{if(q&&d(P,q),$)for(let Z=0;Z<$.length;Z++)d(P,$[Z]);if(N){let Z=N.subTree;if(O===Z||Pv(Z.type)&&(Z.ssContent===O||Z.ssFallback===O)){const fe=N.vnode;w(P,fe,fe.scopeId,fe.slotScopeIds,N.parent)}}},S=(P,O,q,$,N,Z,fe,I,se=0)=>{for(let ne=se;ne<P.length;ne++){const xe=P[ne]=I?Ur(P[ne]):Si(P[ne]);m(null,xe,O,q,$,N,Z,fe,I)}},E=(P,O,q,$,N,Z,fe)=>{const I=O.el=P.el;let{patchFlag:se,dynamicChildren:ne,dirs:xe}=O;se|=P.patchFlag&16;const K=P.props||yt,_e=O.props||yt;let R;if(q&&zs(q,!1),(R=_e.onVnodeBeforeUpdate)&&Ui(R,q,O,P),xe&&or(O,P,q,"beforeUpdate"),q&&zs(q,!0),(K.innerHTML&&_e.innerHTML==null||K.textContent&&_e.textContent==null)&&u(I,""),ne?A(P.dynamicChildren,ne,I,q,$,Cf(O,N),Z):fe||G(P,O,I,null,q,$,Cf(O,N),Z,!1),se>0){if(se&16)D(I,K,_e,q,N);else if(se&2&&K.class!==_e.class&&s(I,"class",null,_e.class,N),se&4&&s(I,"style",K.style,_e.style,N),se&8){const M=O.dynamicProps;for(let W=0;W<M.length;W++){const J=M[W],oe=K[J],me=_e[J];(me!==oe||J==="value")&&s(I,J,oe,me,N,q)}}se&1&&P.children!==O.children&&u(I,O.children)}else!fe&&ne==null&&D(I,K,_e,q,N);((R=_e.onVnodeUpdated)||xe)&&Kn(()=>{R&&Ui(R,q,O,P),xe&&or(O,P,q,"updated")},$)},A=(P,O,q,$,N,Z,fe)=>{for(let I=0;I<O.length;I++){const se=P[I],ne=O[I],xe=se.el&&(se.type===ln||!gs(se,ne)||se.shapeFlag&198)?h(se.el):q;m(se,ne,xe,null,$,N,Z,fe,!0)}},D=(P,O,q,$,N)=>{if(O!==q){if(O!==yt)for(const Z in O)!oo(Z)&&!(Z in q)&&s(P,Z,O[Z],null,N,$);for(const Z in q){if(oo(Z))continue;const fe=q[Z],I=O[Z];fe!==I&&Z!=="value"&&s(P,Z,I,fe,N,$)}"value"in q&&s(P,"value",O.value,q.value,N)}},L=(P,O,q,$,N,Z,fe,I,se)=>{const ne=O.el=P?P.el:a(""),xe=O.anchor=P?P.anchor:a("");let{patchFlag:K,dynamicChildren:_e,slotScopeIds:R}=O;R&&(I=I?I.concat(R):R),P==null?(i(ne,q,$),i(xe,q,$),S(O.children||[],q,xe,N,Z,fe,I,se)):K>0&&K&64&&_e&&P.dynamicChildren&&P.dynamicChildren.length===_e.length?(A(P.dynamicChildren,_e,q,N,Z,fe,I),(O.key!=null||N&&O===N.subTree)&&Av(P,O,!0)):G(P,O,q,xe,N,Z,fe,I,se)},H=(P,O,q,$,N,Z,fe,I,se)=>{O.slotScopeIds=I,P==null?O.shapeFlag&512?N.ctx.activate(O,q,$,fe,se):z(O,q,$,N,Z,fe,se):k(P,O,se)},z=(P,O,q,$,N,Z,fe)=>{const I=P.component=Lb(P,$,N);if(Np(P)&&(I.ctx.renderer=Fe),Ib(I,!1,fe),I.asyncDep){if(N&&N.registerDep(I,B,fe),!P.el){const se=I.subTree=Nt(Mr);g(null,se,O,q),P.placeholder=se.el}}else B(I,P,O,q,N,Z,fe)},k=(P,O,q)=>{const $=O.component=P.component;if(ub(P,O,q))if($.asyncDep&&!$.asyncResolved){U($,O,q);return}else $.next=O,$.update();else O.el=P.el,$.vnode=O},B=(P,O,q,$,N,Z,fe)=>{const I=()=>{if(P.isMounted){let{next:K,bu:_e,u:R,parent:M,vnode:W}=P;{const re=Rv(P);if(re){K&&(K.el=W.el,U(P,K,fe)),re.asyncDep.then(()=>{Kn(()=>{P.isUnmounted||ne()},N)});return}}let J=K,oe;zs(P,!1),K?(K.el=W.el,U(P,K,fe)):K=W,_e&&Mf(_e),(oe=K.props&&K.props.onVnodeBeforeUpdate)&&Ui(oe,M,K,W),zs(P,!0);const me=Rf(P),de=P.subTree;P.subTree=me,m(de,me,h(de.el),ce(de),P,N,Z),K.el=me.el,J===null&&af(P,me.el),R&&Kn(R,N),(oe=K.props&&K.props.onVnodeUpdated)&&Kn(()=>Ui(oe,M,K,W),N)}else{let K;const{el:_e,props:R}=O,{bm:M,m:W,parent:J,root:oe,type:me}=P,de=co(O);if(zs(P,!1),M&&Mf(M),!de&&(K=R&&R.onVnodeBeforeMount)&&Ui(K,J,O),zs(P,!0),_e&&ke){const re=()=>{P.subTree=Rf(P),ke(_e,P.subTree,P,N,null)};de&&me.__asyncHydrate?me.__asyncHydrate(_e,P,re):re()}else{oe.ce&&oe.ce._hasShadowRoot()&&oe.ce._injectChildStyle(me,P.parent?P.parent.type:void 0);const re=P.subTree=Rf(P);m(null,re,q,$,P,N,Z),O.el=re.el}if(W&&Kn(W,N),!de&&(K=R&&R.onVnodeMounted)){const re=O;Kn(()=>Ui(K,J,re),N)}(O.shapeFlag&256||J&&co(J.vnode)&&J.vnode.shapeFlag&256)&&P.a&&Kn(P.a,N),P.isMounted=!0,O=q=$=null}};P.scope.on();const se=P.effect=new I0(I);P.scope.off();const ne=P.update=se.run.bind(se),xe=P.job=se.runIfDirty.bind(se);xe.i=P,xe.id=P.uid,se.scheduler=()=>Pp(xe),zs(P,!0),ne()},U=(P,O,q)=>{O.component=P;const $=P.vnode.props;P.vnode=O,P.next=null,hb(P,O.props,$,q),_b(P,O.children,q),qr(),$m(P),Yr()},G=(P,O,q,$,N,Z,fe,I,se=!1)=>{const ne=P&&P.children,xe=P?P.shapeFlag:0,K=O.children,{patchFlag:_e,shapeFlag:R}=O;if(_e>0){if(_e&128){F(ne,K,q,$,N,Z,fe,I,se);return}else if(_e&256){ee(ne,K,q,$,N,Z,fe,I,se);return}}R&8?(xe&16&&Y(ne,N,Z),K!==ne&&u(q,K)):xe&16?R&16?F(ne,K,q,$,N,Z,fe,I,se):Y(ne,N,Z,!0):(xe&8&&u(q,""),R&16&&S(K,q,$,N,Z,fe,I,se))},ee=(P,O,q,$,N,Z,fe,I,se)=>{P=P||sa,O=O||sa;const ne=P.length,xe=O.length,K=Math.min(ne,xe);let _e;for(_e=0;_e<K;_e++){const R=O[_e]=se?Ur(O[_e]):Si(O[_e]);m(P[_e],R,q,null,N,Z,fe,I,se)}ne>xe?Y(P,N,Z,!0,!1,K):S(O,q,$,N,Z,fe,I,se,K)},F=(P,O,q,$,N,Z,fe,I,se)=>{let ne=0;const xe=O.length;let K=P.length-1,_e=xe-1;for(;ne<=K&&ne<=_e;){const R=P[ne],M=O[ne]=se?Ur(O[ne]):Si(O[ne]);if(gs(R,M))m(R,M,q,null,N,Z,fe,I,se);else break;ne++}for(;ne<=K&&ne<=_e;){const R=P[K],M=O[_e]=se?Ur(O[_e]):Si(O[_e]);if(gs(R,M))m(R,M,q,null,N,Z,fe,I,se);else break;K--,_e--}if(ne>K){if(ne<=_e){const R=_e+1,M=R<xe?O[R].el:$;for(;ne<=_e;)m(null,O[ne]=se?Ur(O[ne]):Si(O[ne]),q,M,N,Z,fe,I,se),ne++}}else if(ne>_e)for(;ne<=K;)Te(P[ne],N,Z,!0),ne++;else{const R=ne,M=ne,W=new Map;for(ne=M;ne<=_e;ne++){const he=O[ne]=se?Ur(O[ne]):Si(O[ne]);he.key!=null&&W.set(he.key,ne)}let J,oe=0;const me=_e-M+1;let de=!1,re=0;const le=new Array(me);for(ne=0;ne<me;ne++)le[ne]=0;for(ne=R;ne<=K;ne++){const he=P[ne];if(oe>=me){Te(he,N,Z,!0);continue}let pe;if(he.key!=null)pe=W.get(he.key);else for(J=M;J<=_e;J++)if(le[J-M]===0&&gs(he,O[J])){pe=J;break}pe===void 0?Te(he,N,Z,!0):(le[pe-M]=ne+1,pe>=re?re=pe:de=!0,m(he,O[pe],q,null,N,Z,fe,I,se),oe++)}const Ee=de?xb(le):sa;for(J=Ee.length-1,ne=me-1;ne>=0;ne--){const he=M+ne,pe=O[he],ye=O[he+1],Re=he+1<xe?ye.el||Cv(ye):$;le[ne]===0?m(null,pe,q,Re,N,Z,fe,I,se):de&&(J<0||ne!==Ee[J]?ve(pe,q,Re,2):J--)}}},ve=(P,O,q,$,N=null)=>{const{el:Z,type:fe,transition:I,children:se,shapeFlag:ne}=P;if(ne&6){ve(P.component.subTree,O,q,$);return}if(ne&128){P.suspense.move(O,q,$);return}if(ne&64){fe.move(P,O,q,Fe);return}if(fe===ln){i(Z,O,q);for(let K=0;K<se.length;K++)ve(se[K],O,q,$);i(P.anchor,O,q);return}if(fe===dl){v(P,O,q);return}if($!==2&&ne&1&&I)if($===0)I.beforeEnter(Z),i(Z,O,q),Kn(()=>I.enter(Z),N);else{const{leave:K,delayLeave:_e,afterLeave:R}=I,M=()=>{P.ctx.isUnmounted?r(Z):i(Z,O,q)},W=()=>{Z._isLeaving&&Z[UM](!0),K(Z,()=>{M(),R&&R()})};_e?_e(Z,M,W):W()}else i(Z,O,q)},Te=(P,O,q,$=!1,N=!1)=>{const{type:Z,props:fe,ref:I,children:se,dynamicChildren:ne,shapeFlag:xe,patchFlag:K,dirs:_e,cacheIndex:R,memo:M}=P;if(K===-2&&(N=!1),I!=null&&(qr(),la(I,null,q,P,!0),Yr()),R!=null&&(O.renderCache[R]=void 0),xe&256){O.ctx.deactivate(P);return}const W=xe&1&&_e,J=!co(P);let oe;if(J&&(oe=fe&&fe.onVnodeBeforeUnmount)&&Ui(oe,O,P),xe&6)Oe(P.component,q,$);else{if(xe&128){P.suspense.unmount(q,$);return}W&&or(P,null,O,"beforeUnmount"),xe&64?P.type.remove(P,O,q,Fe,$):ne&&!ne.hasOnce&&(Z!==ln||K>0&&K&64)?Y(ne,O,q,!1,!0):(Z===ln&&K&384||!N&&xe&16)&&Y(se,O,q),$&&$e(P)}const me=M!=null&&R==null;(J&&(oe=fe&&fe.onVnodeUnmounted)||W||me)&&Kn(()=>{oe&&Ui(oe,O,P),W&&or(P,null,O,"unmounted"),me&&(P.el=null)},q)},$e=P=>{const{type:O,el:q,anchor:$,transition:N}=P;if(O===ln){Ge(q,$);return}if(O===dl){x(P);return}const Z=()=>{r(q),N&&!N.persisted&&N.afterLeave&&N.afterLeave()};if(P.shapeFlag&1&&N&&!N.persisted){const{leave:fe,delayLeave:I}=N,se=()=>fe(q,Z);I?I(P.el,Z,se):se()}else Z()},Ge=(P,O)=>{let q;for(;P!==O;)q=f(P),r(P),P=q;r(O)},Oe=(P,O,q)=>{const{bum:$,scope:N,job:Z,subTree:fe,um:I,m:se,a:ne}=P;r_(se),r_(ne),$&&Mf($),N.stop(),Z&&(Z.flags|=8,Te(fe,P,O,q)),I&&Kn(I,O),Kn(()=>{P.isUnmounted=!0},O)},Y=(P,O,q,$=!1,N=!1,Z=0)=>{for(let fe=Z;fe<P.length;fe++)Te(P[fe],O,q,$,N)},ce=P=>{if(P.shapeFlag&6)return ce(P.component.subTree);if(P.shapeFlag&128)return P.suspense.next();const O=f(P.anchor||P.el),q=O&&O[IM];return q?f(q):O};let ue=!1;const Ce=(P,O,q)=>{let $;P==null?O._vnode&&(Te(O._vnode,null,null,!0),$=O._vnode.component):m(O._vnode||null,P,O,null,null,null,q),O._vnode=P,ue||(ue=!0,$m($),gu(),ue=!1)},Fe={p:m,um:Te,m:ve,r:$e,mt:z,mc:S,pc:G,pbc:A,n:ce,o:n};let Le,ke;return e&&([Le,ke]=e(Fe)),{render:Ce,hydrate:Le,createApp:ib(Ce,Le)}}function Cf({type:n,props:e},t){return t==="svg"&&n==="foreignObject"||t==="mathml"&&n==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:t}function zs({effect:n,job:e},t){t?(n.flags|=32,e.flags|=4):(n.flags&=-33,e.flags&=-5)}function wv(n,e){return(!n||n&&!n.pendingBranch)&&e&&!e.persisted}function Av(n,e,t=!1){const i=n.children,r=e.children;if(Ke(i)&&Ke(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=Ur(r[s]),a.el=o.el),!t&&a.patchFlag!==-2&&Av(o,a)),a.type===fo&&(a.patchFlag===-1&&(a=r[s]=Ur(a)),a.el=o.el),a.type===Mr&&!a.el&&(a.el=o.el)}}function xb(n){const e=n.slice(),t=[0];let i,r,s,o,a;const l=n.length;for(i=0;i<l;i++){const c=n[i];if(c!==0){if(r=t[t.length-1],n[r]<c){e[i]=r,t.push(i);continue}for(s=0,o=t.length-1;s<o;)a=s+o>>1,n[t[a]]<c?s=a+1:o=a;c<n[t[s]]&&(s>0&&(e[i]=t[s-1]),t[s]=i)}}for(s=t.length,o=t[s-1];s-- >0;)t[s]=o,o=e[o];return t}function Rv(n){const e=n.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Rv(e)}function r_(n){if(n)for(let e=0;e<n.length;e++)n[e].flags|=8}function Cv(n){if(n.placeholder)return n.placeholder;const e=n.component;return e?Cv(e.subTree):null}const Pv=n=>n.__isSuspense;let zh=0;const yb={name:"Suspense",__isSuspense:!0,process(n,e,t,i,r,s,o,a,l,c){if(n==null)Mb(e,t,i,r,s,o,a,l,c);else{if(s&&s.deps>0&&!n.suspense.isInFallback){e.suspense=n.suspense,e.suspense.vnode=e,e.el=n.el;return}bb(n,e,t,i,r,o,a,l,c)}},hydrate:Eb,normalize:Tb},Sb=yb;function Ll(n,e){const t=n.props&&n.props[e];et(t)&&t()}function Mb(n,e,t,i,r,s,o,a,l){const{p:c,o:{createElement:u}}=l,h=u("div"),f=n.suspense=Dv(n,r,i,e,h,t,s,o,a,l);c(null,f.pendingBranch=n.ssContent,h,null,i,f,s,o),f.deps>0?(Ll(n,"onPending"),Ll(n,"onFallback"),c(null,n.ssFallback,e,t,i,null,s,o),ca(f,n.ssFallback)):f.resolve(!1,!0)}function bb(n,e,t,i,r,s,o,a,{p:l,um:c,o:{createElement:u}}){const h=e.suspense=n.suspense;h.vnode=e,e.el=n.el;const f=e.ssContent,d=e.ssFallback,{activeBranch:p,pendingBranch:m,isInFallback:_,isHydrating:g}=h;if(m)h.pendingBranch=f,gs(m,f)?(l(m,f,h.hiddenContainer,null,r,h,s,o,a),h.deps<=0?h.resolve():_&&(g||(l(p,d,t,i,r,null,s,o,a),ca(h,d)))):(h.pendingId=zh++,g?(h.isHydrating=!1,h.activeBranch=m):c(m,r,h),h.deps=0,h.effects.length=0,h.hiddenContainer=u("div"),_?(l(null,f,h.hiddenContainer,null,r,h,s,o,a),h.deps<=0?h.resolve():(l(p,d,t,i,r,null,s,o,a),ca(h,d))):p&&gs(p,f)?(l(p,f,t,i,r,h,s,o,a),h.resolve(!0)):(l(null,f,h.hiddenContainer,null,r,h,s,o,a),h.deps<=0&&h.resolve()));else if(p&&gs(p,f))l(p,f,t,i,r,h,s,o,a),ca(h,f);else if(Ll(e,"onPending"),h.pendingBranch=f,f.shapeFlag&512?h.pendingId=f.component.suspenseId:h.pendingId=zh++,l(null,f,h.hiddenContainer,null,r,h,s,o,a),h.deps<=0)h.resolve();else{const{timeout:y,pendingId:v}=h;y>0?setTimeout(()=>{h.pendingId===v&&h.fallback(d)},y):y===0&&h.fallback(d)}}function Dv(n,e,t,i,r,s,o,a,l,c,u=!1){const{p:h,m:f,um:d,n:p,o:{parentNode:m,remove:_}}=c;let g;const y=wb(n);y&&e&&e.pendingBranch&&(g=e.pendingId,e.deps++);const v=n.props?FS(n.props.timeout):void 0,x=s,b={vnode:n,parent:e,parentComponent:t,namespace:o,container:i,hiddenContainer:r,deps:0,pendingId:zh++,timeout:typeof v=="number"?v:-1,activeBranch:null,isFallbackMountPending:!1,pendingBranch:null,isInFallback:!u,isHydrating:u,isUnmounted:!1,effects:[],resolve(T=!1,w=!1){const{vnode:S,activeBranch:E,pendingBranch:A,pendingId:D,effects:L,parentComponent:H,container:z,isInFallback:k}=b;let B=!1;if(b.isHydrating)b.isHydrating=!1;else if(!T){B=E&&A.transition&&A.transition.mode==="out-in";let ee=!1;B&&(E.transition.afterLeave=()=>{D===b.pendingId&&(f(A,z,s===x&&!ee?p(E):s,0),Fh(L),k&&S.ssFallback&&(S.ssFallback.el=null))}),E&&!b.isFallbackMountPending&&(m(E.el)===z&&(s=p(E),ee=!0),d(E,H,b,!0),!B&&k&&S.ssFallback&&Kn(()=>S.ssFallback.el=null,b)),B||f(A,z,s,0)}b.isFallbackMountPending=!1,ca(b,A),b.pendingBranch=null,b.isInFallback=!1;let U=b.parent,G=!1;for(;U;){if(U.pendingBranch){U.effects.push(...L),G=!0;break}U=U.parent}!G&&!B&&Fh(L),b.effects=[],y&&e&&e.pendingBranch&&g===e.pendingId&&(e.deps--,e.deps===0&&!w&&e.resolve()),Ll(S,"onResolve")},fallback(T){if(!b.pendingBranch)return;const{vnode:w,activeBranch:S,parentComponent:E,container:A,namespace:D}=b;Ll(w,"onFallback");const L=p(S),H=()=>{b.isFallbackMountPending=!1,b.isInFallback&&(h(null,T,A,L,E,null,D,a,l),ca(b,T))},z=T.transition&&T.transition.mode==="out-in";z&&(b.isFallbackMountPending=!0,S.transition.afterLeave=H),b.isInFallback=!0,d(S,E,null,!0),z||H()},move(T,w,S){b.activeBranch&&f(b.activeBranch,T,w,S),b.container=T},next(){return b.activeBranch&&p(b.activeBranch)},registerDep(T,w,S){const E=!!b.pendingBranch;E&&b.deps++;const A=T.vnode.el;T.asyncDep.catch(D=>{Ua(D,T,0)}).then(D=>{if(T.isUnmounted||b.isUnmounted||b.pendingId!==T.suspenseId)return;Gh(),T.asyncResolved=!0;const{vnode:L}=T;Wh(T,D),A&&(L.el=A);const H=!A&&T.subTree.el;w(T,L,m(A||T.subTree.el),A?null:p(T.subTree),b,o,S),H&&(L.placeholder=null,_(H)),af(T,L.el),E&&--b.deps===0&&b.resolve()})},unmount(T,w){b.isUnmounted=!0,b.activeBranch&&d(b.activeBranch,t,T,w),b.pendingBranch&&d(b.pendingBranch,t,T,w)}};return b}function Eb(n,e,t,i,r,s,o,a,l){const c=e.suspense=Dv(e,i,t,n.parentNode,document.createElement("div"),null,r,s,o,a,!0),u=l(n,c.pendingBranch=e.ssContent,t,c,s,o);return c.deps===0&&c.resolve(!1,!0),u}function Tb(n){const{shapeFlag:e,children:t}=n,i=e&32;n.ssContent=s_(i?t.default:t),n.ssFallback=i?s_(t.fallback):Nt(Mr)}function s_(n){let e;if(et(n)){const t=Sa&&n._c;t&&(n._d=!1,wt()),n=n(),t&&(n._d=!0,e=oi,Iv())}return Ke(n)&&(n=ab(n)),n=Si(n),e&&!n.dynamicChildren&&(n.dynamicChildren=e.filter(t=>t!==n)),n}function Lv(n,e){e&&e.pendingBranch?Ke(n)?e.effects.push(...n):e.effects.push(n):Fh(n)}function ca(n,e){n.activeBranch=e;const{vnode:t,parentComponent:i}=n;let r=e.el;for(;!r&&e.component;)e=e.component.subTree,r=e.el;t.el=r,i&&i.subTree===t&&(i.vnode.el=r,af(i,r))}function wb(n){const e=n.props&&n.props.suspensible;return e!=null&&e!==!1}const ln=Symbol.for("v-fgt"),fo=Symbol.for("v-txt"),Mr=Symbol.for("v-cmt"),dl=Symbol.for("v-stc"),pl=[];let oi=null;function wt(n=!1){pl.push(oi=n?null:[])}function Iv(){pl.pop(),oi=pl[pl.length-1]||null}let Sa=1;function Mu(n,e=!1){Sa+=n,n<0&&oi&&e&&(oi.hasOnce=!0)}function Nv(n){return n.dynamicChildren=Sa>0?oi||sa:null,Iv(),Sa>0&&oi&&oi.push(n),n}function cn(n,e,t,i,r,s){return Nv(un(n,e,t,i,r,s,!0))}function _s(n,e,t,i,r){return Nv(Nt(n,e,t,i,r,!0))}function Ma(n){return n?n.__v_isVNode===!0:!1}function gs(n,e){return n.type===e.type&&n.key===e.key}const Uv=({key:n})=>n??null,Kc=({ref:n,ref_key:e,ref_for:t})=>(typeof n=="number"&&(n=""+n),n!=null?kt(n)||en(n)||et(n)?{i:ni,r:n,k:e,f:!!t}:n:null);function un(n,e=null,t=null,i=0,r=null,s=n===ln?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:n,props:e,key:e&&Uv(e),ref:e&&Kc(e),scopeId:J0,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:ni};return a?(Op(l,t),s&128&&n.normalize(l)):t&&(l.shapeFlag|=kt(t)?8:16),Sa>0&&!o&&oi&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&oi.push(l),l}const Nt=Ab;function Ab(n,e=null,t=null,i=0,r=null,s=!1){if((!n||n===av)&&(n=Mr),Ma(n)){const a=Vr(n,e,!0);return t&&Op(a,t),Sa>0&&!s&&oi&&(a.shapeFlag&6?oi[oi.indexOf(n)]=a:oi.push(a)),a.patchFlag=-2,a}if(Bb(n)&&(n=n.__vccOpts),e){e=Fv(e);let{class:a,style:l}=e;a&&!kt(a)&&(e.class=Zu(a)),bt(l)&&(ef(l)&&!Ke(l)&&(l=Tn({},l)),e.style=jl(l))}const o=kt(n)?1:Pv(n)?128:NM(n)?64:bt(n)?4:et(n)?2:0;return un(n,e,t,i,r,o,s,!0)}function Fv(n){return n?ef(n)||xv(n)?Tn({},n):n:null}function Vr(n,e,t=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=n,c=e?Cb(r||{},e):r,u={__v_isVNode:!0,__v_skip:!0,type:n.type,props:c,key:c&&Uv(c),ref:e&&e.ref?t&&s?Ke(s)?s.concat(Kc(e)):[s,Kc(e)]:Kc(e):s,scopeId:n.scopeId,slotScopeIds:n.slotScopeIds,children:a,target:n.target,targetStart:n.targetStart,targetAnchor:n.targetAnchor,staticCount:n.staticCount,shapeFlag:n.shapeFlag,patchFlag:e&&n.type!==ln?o===-1?16:o|16:o,dynamicProps:n.dynamicProps,dynamicChildren:n.dynamicChildren,appContext:n.appContext,dirs:n.dirs,transition:l,component:n.component,suspense:n.suspense,ssContent:n.ssContent&&Vr(n.ssContent),ssFallback:n.ssFallback&&Vr(n.ssFallback),placeholder:n.placeholder,el:n.el,anchor:n.anchor,ctx:n.ctx,ce:n.ce};return l&&i&&Lp(u,l.clone(u)),u}function ua(n=" ",e=0){return Nt(fo,null,n,e)}function Rb(n,e){const t=Nt(dl,null,n);return t.staticCount=e,t}function Si(n){return n==null||typeof n=="boolean"?Nt(Mr):Ke(n)?Nt(ln,null,n.slice()):Ma(n)?Ur(n):Nt(fo,null,String(n))}function Ur(n){return n.el===null&&n.patchFlag!==-1||n.memo?n:Vr(n)}function Op(n,e){let t=0;const{shapeFlag:i}=n;if(e==null)e=null;else if(Ke(e))t=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),Op(n,r()),r._c&&(r._d=!0));return}else{t=32;const r=e._;!r&&!xv(e)?e._ctx=ni:r===3&&ni&&(ni.slots._===1?e._=1:(e._=2,n.patchFlag|=1024))}else et(e)?(e={default:e,_ctx:ni},t=32):(e=String(e),i&64?(t=16,e=[ua(e)]):t=8);n.children=e,n.shapeFlag|=t}function Cb(...n){const e={};for(let t=0;t<n.length;t++){const i=n[t];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=Zu([e.class,i.class]));else if(r==="style")e.style=jl([e.style,i.style]);else if(ql(r)){const s=e[r],o=i[r];o&&s!==o&&!(Ke(s)&&s.includes(o))?e[r]=s?[].concat(s,o):o:o==null&&s==null&&!$u(r)&&(e[r]=o)}else r!==""&&(e[r]=i[r])}return e}function Ui(n,e,t,i=null){Sr(n,e,7,[t,i])}const Pb=dv();let Db=0;function Lb(n,e,t){const i=n.type,r=(e?e.appContext:n.appContext)||Pb,s={uid:Db++,vnode:n,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new L0(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Sv(i,r),emitsOptions:mv(i,r),emit:null,emitted:null,propsDefaults:yt,inheritAttrs:i.inheritAttrs,ctx:yt,data:yt,props:yt,attrs:yt,slots:yt,refs:yt,setupState:yt,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=sb.bind(null,s),n.ce&&n.ce(s),s}let Rn=null;const Fa=()=>Rn||ni;let bu,Vh;{const n=Ku(),e=(t,i)=>{let r;return(r=n[t])||(r=n[t]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};bu=e("__VUE_INSTANCE_SETTERS__",t=>Rn=t),Vh=e("__VUE_SSR_SETTERS__",t=>ba=t)}const Zl=n=>{const e=Rn;return bu(n),n.scope.on(),()=>{n.scope.off(),bu(e)}},Gh=()=>{Rn&&Rn.scope.off(),bu(null)};function Ov(n){return n.vnode.shapeFlag&4}let ba=!1;function Ib(n,e=!1,t=!1){e&&Vh(e);const{props:i,children:r}=n.vnode,s=Ov(n);fb(n,i,s,e),mb(n,r,t||e);const o=s?Nb(n,e):void 0;return e&&Vh(!1),o}function Nb(n,e){const t=n.type;n.accessCache=Object.create(null),n.proxy=new Proxy(n.ctx,jM);const{setup:i}=t;if(i){qr();const r=n.setupContext=i.length>1?Fb(n):null,s=Zl(n),o=Kl(i,n,0,[n.props,r]),a=Mp(o);if(Yr(),s(),(a||n.sp)&&!co(n)&&Ip(n),a){if(o.then(Gh,Gh),e)return o.then(l=>{Wh(n,l)}).catch(l=>{Ua(l,n,0)});n.asyncDep=o}else Wh(n,o)}else Bv(n)}function Wh(n,e,t){et(e)?n.type.__ssrInlineRender?n.ssrRender=e:n.render=e:bt(e)&&(n.setupState=Y0(e)),Bv(n)}function Bv(n,e,t){const i=n.type;n.render||(n.render=i.render||_r);{const r=Zl(n);qr();try{ZM(n)}finally{Yr(),r()}}}const Ub={get(n,e){return Hn(n,"get",""),n[e]}};function Fb(n){const e=t=>{n.exposed=t||{}};return{attrs:new Proxy(n.attrs,Ub),slots:n.slots,emit:n.emit,expose:e}}function Bp(n){return n.exposed?n.exposeProxy||(n.exposeProxy=new Proxy(Y0(hM(n.exposed)),{get(e,t){if(t in e)return e[t];if(t in hl)return hl[t](n)},has(e,t){return t in e||t in hl}})):n.proxy}function Ob(n,e=!0){return et(n)?n.displayName||n.name:n.name||e&&n.__name}function Bb(n){return et(n)&&"__vccOpts"in n}const lf=(n,e)=>bM(n,e,ba);function As(n,e,t){try{Mu(-1);const i=arguments.length;return i===2?bt(e)&&!Ke(e)?Ma(e)?Nt(n,null,[e]):Nt(n,e):Nt(n,null,e):(i>3?t=Array.prototype.slice.call(arguments,2):i===3&&Ma(t)&&(t=[t]),Nt(n,e,t))}finally{Mu(1)}}const kb="3.5.34";let Xh;const o_=typeof window<"u"&&window.trustedTypes;if(o_)try{Xh=o_.createPolicy("vue",{createHTML:n=>n})}catch{}const kv=Xh?n=>Xh.createHTML(n):n=>n,Hb="http://www.w3.org/2000/svg",zb="http://www.w3.org/1998/Math/MathML",Ir=typeof document<"u"?document:null,a_=Ir&&Ir.createElement("template"),Vb={insert:(n,e,t)=>{e.insertBefore(n,t||null)},remove:n=>{const e=n.parentNode;e&&e.removeChild(n)},createElement:(n,e,t,i)=>{const r=e==="svg"?Ir.createElementNS(Hb,n):e==="mathml"?Ir.createElementNS(zb,n):t?Ir.createElement(n,{is:t}):Ir.createElement(n);return n==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:n=>Ir.createTextNode(n),createComment:n=>Ir.createComment(n),setText:(n,e)=>{n.nodeValue=e},setElementText:(n,e)=>{n.textContent=e},parentNode:n=>n.parentNode,nextSibling:n=>n.nextSibling,querySelector:n=>Ir.querySelector(n),setScopeId(n,e){n.setAttribute(e,"")},insertStaticContent(n,e,t,i,r,s){const o=t?t.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),t),!(r===s||!(r=r.nextSibling)););else{a_.innerHTML=kv(i==="svg"?`<svg>${n}</svg>`:i==="mathml"?`<math>${n}</math>`:n);const a=a_.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,t)}return[o?o.nextSibling:e.firstChild,t?t.previousSibling:e.lastChild]}},Gb=Symbol("_vtc");function Wb(n,e,t){const i=n[Gb];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?n.removeAttribute("class"):t?n.setAttribute("class",e):n.className=e}const l_=Symbol("_vod"),Xb=Symbol("_vsh"),$b=Symbol(""),qb=/(?:^|;)\s*display\s*:/;function Yb(n,e,t){const i=n.style,r=kt(t);let s=!1;if(t&&!r){if(e)if(kt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();t[a]==null&&el(i,a,"")}else for(const o in e)t[o]==null&&el(i,o,"");for(const o in t){o==="display"&&(s=!0);const a=t[o];a!=null?Kb(n,o,!kt(e)&&e?e[o]:void 0,a)||el(i,o,a):el(i,o,"")}}else if(r){if(e!==t){const o=i[$b];o&&(t+=";"+o),i.cssText=t,s=qb.test(t)}}else e&&n.removeAttribute("style");l_ in n&&(n[l_]=s?i.display:"",n[Xb]&&(i.display="none"))}const c_=/\s*!important$/;function el(n,e,t){if(Ke(t))t.forEach(i=>el(n,e,i));else if(t==null&&(t=""),e.startsWith("--"))n.setProperty(e,t);else{const i=jb(n,e);c_.test(t)?n.setProperty(Os(i),t.replace(c_,""),"important"):n[i]=t}}const u_=["Webkit","Moz","ms"],Pf={};function jb(n,e){const t=Pf[e];if(t)return t;let i=Gn(e);if(i!=="filter"&&i in n)return Pf[e]=i;i=ju(i);for(let r=0;r<u_.length;r++){const s=u_[r]+i;if(s in n)return Pf[e]=s}return e}function Kb(n,e,t,i){return n.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&kt(i)&&t===i}const f_="http://www.w3.org/1999/xlink";function h_(n,e,t,i,r,s=GS(e)){i&&e.startsWith("xlink:")?t==null?n.removeAttributeNS(f_,e.slice(6,e.length)):n.setAttributeNS(f_,e,t):t==null||s&&!C0(t)?n.removeAttribute(e):n.setAttribute(e,s?"":Ci(t)?String(t):t)}function d_(n,e,t,i,r){if(e==="innerHTML"||e==="textContent"){t!=null&&(n[e]=e==="innerHTML"?kv(t):t);return}const s=n.tagName;if(e==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?n.getAttribute("value")||"":n.value,l=t==null?n.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in n))&&(n.value=l),t==null&&n.removeAttribute(e),n._value=t;return}let o=!1;if(t===""||t==null){const a=typeof n[e];a==="boolean"?t=C0(t):t==null&&a==="string"?(t="",o=!0):a==="number"&&(t=0,o=!0)}try{n[e]=t}catch{}o&&n.removeAttribute(r||e)}function Zb(n,e,t,i){n.addEventListener(e,t,i)}function Jb(n,e,t,i){n.removeEventListener(e,t,i)}const p_=Symbol("_vei");function Qb(n,e,t,i,r=null){const s=n[p_]||(n[p_]={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=eE(e);if(i){const c=s[e]=iE(i,r);Zb(n,a,c,l)}else o&&(Jb(n,a,o,l),s[e]=void 0)}}const m_=/(?:Once|Passive|Capture)$/;function eE(n){let e;if(m_.test(n)){e={};let i;for(;i=n.match(m_);)n=n.slice(0,n.length-i[0].length),e[i[0].toLowerCase()]=!0}return[n[2]===":"?n.slice(3):Os(n.slice(2)),e]}let Df=0;const tE=Promise.resolve(),nE=()=>Df||(tE.then(()=>Df=0),Df=Date.now());function iE(n,e){const t=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=t.attached)return;Sr(rE(i,t.value),e,5,[i])};return t.value=n,t.attached=nE(),t}function rE(n,e){if(Ke(e)){const t=n.stopImmediatePropagation;return n.stopImmediatePropagation=()=>{t.call(n),n._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const __=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&n.charCodeAt(2)>96&&n.charCodeAt(2)<123,sE=(n,e,t,i,r,s)=>{const o=r==="svg";e==="class"?Wb(n,i,o):e==="style"?Yb(n,t,i):ql(e)?$u(e)||Qb(n,e,t,i,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):oE(n,e,i,o))?(d_(n,e,i),!n.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&h_(n,e,i,o,s,e!=="value")):n._isVueCE&&(aE(n,e)||n._def.__asyncLoader&&(/[A-Z]/.test(e)||!kt(i)))?d_(n,Gn(e),i,s,e):(e==="true-value"?n._trueValue=i:e==="false-value"&&(n._falseValue=i),h_(n,e,i,o))};function oE(n,e,t,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in n&&__(e)&&et(t));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&n.tagName==="IFRAME"||e==="form"||e==="list"&&n.tagName==="INPUT"||e==="type"&&n.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=n.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return __(e)&&kt(t)?!1:e in n}function aE(n,e){const t=n._def.props;if(!t)return!1;const i=Gn(e);return Array.isArray(t)?t.some(r=>Gn(r)===i):Object.keys(t).some(r=>Gn(r)===i)}const Hv=Tn({patchProp:sE},Vb);let ml,g_=!1;function lE(){return ml||(ml=gb(Hv))}function cE(){return ml=g_?ml:vb(Hv),g_=!0,ml}const uE=((...n)=>{const e=lE().createApp(...n),{mount:t}=e;return e.mount=i=>{const r=Vv(i);if(!r)return;const s=e._component;!et(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=t(r,!1,zv(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e}),fE=((...n)=>{const e=cE().createApp(...n),{mount:t}=e;return e.mount=i=>{const r=Vv(i);if(r)return t(r,!0,zv(r))},e});function zv(n){if(n instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&n instanceof MathMLElement)return"mathml"}function Vv(n){return kt(n)?document.querySelector(n):n}const hE=/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,dE=/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,pE=/^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;function mE(n,e){if(n==="__proto__"||n==="constructor"&&e&&typeof e=="object"&&"prototype"in e){_E(n);return}return e}function _E(n){console.warn(`[destr] Dropping "${n}" key to prevent prototype pollution.`)}function gE(n,e={}){if(typeof n!="string")return n;if(n[0]==='"'&&n[n.length-1]==='"'&&n.indexOf("\\")===-1)return n.slice(1,-1);const t=n.trim();if(t.length<=9)switch(t.toLowerCase()){case"true":return!0;case"false":return!1;case"undefined":return;case"null":return null;case"nan":return Number.NaN;case"infinity":return Number.POSITIVE_INFINITY;case"-infinity":return Number.NEGATIVE_INFINITY}if(!pE.test(n)){if(e.strict)throw new SyntaxError("[destr] Invalid JSON");return n}try{if(hE.test(n)||dE.test(n)){if(e.strict)throw new Error("[destr] Possible prototype pollution");return JSON.parse(n,mE)}return JSON.parse(n)}catch(i){if(e.strict)throw i;return n}}const Gv=/#/g,Wv=/&/g,vE=/\//g,xE=/=/g,yE=/\?/g,cf=/\+/g,SE=/%5e/gi,ME=/%60/gi,bE=/%7c/gi,EE=/%20/gi,TE=/%2f/gi,wE=/%252f/gi;function Xv(n){return encodeURI(""+n).replace(bE,"|")}function $h(n){return Xv(typeof n=="string"?n:JSON.stringify(n)).replace(cf,"%2B").replace(EE,"+").replace(Gv,"%23").replace(Wv,"%26").replace(ME,"`").replace(SE,"^").replace(vE,"%2F")}function Lf(n){return $h(n).replace(xE,"%3D")}function AE(n){return Xv(n).replace(Gv,"%23").replace(yE,"%3F").replace(wE,"%2F").replace(Wv,"%26").replace(cf,"%2B")}function Il(n=""){try{return decodeURIComponent(""+n)}catch{return""+n}}function RE(n){return Il(n.replace(TE,"%252F"))}function CE(n){return Il(n.replace(cf," "))}function PE(n){return Il(n.replace(cf," "))}function kp(n=""){const e=Object.create(null);n[0]==="?"&&(n=n.slice(1));for(const t of n.split("&")){const i=t.match(/([^=]+)=?(.*)/)||[];if(i.length<2)continue;const r=CE(i[1]);if(r==="__proto__"||r==="constructor")continue;const s=PE(i[2]||"");e[r]===void 0?e[r]=s:Array.isArray(e[r])?e[r].push(s):e[r]=[e[r],s]}return e}function DE(n,e){return(typeof e=="number"||typeof e=="boolean")&&(e=String(e)),e?Array.isArray(e)?e.map(t=>`${Lf(n)}=${$h(t)}`).join("&"):`${Lf(n)}=${$h(e)}`:Lf(n)}function $v(n){return Object.keys(n).filter(e=>n[e]!==void 0).map(e=>DE(e,n[e])).filter(Boolean).join("&")}const LE=/^[\s\w\0+.-]{2,}:([/\\]{1,2})/,IE=/^[\s\w\0+.-]{2,}:([/\\]{2})?/,NE=/^([/\\]\s*){2,}[^/\\]/,UE=/^[\s\0]*(blob|data|javascript|vbscript):$/i,FE=/\/$|\/\?|\/#/,OE=/^\.?\//;function Oa(n,e={}){return typeof e=="boolean"&&(e={acceptRelative:e}),e.strict?LE.test(n):IE.test(n)||(e.acceptRelative?NE.test(n):!1)}function BE(n){return!!n&&UE.test(n)}function qh(n="",e){return e?FE.test(n):n.endsWith("/")}function qv(n="",e){if(!e)return(qh(n)?n.slice(0,-1):n)||"/";if(!qh(n,!0))return n||"/";let t=n,i="";const r=n.indexOf("#");r!==-1&&(t=n.slice(0,r),i=n.slice(r));const[s,...o]=t.split("?");return((s.endsWith("/")?s.slice(0,-1):s)||"/")+(o.length>0?`?${o.join("?")}`:"")+i}function Yh(n="",e){if(!e)return n.endsWith("/")?n:n+"/";if(qh(n,!0))return n||"/";let t=n,i="";const r=n.indexOf("#");if(r!==-1&&(t=n.slice(0,r),i=n.slice(r),!t))return i;const[s,...o]=t.split("?");return s+"/"+(o.length>0?`?${o.join("?")}`:"")+i}function kE(n=""){return n.startsWith("/")}function v_(n=""){return kE(n)?n:"/"+n}function HE(n,e){if(jv(e)||Oa(n))return n;const t=qv(e);if(n.startsWith(t)){const i=n[t.length];if(!i||i==="/"||i==="?")return n}return uf(t,n)}function zE(n,e){if(jv(e))return n;const t=qv(e);if(!n.startsWith(t))return n;const i=n[t.length];return i&&i!=="/"&&i!=="?"?n:"/"+n.slice(t.length).replace(/^\/+/,"")}function Yv(n,e){const t=Hp(n),i={...kp(t.search),...e};return t.search=$v(i),Jv(t)}function jv(n){return!n||n==="/"}function VE(n){return n&&n!=="/"}function uf(n,...e){let t=n||"";for(const i of e.filter(r=>VE(r)))if(t){const r=i.replace(OE,"");t=Yh(t)+r}else t=i;return t}function Kv(...n){const e=/\/(?!\/)/,t=n.filter(Boolean),i=[];let r=0;for(const o of t)if(!(!o||o==="/")){for(const[a,l]of o.split(e).entries())if(!(!l||l===".")){if(l===".."){if(i.length===1&&Oa(i[0]))continue;i.pop(),r--;continue}if(a===1&&i[i.length-1]?.endsWith(":/")){i[i.length-1]+="/"+l;continue}i.push(l),r++}}let s=i.join("/");return r>=0?t[0]?.startsWith("/")&&!s.startsWith("/")?s="/"+s:t[0]?.startsWith("./")&&!s.startsWith("./")&&(s="./"+s):s="../".repeat(-1*r)+s,t[t.length-1]?.endsWith("/")&&!s.endsWith("/")&&(s+="/"),s}function GE(n,e,t={}){return t.trailingSlash||(n=Yh(n),e=Yh(e)),t.leadingSlash||(n=v_(n),e=v_(e)),t.encoding||(n=Il(n),e=Il(e)),n===e}const Zv=Symbol.for("ufo:protocolRelative");function Hp(n="",e){const t=n.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);if(t){const[,h,f=""]=t;return{protocol:h.toLowerCase(),pathname:f,href:h+f,auth:"",host:"",search:"",hash:""}}if(!Oa(n,{acceptRelative:!0}))return x_(n);const[,i="",r,s=""]=n.replace(/\\/g,"/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/)||[];let[,o="",a=""]=s.match(/([^#/?]*)(.*)?/)||[];i==="file:"&&(a=a.replace(/\/(?=[A-Za-z]:)/,""));const{pathname:l,search:c,hash:u}=x_(a);return{protocol:i.toLowerCase(),auth:r?r.slice(0,Math.max(0,r.length-1)):"",host:o,pathname:l,search:c,hash:u,[Zv]:!i}}function x_(n=""){const[e="",t="",i=""]=(n.match(/([^#?]*)(\?[^#]*)?(#.*)?/)||[]).splice(1);return{pathname:e,search:t,hash:i}}function Jv(n){const e=n.pathname||"",t=n.search?(n.search.startsWith("?")?"":"?")+n.search:"",i=n.hash||"",r=n.auth?n.auth+"@":"",s=n.host||"";return(n.protocol||n[Zv]?(n.protocol||"")+"//":"")+r+s+e+t+i}class WE extends Error{constructor(e,t){super(e,t),this.name="FetchError",t?.cause&&!this.cause&&(this.cause=t.cause)}}function XE(n){const e=n.error?.message||n.error?.toString()||"",t=n.request?.method||n.options?.method||"GET",i=n.request?.url||String(n.request)||"/",r=`[${t}] ${JSON.stringify(i)}`,s=n.response?`${n.response.status} ${n.response.statusText}`:"<no response>",o=`${r}: ${s}${e?` ${e}`:""}`,a=new WE(o,n.error?{cause:n.error}:void 0);for(const l of["request","options","response"])Object.defineProperty(a,l,{get(){return n[l]}});for(const[l,c]of[["data","_data"],["status","status"],["statusCode","status"],["statusText","statusText"],["statusMessage","statusText"]])Object.defineProperty(a,l,{get(){return n.response&&n.response[c]}});return a}const $E=new Set(Object.freeze(["PATCH","POST","PUT","DELETE"]));function y_(n="GET"){return $E.has(n.toUpperCase())}function qE(n){if(n===void 0)return!1;const e=typeof n;return e==="string"||e==="number"||e==="boolean"||e===null?!0:e!=="object"?!1:Array.isArray(n)?!0:n.buffer||n instanceof FormData||n instanceof URLSearchParams?!1:n.constructor&&n.constructor.name==="Object"||typeof n.toJSON=="function"}const YE=new Set(["image/svg","application/xml","application/xhtml","application/html"]),jE=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function KE(n=""){if(!n)return"json";const e=n.split(";").shift()||"";return jE.test(e)?"json":e==="text/event-stream"?"stream":YE.has(e)||e.startsWith("text/")?"text":"blob"}function ZE(n,e,t,i){const r=JE(e?.headers??n?.headers,t?.headers,i);let s;return(t?.query||t?.params||e?.params||e?.query)&&(s={...t?.params,...t?.query,...e?.params,...e?.query}),{...t,...e,query:s,params:s,headers:r}}function JE(n,e,t){if(!e)return new t(n);const i=new t(e);if(n)for(const[r,s]of Symbol.iterator in n||Array.isArray(n)?n:new t(n))i.set(r,s);return i}async function cc(n,e){if(e)if(Array.isArray(e))for(const t of e)await t(n);else await e(n)}const QE=new Set([408,409,425,429,500,502,503,504]),eT=new Set([101,204,205,304]);function Qv(n={}){const{fetch:e=globalThis.fetch,Headers:t=globalThis.Headers,AbortController:i=globalThis.AbortController}=n;async function r(a){const l=a.error&&a.error.name==="AbortError"&&!a.options.timeout||!1;if(a.options.retry!==!1&&!l){let u;typeof a.options.retry=="number"?u=a.options.retry:u=y_(a.options.method)?0:1;const h=a.response&&a.response.status||500;if(u>0&&(Array.isArray(a.options.retryStatusCodes)?a.options.retryStatusCodes.includes(h):QE.has(h))){const f=typeof a.options.retryDelay=="function"?a.options.retryDelay(a):a.options.retryDelay||0;return f>0&&await new Promise(d=>setTimeout(d,f)),s(a.request,{...a.options,retry:u-1})}}const c=XE(a);throw Error.captureStackTrace&&Error.captureStackTrace(c,s),c}const s=async function(l,c={}){const u={request:l,options:ZE(l,c,n.defaults,t),response:void 0,error:void 0};if(u.options.method&&(u.options.method=u.options.method.toUpperCase()),u.options.onRequest&&(await cc(u,u.options.onRequest),u.options.headers instanceof t||(u.options.headers=new t(u.options.headers||{}))),typeof u.request=="string"&&(u.options.baseURL&&(u.request=HE(u.request,u.options.baseURL)),u.options.query&&(u.request=Yv(u.request,u.options.query),delete u.options.query),"query"in u.options&&delete u.options.query,"params"in u.options&&delete u.options.params),u.options.body&&y_(u.options.method))if(qE(u.options.body)){const d=u.options.headers.get("content-type");typeof u.options.body!="string"&&(u.options.body=d==="application/x-www-form-urlencoded"?new URLSearchParams(u.options.body).toString():JSON.stringify(u.options.body)),d||u.options.headers.set("content-type","application/json"),u.options.headers.has("accept")||u.options.headers.set("accept","application/json")}else("pipeTo"in u.options.body&&typeof u.options.body.pipeTo=="function"||typeof u.options.body.pipe=="function")&&("duplex"in u.options||(u.options.duplex="half"));let h;if(!u.options.signal&&u.options.timeout){const d=new i;h=setTimeout(()=>{const p=new Error("[TimeoutError]: The operation was aborted due to timeout");p.name="TimeoutError",p.code=23,d.abort(p)},u.options.timeout),u.options.signal=d.signal}try{u.response=await e(u.request,u.options)}catch(d){return u.error=d,u.options.onRequestError&&await cc(u,u.options.onRequestError),await r(u)}finally{h&&clearTimeout(h)}if((u.response.body||u.response._bodyInit)&&!eT.has(u.response.status)&&u.options.method!=="HEAD"){const d=(u.options.parseResponse?"json":u.options.responseType)||KE(u.response.headers.get("content-type")||"");switch(d){case"json":{const p=await u.response.text(),m=u.options.parseResponse||gE;u.response._data=m(p);break}case"stream":{u.response._data=u.response.body||u.response._bodyInit;break}default:u.response._data=await u.response[d]()}}return u.options.onResponse&&await cc(u,u.options.onResponse),!u.options.ignoreResponseError&&u.response.status>=400&&u.response.status<600?(u.options.onResponseError&&await cc(u,u.options.onResponseError),await r(u)):u.response},o=async function(l,c){return(await s(l,c))._data};return o.raw=s,o.native=(...a)=>e(...a),o.create=(a={},l={})=>Qv({...n,...l,defaults:{...n.defaults,...l.defaults,...a}}),o}const Eu=(function(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")})(),tT=Eu.fetch?(...n)=>Eu.fetch(...n):()=>Promise.reject(new Error("[ofetch] global.fetch is not supported!")),nT=Eu.Headers,iT=Eu.AbortController,rT=Qv({fetch:tT,Headers:nT,AbortController:iT}),sT=rT,oT=()=>window?.__NUXT__?.config||window?.useNuxtApp?.().payload?.config,zp=()=>oT().app,aT=()=>zp().baseURL,lT=()=>zp().buildAssetsDir,Vp=(...n)=>Kv(ex(),lT(),...n),ex=(...n)=>{const e=zp(),t=e.cdnURL||e.baseURL;return n.length?Kv(t,...n):t};globalThis.__buildAssetsURL=Vp,globalThis.__publicAssetsURL=ex;globalThis.$fetch||(globalThis.$fetch=sT.create({baseURL:aT()}));"global"in globalThis||(globalThis.global=globalThis);function jh(n,e={},t){for(const i in n){const r=n[i],s=t?`${t}:${i}`:i;typeof r=="object"&&r!==null?jh(r,e,s):typeof r=="function"&&(e[s]=r)}return e}const tx=(()=>{if(console.createTask)return console.createTask;const n={run:e=>e()};return()=>n})();function nx(n,e,t,i){for(let r=t;r<n.length;r+=1)try{const s=i?i.run(()=>n[r](...e)):n[r](...e);if(s&&typeof s.then=="function")return Promise.resolve(s).then(()=>nx(n,e,r+1,i))}catch(s){return Promise.reject(s)}}function cT(n,e,t){if(n.length>0)return nx(n,e,0,tx(t))}function uT(n,e,t){if(n.length>0){const i=tx(t);return Promise.all(n.map(r=>i.run(()=>r(...e))))}}function If(n,e){for(const t of[...n])t(e)}var fT=class{_hooks;_before;_after;_deprecatedHooks;_deprecatedMessages;constructor(){this._hooks={},this._before=void 0,this._after=void 0,this._deprecatedMessages=void 0,this._deprecatedHooks={},this.hook=this.hook.bind(this),this.callHook=this.callHook.bind(this),this.callHookWith=this.callHookWith.bind(this)}hook(n,e,t={}){if(!n||typeof e!="function")return()=>{};const i=n;let r;for(;this._deprecatedHooks[n];)r=this._deprecatedHooks[n],n=r.to;if(r&&!t.allowDeprecated){let s=r.message;s||(s=`${i} hook has been deprecated`+(r.to?`, please use ${r.to}`:"")),this._deprecatedMessages||(this._deprecatedMessages=new Set),this._deprecatedMessages.has(s)||(console.warn(s),this._deprecatedMessages.add(s))}if(!e.name)try{Object.defineProperty(e,"name",{get:()=>"_"+n.replace(/\W+/g,"_")+"_hook_cb",configurable:!0})}catch{}return this._hooks[n]=this._hooks[n]||[],this._hooks[n].push(e),()=>{e&&(this.removeHook(n,e),e=void 0)}}hookOnce(n,e){let t,i=(...r)=>(typeof t=="function"&&t(),t=void 0,i=void 0,e(...r));return t=this.hook(n,i),t}removeHook(n,e){const t=this._hooks[n];if(t){const i=t.indexOf(e);i!==-1&&t.splice(i,1),t.length===0&&(this._hooks[n]=void 0)}}clearHook(n){this._hooks[n]=void 0}deprecateHook(n,e){this._deprecatedHooks[n]=typeof e=="string"?{to:e}:e;const t=this._hooks[n]||[];this._hooks[n]=void 0;for(const i of t)this.hook(n,i)}deprecateHooks(n){for(const e in n)this.deprecateHook(e,n[e])}addHooks(n){const e=jh(n),t=Object.keys(e).map(i=>this.hook(i,e[i]));return()=>{for(const i of t)i();t.length=0}}removeHooks(n){const e=jh(n);for(const t in e)this.removeHook(t,e[t])}removeAllHooks(){this._hooks={}}callHook(n,...e){return this.callHookWith(cT,n,e)}callHookParallel(n,...e){return this.callHookWith(uT,n,e)}callHookWith(n,e,t){const i=this._before||this._after?{name:e,args:t,context:{}}:void 0;this._before&&If(this._before,i);const r=n(this._hooks[e]?[...this._hooks[e]]:[],t,e);return r instanceof Promise?r.finally(()=>{this._after&&i&&If(this._after,i)}):(this._after&&i&&If(this._after,i),r)}beforeEach(n){return this._before=this._before||[],this._before.push(n),()=>{if(this._before!==void 0){const e=this._before.indexOf(n);e!==-1&&this._before.splice(e,1)}}}afterEach(n){return this._after=this._after||[],this._after.push(n),()=>{if(this._after!==void 0){const e=this._after.indexOf(n);e!==-1&&this._after.splice(e,1)}}}};function ix(){return new fT}function hT(n={}){let e,t=!1;const i=o=>{if(e&&e!==o)throw new Error("Context conflict")};let r;if(n.asyncContext){const o=n.AsyncLocalStorage||globalThis.AsyncLocalStorage;o?r=new o:console.warn("[unctx] `AsyncLocalStorage` is not provided.")}const s=()=>{if(r){const o=r.getStore();if(o!==void 0)return o}return e};return{use:()=>{const o=s();if(o===void 0)throw new Error("Context is not available");return o},tryUse:()=>s(),set:(o,a)=>{a||i(o),e=o,t=!0},unset:()=>{e=void 0,t=!1},call:(o,a)=>{i(o),e=o;try{return r?r.run(o,a):a()}finally{t||(e=void 0)}},async callAsync(o,a){e=o;const l=()=>{e=o},c=()=>e===o?l:void 0;Kh.add(c);try{const u=r?r.run(o,a):a();return t||(e=void 0),await u}finally{Kh.delete(c)}}}}function dT(n={}){const e={};return{get(t,i={}){return e[t]||(e[t]=hT({...n,...i})),e[t]}}}const Tu=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof global<"u"?global:typeof window<"u"?window:{},S_="__unctx__",pT=Tu[S_]||(Tu[S_]=dT()),mT=(n,e={})=>pT.get(n,e),M_="__unctx_async_handlers__",Kh=Tu[M_]||(Tu[M_]=new Set);function _T(n){const e=[];for(const r of Kh){const s=r();s&&e.push(s)}const t=()=>{for(const r of e)r()};let i=n();return i&&typeof i=="object"&&"catch"in i&&(i=i.catch(r=>{throw t(),r})),[i,t]}const b_={id:"__nuxt-loader"},gT=!0,JL={componentName:"NuxtLink",prefetch:!0,prefetchOn:{visibility:!0}},vT="#__nuxt",rx="nuxt-app",E_=36e5,xT="vite:preloadError";function sx(n=rx){return mT(n,{asyncContext:!1})}const yT="__nuxt_plugin";function ST(n){let e=0;const t={_id:n.id||rx||"nuxt-app",_scope:XS(),provide:void 0,versions:{get nuxt(){return"4.4.5"},get vue(){return t.vueApp.version}},payload:Qs({...n.ssrContext?.payload||{},data:Qs({}),state:Ds({}),once:new Set,_errors:Qs({})}),static:{data:{}},runWithContext(r){return t._scope.active&&!Ep()?t._scope.run(()=>T_(t,r)):T_(t,r)},isHydrating:!0,deferHydration(){if(!t.isHydrating)return()=>{};e++;let r=!1;return()=>{if(!r&&(r=!0,e--,e===0))return t.isHydrating=!1,t.callHook("app:suspense:resolve")}},_asyncDataPromises:{},_asyncData:Qs({}),_state:Qs({}),_payloadRevivers:{},...n};{const r=window.__NUXT__;if(r)for(const s in r)switch(s){case"data":case"state":case"_errors":Object.assign(t.payload[s],r[s]);break;default:t.payload[s]=r[s]}}t.hooks=ix(),t.hook=t.hooks.hook;{const r=t.hooks.callHook;t.hooks.callHook=(s,...o)=>Promise.resolve().then(()=>r(s,...o))}t.callHook=t.hooks.callHook,t.provide=(r,s)=>{const o="$"+r;uc(t,o,s),uc(t.vueApp.config.globalProperties,o,s)},uc(t.vueApp,"$nuxt",t),uc(t.vueApp.config.globalProperties,"$nuxt",t);{window.addEventListener(xT,s=>{t.callHook("app:chunkError",{error:s.payload}),s.payload.message.includes("Unable to preload CSS")&&s.preventDefault()}),window.useNuxtApp||=wn;const r=t.hook("app:error",(...s)=>{console.error("[nuxt] error caught during app initialization",...s)});t.hook("app:mounted",r)}const i=t.payload.config;return t.provide("config",i),t}function MT(n,e){e.hooks&&n.hooks.addHooks(e.hooks)}async function bT(n,e){if(typeof e=="function"){const{provide:t}=await n.runWithContext(()=>e(n))||{};if(t&&typeof t=="object")for(const i in t)n.provide(i,t[i])}}async function ET(n,e){const t=new Set,i=[],r=[];let s,o=0;async function a(l){const c=l.dependsOn?.filter(u=>e.some(h=>h._name===u)&&!t.has(u))??[];if(c.length>0)i.push([new Set(c),l]);else{const u=bT(n,l).then(async()=>{l._name&&(t.add(l._name),await Promise.all(i.map(async([h,f])=>{h.has(l._name)&&(h.delete(l._name),h.size===0&&(o++,await a(f)))})))}).catch(h=>{if(!l.parallel&&!n.payload.error)throw h;s||=h});l.parallel?r.push(u):await u}}for(const l of e)MT(n,l);for(const l of e)await a(l);if(await Promise.all(r),o)for(let l=0;l<o;l++)await Promise.all(r);if(s)throw n.payload.error||s}function ks(n){if(typeof n=="function")return n;const e=n._name||n.name;return delete n.name,Object.assign(n.setup||(()=>{}),n,{[yT]:!0,_name:e})}function T_(n,e,t){const i=()=>e();return sx(n._id).set(n),n.vueApp.runWithContext(i)}function TT(n){let e;return tf()&&(e=Fa()?.appContext.app.$nuxt),e||=sx(n).tryUse(),e||null}function wn(n){const e=TT(n);if(!e)throw new Error("[nuxt] instance unavailable");return e}function Ea(n){return wn().$config}function uc(n,e,t){Object.defineProperty(n,e,{get:()=>t})}function Nf(n){if(n===null||typeof n!="object")return!1;const e=Object.getPrototypeOf(n);return e!==null&&e!==Object.prototype&&Object.getPrototypeOf(e)!==null||Symbol.iterator in n?!1:Symbol.toStringTag in n?Object.prototype.toString.call(n)==="[object Module]":!0}function Zh(n,e,t=".",i){if(!Nf(e))return Zh(n,{},t,i);const r={...e};for(const s of Object.keys(n)){if(s==="__proto__"||s==="constructor")continue;const o=n[s];o!=null&&(i&&i(r,s,o,t)||(Array.isArray(o)&&Array.isArray(r[s])?r[s]=[...o,...r[s]]:Nf(o)&&Nf(r[s])?r[s]=Zh(o,r[s],(t?`${t}.`:"")+s.toString(),i):r[s]=o))}return r}function wT(n){return(...e)=>e.reduce((t,i)=>Zh(t,i,"",n),{})}const AT=wT();function RT(n,e){try{return e in n}catch{return!1}}class w_ extends Error{static __h3_error__=!0;statusCode=500;fatal=!1;unhandled=!1;statusMessage;data;cause;constructor(e,t={}){super(e,t),t.cause&&!this.cause&&(this.cause=t.cause)}toJSON(){const e={message:this.message,statusCode:Jh(this.statusCode,500)};return this.statusMessage&&(e.statusMessage=ox(this.statusMessage)),this.data!==void 0&&(e.data=this.data),e}}function CT(n){if(typeof n=="string")return new w_(n);if(PT(n))return n;const e=new w_(n.message??n.statusMessage??"",{cause:n.cause||n});if(RT(n,"stack"))try{Object.defineProperty(e,"stack",{get(){return n.stack}})}catch{try{e.stack=n.stack}catch{}}if(n.data&&(e.data=n.data),n.statusCode?e.statusCode=Jh(n.statusCode,e.statusCode):n.status&&(e.statusCode=Jh(n.status,e.statusCode)),n.statusMessage?e.statusMessage=n.statusMessage:n.statusText&&(e.statusMessage=n.statusText),e.statusMessage){const t=e.statusMessage;ox(e.statusMessage)!==t&&console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.")}return n.fatal!==void 0&&(e.fatal=n.fatal),n.unhandled!==void 0&&(e.unhandled=n.unhandled),e}function PT(n){return n?.constructor?.__h3_error__===!0}const DT=/[^\u0009\u0020-\u007E]/g;function ox(n=""){return n.replace(DT,"")}function Jh(n,e=200){return!n||(typeof n=="string"&&(n=Number.parseInt(n,10)),n<100||n>999)?e:n}const ax=Symbol("route");import.meta.url.replace(/\/app\/.*$/,"/");const yo=()=>wn()?.$router,Gp=()=>tf()?lo(ax,wn()._route):wn()._route;const LT=()=>{try{if(wn()._processingMiddleware)return!0}catch{return!1}return!1},IT=(n,e)=>{n||="/";const t=typeof n=="string"?n:"path"in n?NT(n):yo().resolve(n).href;if(e?.open){const{target:c="_blank",windowFeatures:u={}}=e.open,h=[];for(const[f,d]of Object.entries(u))d!==void 0&&h.push(`${f.toLowerCase()}=${d}`);return open(t,c,h.join(", ")),Promise.resolve()}const i=Oa(t,{acceptRelative:!0}),r=e?.external||i;if(r){if(!e?.external)throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");const{protocol:c}=new URL(t,window.location.href);if(c&&BE(c))throw new Error(`Cannot navigate to a URL with '${c}' protocol.`)}const s=LT();if(!r&&s){if(e?.replace){if(typeof n=="string"){const{pathname:c,search:u,hash:h}=Hp(n);return{path:c,...u&&{query:kp(u)},...h&&{hash:h},replace:!0}}return{...n,replace:!0}}return n}const o=yo(),a=wn();if(r)return a._scope.stop(),e?.replace?location.replace(t):location.href=t,s?a.isHydrating?new Promise(()=>{}):!1:Promise.resolve();const l=typeof n=="string"?UT(n):n;return e?.replace?o.replace(l):o.push(l)};function NT(n){return Yv(n.path||"",n.query||{})+(n.hash||"")}function UT(n){const e=Hp(n);return AE(RE(e.pathname))+e.search+e.hash}const lx="__nuxt_error",Wp=()=>yM(wn().payload,"error"),FT=n=>{const e=Xp(n);try{const t=Wp();wn().hooks.callHook("app:error",e),t.value||=e}catch{throw e}return e},OT=async(n={})=>{const e=wn(),t=Wp();e.callHook("app:error:cleared",n),n.redirect&&await yo().replace(n.redirect),t.value=void 0},BT=n=>!!n&&typeof n=="object"&&lx in n,Xp=n=>{typeof n!="string"&&n.statusText&&(n.message??=n.statusText);const e=CT(n);return Object.defineProperty(e,lx,{value:!0,configurable:!1,writable:!1}),Object.defineProperty(e,"status",{get:()=>e.statusCode,configurable:!0}),Object.defineProperty(e,"statusText",{get:()=>e.statusMessage,configurable:!0}),e},kT=-1,HT=-2,zT=-3,VT=-4,GT=-5,WT=-6,XT=-7,cx=2**32-1,Qh=cx-1;function $T(n){return!(!Number.isInteger(n)||n<0||n>Qh)}function qT(n){return!(!Number.isInteger(n)||n<0||n>cx)}function YT(n){return Uint8Array.fromBase64(n).buffer}function jT(n){return Uint8Array.from(Buffer.from(n,"base64")).buffer}function KT(n){const e=atob(n),t=e.length,i=new Uint8Array(t);for(let r=0;r<t;r++)i[r]=e.charCodeAt(r);return i.buffer}const ZT=typeof Uint8Array.fromBase64=="function",JT=typeof process=="object"&&process.versions?.node!==void 0,QT=ZT?YT:JT?jT:KT;function e1(n,e){return t1(JSON.parse(n),e)}function t1(n,e){if(typeof n=="number")return s(n,!0);if(!Array.isArray(n)||n.length===0)throw new Error("Invalid input");const t=n,i=Array(t.length);let r=null;function s(o,a=!1){if(o===kT)return;if(o===zT)return NaN;if(o===VT)return 1/0;if(o===GT)return-1/0;if(o===WT)return-0;if(a||typeof o!="number")throw new Error("Invalid input");if(o in i)return i[o];const l=t[o];if(!l||typeof l!="object")i[o]=l;else if(Array.isArray(l))if(typeof l[0]=="string"){const c=l[0],u=e&&Object.hasOwn(e,c)?e[c]:void 0;if(u){let h=l[1];if(typeof h!="number"&&(h=t.push(l[1])-1),r??=new Set,r.has(h))throw new Error("Invalid circular reference");return r.add(h),i[o]=u(s(h)),r.delete(h),i[o]}switch(c){case"Date":i[o]=new Date(l[1]);break;case"Set":const h=new Set;i[o]=h;for(let p=1;p<l.length;p+=1)h.add(s(l[p]));break;case"Map":const f=new Map;i[o]=f;for(let p=1;p<l.length;p+=2)f.set(s(l[p]),s(l[p+1]));break;case"RegExp":i[o]=new RegExp(l[1],l[2]);break;case"Object":{const p=l[1];if(typeof t[p]=="object"&&t[p][0]!=="BigInt")throw new Error("Invalid input");i[o]=Object(s(p));break}case"BigInt":i[o]=BigInt(l[1]);break;case"null":const d=Object.create(null);i[o]=d;for(let p=1;p<l.length;p+=2){if(l[p]==="__proto__")throw new Error("Cannot parse an object with a `__proto__` property");d[l[p]]=s(l[p+1])}break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Float16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":case"DataView":{if(t[l[1]][0]!=="ArrayBuffer")throw new Error("Invalid data");const p=globalThis[c],m=s(l[1]);i[o]=l[2]!==void 0?new p(m,l[2],l[3]):new p(m);break}case"ArrayBuffer":{const p=l[1];if(typeof p!="string")throw new Error("Invalid ArrayBuffer encoding");const m=QT(p);i[o]=m;break}case"Temporal.Duration":case"Temporal.Instant":case"Temporal.PlainDate":case"Temporal.PlainTime":case"Temporal.PlainDateTime":case"Temporal.PlainMonthDay":case"Temporal.PlainYearMonth":case"Temporal.ZonedDateTime":{const p=c.slice(9);i[o]=Temporal[p].from(l[1]);break}case"URL":{const p=new URL(l[1]);i[o]=p;break}case"URLSearchParams":{const p=new URLSearchParams(l[1]);i[o]=p;break}default:throw new Error(`Unknown type ${c}`)}}else if(l[0]===XT){const c=l[1];if(!qT(c))throw new Error("Invalid input");const u=[];i[o]=u,u[Qh]=void 0,delete u[Qh];for(let h=2;h<l.length;h+=2){const f=l[h];if(!$T(f)||f>=c)throw new Error("Invalid input");u[f]=s(l[h+1])}u.length=c}else{const c=new Array(l.length);i[o]=c;for(let u=0;u<l.length;u+=1){const h=l[u];h!==HT&&(c[u]=s(h))}}else{const c={};i[o]=c;for(const u of Object.keys(l)){if(u==="__proto__")throw new Error("Cannot parse an object with a `__proto__` property");const h=l[u];c[u]=s(h)}}return i[o]}return s(0)}const n1=new Set(["link","style","script","noscript"]),i1=new Set(["title","titleTemplate","script","style","noscript"]),ed=new Set(["base","meta","link","style","script","noscript"]),r1=new Set(["title","base","htmlAttrs","bodyAttrs","meta","link","style","script","noscript"]),s1=new Set(["base","title","titleTemplate","bodyAttrs","htmlAttrs","templateParams"]),o1=new Set(["key","tagPosition","tagPriority","tagDuplicateStrategy","innerHTML","textContent","processTemplateParams"]),a1=new Set(["templateParams","htmlAttrs","bodyAttrs"]),$p=new Set(["theme-color","google-site-verification","og","article","book","profile","twitter","author"]),Nl={META:new Set(["twitter"]),OG:new Set(["og","book","article","profile","fb"]),MEDIA:new Set(["ogImage","ogVideo","ogAudio","twitterImage"]),HTTP_EQUIV:new Set(["contentType","defaultStyle","xUaCompatible"])},l1={articleExpirationTime:"article:expiration_time",articleModifiedTime:"article:modified_time",articlePublishedTime:"article:published_time",bookReleaseDate:"book:release_date",fbAppId:"fb:app_id",ogAudioSecureUrl:"og:audio:secure_url",ogAudioUrl:"og:audio",ogImageSecureUrl:"og:image:secure_url",ogImageUrl:"og:image",ogSiteName:"og:site_name",ogVideoSecureUrl:"og:video:secure_url",ogVideoUrl:"og:video",profileFirstName:"profile:first_name",profileLastName:"profile:last_name",profileUsername:"profile:username",msapplicationConfig:"msapplication-Config",msapplicationTileColor:"msapplication-TileColor",msapplicationTileImage:"msapplication-TileImage"},ux={appleItunesApp:{unpack:{entrySeparator:", ",resolve:({key:n,value:e})=>`${Hr(n)}=${e}`}},refresh:{metaKey:"http-equiv",unpack:{entrySeparator:";",resolve:({key:n,value:e})=>n==="seconds"?`${e}`:void 0}},robots:{unpack:{entrySeparator:", ",resolve:({key:n,value:e})=>typeof e=="boolean"?Hr(n):`${Hr(n)}:${e}`}},contentSecurityPolicy:{metaKey:"http-equiv",unpack:{entrySeparator:"; ",resolve:({key:n,value:e})=>`${Hr(n)} ${e}`}},charset:{}};function Hr(n){const e=n.replace(/([A-Z])/g,"-$1").toLowerCase(),t=e.indexOf("-");return t===-1?e:Nl.META.has(e.slice(0,t))||Nl.OG.has(e.slice(0,t))?n.replace(/([A-Z])/g,":$1").toLowerCase():e}function fx(n){return Object.fromEntries(Object.entries(n).filter(([e,t])=>String(t)!=="false"&&e))}function td(n){return Array.isArray(n)?n.map(td):!n||typeof n!="object"?n:Object.fromEntries(Object.entries(n).map(([e,t])=>[Hr(e),td(t)]))}function hx(n,e={}){const{entrySeparator:t="",keyValueSeparator:i="",wrapValue:r,resolve:s}=e;return Object.entries(n).map(([o,a])=>{if(s){const c=s({key:o,value:a});if(c!==void 0)return c}const l=typeof a=="object"?hx(a,e):typeof a=="number"?a.toString():typeof a=="string"&&r?`${r}${a.replace(new RegExp(r,"g"),`\\${r}`)}${r}`:a;return`${o}${i}${l}`}).join(t)}function A_(n,e){const t=fx(e),i=Hr(n),r=dx(i);if(!$p.has(i))return[{[r]:i,...t}];const s=Object.fromEntries(Object.entries(t).map(([o,a])=>[`${n}${o==="url"?"":`${o[0].toUpperCase()}${o.slice(1)}`}`,a]));return wu(s||{}).sort((o,a)=>(o[r]?.length||0)-(a[r]?.length||0))}function dx(n){if(ux[n]?.metaKey==="http-equiv"||Nl.HTTP_EQUIV.has(n))return"http-equiv";const e=Hr(n),t=e.indexOf(":");return t===-1?"name":Nl.OG.has(e.slice(0,t))?"property":"name"}function c1(n){return l1[n]||Hr(n)}function u1(n,e){return e==="refresh"?`${n.seconds};url=${n.url}`:hx(td(n),{keyValueSeparator:"=",entrySeparator:", ",resolve:({value:t,key:i})=>t===null?"":typeof t=="boolean"?i:void 0,...ux[e]?.unpack})}function wu(n){const e=[],t={};for(const[r,s]of Object.entries(n)){if(Array.isArray(s)){if(r==="themeColor"){s.forEach(o=>{typeof o=="object"&&o!==null&&e.push({name:"theme-color",...o})});continue}for(const o of s)if(typeof o=="object"&&o!==null){const a=[],l=[];for(const[c,u]of Object.entries(o)){const h=`${r}${c==="url"?"":`:${c}`}`,f=wu({[h]:u});(c==="url"?a:l).push(...f)}e.push(...a,...l)}else e.push(...typeof o=="string"?wu({[r]:o}):A_(r,o));continue}if(typeof s=="object"&&s)if(Nl.MEDIA.has(r)){const o=r.startsWith("twitter")?"twitter":"og",a=r.replace(/^(og|twitter)/,"").toLowerCase(),l=o==="twitter"?"name":"property";s.url&&e.push({[l]:`${o}:${a}`,content:s.url}),s.secureUrl&&e.push({[l]:`${o}:${a}:secure_url`,content:s.secureUrl});for(const[c,u]of Object.entries(s))c!=="url"&&c!=="secureUrl"&&e.push({[l]:`${o}:${a}:${c}`,content:u})}else $p.has(Hr(r))?e.push(...A_(r,s)):t[r]=fx(s);else t[r]=s}const i=Object.entries(t).map(([r,s])=>{if(r==="charset")return{charset:s===null?"_null":s};const o=dx(r),a=c1(r),l=s===null?"_null":typeof s=="object"?u1(s,r):typeof s=="number"?s.toString():s;return o==="http-equiv"?{"http-equiv":a,content:l}:{[o]:a,content:l}});return[...e,...i].map(r=>"content"in r&&r.content==="_null"?{...r,content:null}:r)}const f1={key:"flatMeta",hooks:{"entries:normalize":n=>{const e=[];n.tags=n.tags.map(t=>t.tag!=="_flatMeta"?t:(e.push(wu(t.props).map(i=>({...t,tag:"meta",props:i}))),!1)).filter(Boolean).concat(...e)}}},h1=["name","property","http-equiv"],d1=new Set(["viewport","description","keywords","robots"]);function px(n){const e=n.split(":");return e.length?$p.has(e[1]):!1}function nd(n){const{props:e,tag:t}=n;if(s1.has(t))return t;if(t==="link"&&e.rel==="canonical")return"canonical";if(t==="link"&&e.rel==="alternate"){if(e.hreflang)return`alternate:${e.hreflang}`;if(e.type)return`alternate:${e.type}:${e.href||""}`}if(e.charset)return"charset";if(n.tag==="meta"){for(const i of h1)if(e[i]!==void 0){const r=e[i],s=r&&typeof r=="string"&&r.includes(":"),o=r&&d1.has(r),l=!(s||o)&&n.key?`:key:${n.key}`:"";return`${t}:${r}${l}`}}if(n.key)return`${t}:key:${n.key}`;if(e.id)return`${t}:id:${e.id}`;if(t==="link"&&e.rel==="alternate")return`alternate:${e.href||""}`;if(i1.has(t)){const i=n.textContent||n.innerHTML;if(i)return`${t}:content:${i}`}}function mx(n){const e=n._h||n._d;if(e)return e;const t=n.textContent||n.innerHTML;return t||`${n.tag}:${Object.entries(n.props).map(([i,r])=>`${i}:${String(r)}`).join(",")}`}function Au(n,e,t){typeof n==="function"&&(!t||t!=="titleTemplate"&&!(t[0]==="o"&&t[1]==="n"))&&(n=n());const r=e?e(t,n):n;if(Array.isArray(r))return r.map(s=>Au(s,e));if(r?.constructor===Object){const s={};for(const o of Object.keys(r))s[o]=Au(r[o],e,o);return s}return r}function p1(n,e){const t=n==="style"?new Map:new Set;function i(r){if(r==null||r===void 0)return;const s=String(r).trim();if(s)if(n==="style"){const[o,...a]=s.split(":").map(l=>l?l.trim():"");o&&a.length&&t.set(o,a.join(":"))}else s.split(" ").filter(Boolean).forEach(o=>t.add(o))}return typeof e=="string"?n==="style"?e.split(";").forEach(i):i(e):Array.isArray(e)?e.forEach(r=>i(r)):e&&typeof e=="object"&&Object.entries(e).forEach(([r,s])=>{s&&s!=="false"&&(n==="style"?t.set(String(r).trim(),String(s)):i(r))}),t}function _x(n,e){if(n.props=n.props||{},!e)return n;if(n.tag==="templateParams")return n.props=e,n;const t=ed.has(n.tag)||n.tag==="htmlAttrs"||n.tag==="bodyAttrs";return Object.entries(e).forEach(([i,r])=>{if(i==="__proto__"||i==="constructor"||i==="prototype")return;if(r===null){n.props[i]=null;return}if(i==="class"||i==="style"){n.props[i]=p1(i,r);return}if(o1.has(i)){if((i==="textContent"||i==="innerHTML")&&typeof r=="object"){let c=e.type;if(e.type||(c="application/json"),!c?.endsWith("json")&&c!=="speculationrules")return;e.type=c,n.props.type=c,n[i]=JSON.stringify(r)}else n[i]=r;return}const s=i.startsWith("data-"),o=t&&!s?i.toLowerCase():i,a=String(r),l=n.tag==="meta"&&o==="content";a==="true"||a===""?n.props[o]=s||l?a:!0:!r&&s&&a==="false"?n.props[o]="false":r!==void 0&&(n.props[o]=r)}),n}function m1(n,e){const t=typeof e=="object"&&typeof e!="function"?e:{[n==="script"||n==="noscript"||n==="style"?"innerHTML":"textContent"]:e},i=_x({tag:n,props:{}},t);return i.key&&n1.has(i.tag)&&(i.props["data-hid"]=i._h=i.key),i.tag==="script"&&typeof i.innerHTML=="object"&&(i.innerHTML=JSON.stringify(i.innerHTML),i.props.type=i.props.type||"application/json"),Array.isArray(i.props.content)?i.props.content.map(r=>({...i,props:{...i.props,content:r}})):i}function _1(n,e){if(!n)return[];typeof n=="function"&&(n=n());const t=(r,s)=>{for(let o=0;o<e.length;o++)s=e[o](r,s);return s};n=t(void 0,n);const i=[];return n=Au(n,t),Object.entries(n||{}).forEach(([r,s])=>{if(s!==void 0)for(const o of Array.isArray(s)?s:[s])i.push(m1(r,o))}),i.flat()}const R_=(n,e)=>n._w===e._w?n._p-e._p:n._w-e._w,C_={base:-10,title:10},g1={critical:-8,high:-1,low:2},P_={meta:{"content-security-policy":-30,charset:-20,viewport:-15},link:{preconnect:20,stylesheet:60,preload:70,modulepreload:70,prefetch:90,"dns-prefetch":90,prerender:90},script:{async:30,defer:80,sync:50},style:{imported:40,sync:60}},v1=/@import/,Va=n=>n===""||n===!0;function x1(n,e){if(typeof e.tagPriority=="number")return e.tagPriority;let t=100;const i=g1[e.tagPriority]||0,r=n.resolvedOptions.disableCapoSorting?{link:{},script:{},style:{}}:P_;if(e.tag in C_)t=C_[e.tag];else if(e.tag==="meta"){const s=e.props["http-equiv"]==="content-security-policy"?"content-security-policy":e.props.charset?"charset":e.props.name==="viewport"?"viewport":null;s&&(t=P_.meta[s])}else if(e.tag==="link"&&e.props.rel)t=r.link[e.props.rel];else if(e.tag==="script"){const s=String(e.props.type);Va(e.props.async)?t=r.script.async:e.props.src&&!Va(e.props.defer)&&!Va(e.props.async)&&s!=="module"&&!s.endsWith("json")||e.innerHTML&&!s.endsWith("json")?t=r.script.sync:(Va(e.props.defer)&&e.props.src&&!Va(e.props.async)||s==="module")&&(t=r.script.defer)}else e.tag==="style"&&(t=e.innerHTML&&v1.test(e.innerHTML)?r.style.imported:r.style.sync);return(t||100)+i}function D_(n,e){const t=typeof e=="function"?e(n):e,i=t.key||String(n.plugins.size+1);n.plugins.get(i)||(n.plugins.set(i,t),n.hooks.addHooks(t.hooks||{}))}function y1(n={}){const e=ix();e.addHooks(n.hooks||{});const t=!n.document,i=new Map,r=new Map,s=new Set,o={_entryCount:1,plugins:r,dirty:!1,resolvedOptions:n,hooks:e,ssr:t,entries:i,headEntries(){return[...i.values()]},use:a=>D_(o,a),push(a,l){const c={...l||{}};delete c.head;const u=c._index??o._entryCount++,h={_i:u,input:a,options:c},f={_poll(d=!1){o.dirty=!0,!d&&s.add(u),e.callHook("entries:updated",o)},dispose(){i.delete(u)&&o.invalidate()},patch(d){(!c.mode||c.mode==="server"&&t||c.mode==="client"&&!t)&&(h.input=d,i.set(u,h),f._poll())}};return f.patch(a),f},async resolveTags(){const a={tagMap:new Map,tags:[],entries:[...o.entries.values()]};for(await e.callHook("entries:resolve",a);s.size;){const f=s.values().next().value;s.delete(f);const d=i.get(f);if(d){const p={tags:_1(d.input,n.propResolvers||[]).map(m=>Object.assign(m,d.options)),entry:d};await e.callHook("entries:normalize",p),d._tags=p.tags.map((m,_)=>(m._w=x1(o,m),m._p=(d._i<<10)+_,m._d=nd(m),m._d||(m._h=mx(m)),m))}}let l=!1;a.entries.flatMap(f=>(f._tags||[]).map(d=>({...d,props:{...d.props}}))).sort(R_).reduce((f,d)=>{const p=d._d||d._h;if(!f.has(p))return f.set(p,d);const m=f.get(p);if((d?.tagDuplicateStrategy||(a1.has(d.tag)?"merge":null)||(d.key&&d.key===m.key?"merge":null))==="merge"){const g={...m.props};Object.entries(d.props).forEach(([y,v])=>g[y]=y==="style"?new Map([...m.props.style||new Map,...v]):y==="class"?new Set([...m.props.class||new Set,...v]):v),f.set(p,{...d,props:g})}else d._p>>10===m._p>>10&&d.tag==="meta"&&px(p)?(f.set(p,Object.assign([...Array.isArray(m)?m:[m],d],d)),l=!0):(d._w===m._w?d._p>m._p:d?._w<m?._w)&&f.set(p,d);return f},a.tagMap);const c=a.tagMap.get("title"),u=a.tagMap.get("titleTemplate");if(o._title=c?.textContent,u){const f=u?.textContent;if(o._titleTemplate=f,f){let d=typeof f=="function"?f(c?.textContent):f;typeof d=="string"&&!o.plugins.has("template-params")&&(d=d.replace("%s",c?.textContent||"")),c?d===null?a.tagMap.delete("title"):a.tagMap.set("title",{...c,textContent:d}):(u.tag="title",u.textContent=d)}}a.tags=Array.from(a.tagMap.values()),l&&(a.tags=a.tags.flat().sort(R_)),await e.callHook("tags:beforeResolve",a),await e.callHook("tags:resolve",a),await e.callHook("tags:afterResolve",a);const h=[];for(const f of a.tags){const{innerHTML:d,tag:p,props:m}=f;if(r1.has(p)&&!(Object.keys(m).length===0&&!f.innerHTML&&!f.textContent)&&!(p==="meta"&&!m.content&&!m["http-equiv"]&&!m.charset)){if(p==="script"&&d){if(String(m.type).endsWith("json")){const _=typeof d=="string"?d:JSON.stringify(d);f.innerHTML=_.replace(/</g,"\\u003C")}else typeof d=="string"&&(f.innerHTML=d.replace(new RegExp(`</${p}`,"g"),`<\\/${p}`));f._d=nd(f)}h.push(f)}}return h},invalidate(){for(const a of i.values())s.add(a._i);o.dirty=!0,e.callHook("entries:updated",o)}};return(n?.plugins||[]).forEach(a=>D_(o,a)),o.hooks.callHook("init",o),n.init?.forEach(a=>a&&o.push(a)),o}const S1=(n,e)=>en(e)?pM(e):e,qp="usehead";function M1(n){return{install(t){t.config.globalProperties.$unhead=n,t.config.globalProperties.$head=n,t.provide(qp,n)}}.install}function gx(){if(tf()){const n=lo(qp);if(n)return n}throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.")}function vx(n,e={}){const t=e.head||gx();return t.ssr?t.push(n||{},e):b1(t,n,e)}function b1(n,e,t={}){const i=At(!1);let r;return PM(()=>{const o=i.value?{}:Au(e,S1);r?r.patch(o):r=n.push(o,t)}),Fa()&&(Bs(()=>{r.dispose()}),nv(()=>{i.value=!0}),tv(()=>{i.value=!1})),r}function E1(n={},e={}){(e.head||gx()).use(f1);const{title:i,titleTemplate:r,...s}=n;return vx({title:i,titleTemplate:r,_flatMeta:s},e)}function Yp(n){const e=n||wn();return e.ssrContext?.head||e.runWithContext(()=>{if(tf()){const t=lo(qp);if(!t)throw new Error("[nuxt] [unhead] Missing Unhead instance.");return t}})}function QL(n,e={}){const t=e.head||Yp(e.nuxt);return vx(n,{head:t,...e})}function T1(n,e={}){const t=e.head||Yp(e.nuxt);return E1(n,{head:t,...e})}const w1=(n,e)=>[],A1=n=>AT({},...w1().map(e=>e.data).reverse()),R1=A1;let Zc;function C1(){let n;return n=$fetch(Vp(`builds/meta/${Ea().app.buildId}.json`),{responseType:"json"}),Zc=n,n.catch(e=>{Zc===n&&(Zc=void 0),console.error("[nuxt] Error fetching app manifest.",e)}),n}function jp(){return Zc||C1()}function ff(n){const e=typeof n=="string"?n:n.path;try{return R1(e)}catch(t){return console.error("[nuxt] Error matching route rules.",t),{}}}async function L_(n,e={}){if(await L1(n)){const t=await D1(n,e);return await xx(t)||null}return null}const P1="_payload.json";async function D1(n,e={}){const t=new URL(n,"http://localhost");if(t.host!=="localhost"||Oa(t.pathname,{acceptRelative:!0}))throw new Error("Payload URL must not include hostname: "+n);const i=Ea(),r=e.hash||(e.fresh?Date.now():i.app.buildId),s=i.app.cdnURL,o=s&&await I1(n)?s:i.app.baseURL;return uf(o,t.pathname,P1+(r?`?${r}`:""))}async function xx(n){try{if(gT){const e=await fetch(n,{cache:"force-cache"});return e.ok?await Mx(await e.text()):null}}catch(e){console.warn("[nuxt] Cannot load payload ",n,e)}return null}function yx(n){if(n.redirect)return!1;if(n.prerender)return!0}async function Sx(n){return n=n==="/"?n:n.replace(/\/$/,""),(await jp()).prerendered.includes(n)}async function L1(n=Gp().path){const e=ff({path:n});if(e.ssr===!1)return!1;const t=yx(e);return t!==void 0?t:e.payload?!0:await Sx(n)}async function I1(n=Gp().path){const e=yx(ff({path:n}));return e!==void 0?e:await Sx(n)}let Vs=null;async function N1(){if(Vs)return Vs;const n=document.getElementById("__NUXT_DATA__");if(!n)return{};const e=await Mx(n.textContent||""),t=n.dataset.src?await xx(n.dataset.src):void 0;return Vs={...e,...t,...window.__NUXT__},Vs.config?.public&&(Vs.config.public=Ds(Vs.config.public)),Vs}async function Mx(n){return await e1(n,wn()._payloadRevivers)}function U1(n,e){wn()._payloadRevivers[n]=e}function I_(n){try{return JSON.parse(n)}catch{return n}}const F1=[["NuxtError",n=>Xp(n)],["EmptyShallowRef",n=>Pl(n==="_"?void 0:n==="0n"?BigInt(0):I_(n))],["EmptyRef",n=>At(n==="_"?void 0:n==="0n"?BigInt(0):I_(n))],["ShallowRef",n=>Pl(n)],["ShallowReactive",n=>Qs(n)],["Ref",n=>At(n)],["Reactive",n=>Ds(n)]],O1=ks({name:"nuxt:revive-payload:client",order:-30,async setup(n){let e,t;for(const[i,r]of F1)U1(i,r);Object.assign(n.payload,([e,t]=_T(()=>n.runWithContext(N1)),e=await e,t(),e)),delete window.__NUXT__}});async function Kp(n,e={}){const t=e.document||n.resolvedOptions.document;if(!t||!n.dirty)return;const i={shouldRender:!0,tags:[]};if(await n.hooks.callHook("dom:beforeRender",i),!!i.shouldRender)return n._domUpdatePromise||(n._domUpdatePromise=new Promise(async r=>{const s=new Map,o=new Promise(d=>{n.resolveTags().then(p=>{d(p.map(m=>{const _=s.get(m._d)||0,g={tag:m,id:(_?`${m._d}:${_}`:m._d)||m._h,shouldRender:!0};return m._d&&px(m._d)&&s.set(m._d,_+1),g}))})});let a=n._dom;if(!a){a={title:t.title,elMap:new Map().set("htmlAttrs",t.documentElement).set("bodyAttrs",t.body)};for(const d of["body","head"]){const p=t[d]?.children;for(const m of p){const _=m.tagName.toLowerCase();if(!ed.has(_))continue;const g=_x({tag:_,props:{}},{innerHTML:m.innerHTML,...m.getAttributeNames().reduce((y,v)=>(y[v]=m.getAttribute(v),y),{})||{}});if(g.key=m.getAttribute("data-hid")||void 0,g._d=nd(g)||mx(g),a.elMap.has(g._d)){let y=1,v=g._d;for(;a.elMap.has(v);)v=`${g._d}:${y++}`;a.elMap.set(v,m)}else a.elMap.set(g._d,m)}}}a.pendingSideEffects={...a.sideEffects},a.sideEffects={};function l(d,p,m){const _=`${d}:${p}`;a.sideEffects[_]=m,delete a.pendingSideEffects[_]}function c({id:d,$el:p,tag:m}){const _=m.tag.endsWith("Attrs");a.elMap.set(d,p),_||(m.textContent&&m.textContent!==p.textContent&&(p.textContent=m.textContent),m.innerHTML&&m.innerHTML!==p.innerHTML&&(p.innerHTML=m.innerHTML),l(d,"el",()=>{p?.remove(),a.elMap.delete(d)}));for(const g in m.props){if(!Object.prototype.hasOwnProperty.call(m.props,g))continue;const y=m.props[g];if(g.startsWith("on")&&typeof y=="function"){const x=p?.dataset;if(x&&x[`${g}fired`]){const b=g.slice(0,-5);y.call(p,new Event(b.substring(2)))}p.getAttribute(`data-${g}`)!==""&&((m.tag==="bodyAttrs"?t.defaultView:p).addEventListener(g.substring(2),y.bind(p)),p.setAttribute(`data-${g}`,""));continue}const v=`attr:${g}`;if(g==="class"){if(!y)continue;for(const x of y)_&&l(d,`${v}:${x}`,()=>p.classList.remove(x)),!p.classList.contains(x)&&p.classList.add(x)}else if(g==="style"){if(!y)continue;for(const[x,b]of y)l(d,`${v}:${x}`,()=>{p.style.removeProperty(x)}),p.style.setProperty(x,b)}else y!==!1&&y!==null&&(p.getAttribute(g)!==y&&p.setAttribute(g,y===!0?"":String(y)),_&&l(d,v,()=>p.removeAttribute(g)))}}const u=[],h={bodyClose:void 0,bodyOpen:void 0,head:void 0},f=await o;for(const d of f){const{tag:p,shouldRender:m,id:_}=d;if(m){if(p.tag==="title"){t.title=p.textContent,l("title","",()=>t.title=a.title);continue}d.$el=d.$el||a.elMap.get(_),d.$el?c(d):ed.has(p.tag)&&u.push(d)}}for(const d of u){const p=d.tag.tagPosition||"head";d.$el=t.createElement(d.tag.tag),c(d),h[p]=h[p]||t.createDocumentFragment(),h[p].appendChild(d.$el)}for(const d of f)await n.hooks.callHook("dom:renderTag",d,t,l);h.head&&t.head.appendChild(h.head),h.bodyOpen&&t.body.insertBefore(h.bodyOpen,t.body.firstChild),h.bodyClose&&t.body.appendChild(h.bodyClose);for(const d in a.pendingSideEffects)a.pendingSideEffects[d]();n._dom=a,await n.hooks.callHook("dom:rendered",{renders:f}),r()}).finally(()=>{n._domUpdatePromise=void 0,n.dirty=!1})),n._domUpdatePromise}function B1(n={}){const e=n.domOptions?.render||Kp;n.document=n.document||(typeof window<"u"?document:void 0);const t=n.document?.head.querySelector('script[id="unhead:payload"]')?.innerHTML||!1;return y1({...n,plugins:[...n.plugins||[],{key:"client",hooks:{"entries:updated":e}}],init:[t?JSON.parse(t):!1,...n.init||[]]})}function k1(n,e){let t=0;return()=>{const i=++t;e(()=>{t===i&&n()})}}function H1(n={}){const e=B1({domOptions:{render:k1(()=>Kp(e),t=>setTimeout(t,0))},...n});return e.install=M1(e),e}const z1={disableDefaults:!0},V1=ks({name:"nuxt:head",enforce:"pre",setup(n){const e=H1(z1);n.vueApp.use(e);{let t=!0;const i=async()=>{t=!1,await Kp(e)};e.hooks.hook("dom:beforeRender",s=>{s.shouldRender=!t}),n.hooks.hook("page:start",()=>{t=!0}),n.hooks.hook("page:finish",()=>{n.isHydrating||i()}),n.hooks.hook("app:error",i),n.hooks.hook("app:suspense:resolve",i);const r=e.push.bind(e);e.push=((s,o)=>{const a=r(s,o),l=a.dispose.bind(a);return a.dispose=()=>{const c=n["~transitionPromise"];c?c.then(l):l()},a})}}}),G1=n=>{const e=ff({path:n.path});if(e.redirect){const t=e.redirect.includes("#")?e.redirect:e.redirect+n.hash;return Oa(t,{acceptRelative:!0})?(window.location.href=t,!1):t}},W1=[G1];function Uf(n){const e=n&&typeof n=="object"?n:{};typeof n=="object"&&(n=Jv({pathname:n.path||"",search:$v(n.query||{}),hash:n.hash||""}));const t=new URL(n.toString(),window.location.href);return{path:t.pathname,fullPath:n,query:kp(t.search),hash:t.hash,params:e.params||{},name:void 0,matched:e.matched||[],redirectedFrom:void 0,meta:e.meta||{},href:n}}const X1=ks({name:"nuxt:router",enforce:"pre",setup(n){const e=zE(window.location.pathname,Ea().app.baseURL)+window.location.search+window.location.hash,t=[],i={"navigate:before":[],"resolve:before":[],"navigate:after":[],error:[]},r=(f,d)=>(i[f].push(d),()=>i[f].splice(i[f].indexOf(d),1)),s=Ea().app.baseURL,o=Ds(Uf(e));async function a(f,d){try{const p=Uf(f);for(const m of i["navigate:before"]){const _=await m(p,o);if(_===!1||_ instanceof Error)return;if(typeof _=="string"&&_.length)return await a(_,!0)}for(const m of i["resolve:before"])await m(p,o);Object.assign(o,p),window.history[d?"replaceState":"pushState"]({},"",uf(s,p.fullPath)),n.isHydrating||await n.runWithContext(OT);for(const m of i["navigate:after"])await m(p,o)}catch(p){for(const m of i.error)await m(p)}}const c={currentRoute:lf(()=>o),isReady:()=>Promise.resolve(),options:{},install:()=>Promise.resolve(),push:f=>a(f,!1),replace:f=>a(f,!0),back:()=>window.history.go(-1),go:f=>window.history.go(f),forward:()=>window.history.go(1),beforeResolve:f=>r("resolve:before",f),beforeEach:f=>r("navigate:before",f),afterEach:f=>r("navigate:after",f),onError:f=>r("error",f),resolve:Uf,addRoute:(f,d)=>{t.push(d)},getRoutes:()=>t,hasRoute:f=>t.some(d=>d.name===f),removeRoute:f=>{const d=t.findIndex(p=>p.name===f);d!==-1&&t.splice(d,1)}};n.vueApp.component("RouterLink",Tr({functional:!0,props:{to:{type:String,required:!0},custom:Boolean,replace:Boolean,activeClass:String,exactActiveClass:String,ariaCurrentValue:String},setup:(f,{slots:d})=>{const p=()=>a(f.to,f.replace);return()=>{const m=c.resolve(f.to);return f.custom?d.default?.({href:f.to,navigate:p,route:m}):As("a",{href:f.to,onClick:_=>(_.preventDefault(),p())},d)}}})),window.addEventListener("popstate",f=>{const d=f.target.location;c.replace(d.href.replace(d.origin,""))}),n._route=o,n._middleware||={global:[],named:{}};const u=n.payload.state._layout,h=n.payload.state._layoutProps;return n.hooks.hookOnce("app:created",async()=>{c.beforeEach(async(f,d)=>{f.meta=Ds(f.meta||{}),n.isHydrating&&u&&!yr(f.meta.layout)&&(f.meta.layout=u,f.meta.layoutProps=h),n._processingMiddleware=!0;{const p=new Set([...W1,...n._middleware.global]),m=ff({path:f.path});if(m.appMiddleware)for(const _ in m.appMiddleware){const g=n._middleware.named[_];g&&(m.appMiddleware[_]?p.add(g):p.delete(g))}for(const _ of p){const g=await n.runWithContext(()=>_(f,d));if(g!==!0&&(g||g===!1))return g}}}),c.afterEach(()=>{delete n._processingMiddleware}),await c.replace(e),GE(o.fullPath,e)||await n.runWithContext(()=>IT(o.fullPath))}),{provide:{route:o,router:c}}}}),N_=globalThis.requestIdleCallback||(n=>{const e=Date.now(),t={didTimeout:!1,timeRemaining:()=>Math.max(0,50-(Date.now()-e))};return setTimeout(()=>{n(t)},1)}),eI=globalThis.cancelIdleCallback||(n=>{clearTimeout(n)}),Zp=n=>{const e=wn();e.isHydrating?e.hooks.hookOnce("app:suspense:resolve",()=>{N_(()=>n())}):N_(()=>n())},$1=ks({name:"nuxt:payload",setup(n){const e=new Set;yo().beforeResolve(async(t,i)=>{if(t.path===i.path)return;const r=await L_(t.path);if(r){for(const s of e)delete n.static.data[s];for(const s in r.data)s in n.static.data||e.add(s),n.static.data[s]=r.data[s]}}),Zp(()=>{n.hooks.hook("link:prefetch",async t=>{const{hostname:i}=new URL(t,window.location.href);i===window.location.hostname&&await L_(t).catch(()=>{console.warn("[nuxt] Error preloading payload for",t)})}),navigator.connection?.effectiveType!=="slow-2g"&&setTimeout(jp,1e3)})}}),q1=ks(()=>{const n=yo();Zp(()=>{n.beforeResolve(async()=>{await new Promise(e=>{setTimeout(e,100),requestAnimationFrame(()=>{setTimeout(e,0)})})})})}),Y1=ks(n=>{let e;async function t(){let i;try{i=await jp()}catch(r){const s=r;if(!("status"in s&&(s.status===404||s.status===403)))throw s}e&&clearTimeout(e),e=setTimeout(t,E_);try{const r=await $fetch(Vp("builds/latest.json")+`?${Date.now()}`);r.id!==i?.id&&(n.hooks.callHook("app:manifest:update",r),e&&clearTimeout(e))}catch{}}Zp(()=>{e=setTimeout(t,E_)})});function j1(n={}){const e=n.path||window.location.pathname;let t={};try{t=JSON.parse(sessionStorage.getItem("nuxt:reload")||"{}")}catch{}if(n.force||t?.path!==e||t?.expires<Date.now()){try{sessionStorage.setItem("nuxt:reload",JSON.stringify({path:e,expires:Date.now()+(n.ttl??1e4)}))}catch{}if(n.persistState)try{sessionStorage.setItem("nuxt:reload:state",JSON.stringify({state:wn().payload.state}))}catch{}window.location.pathname!==e?window.location.href=e:window.location.reload()}}const K1=ks({name:"nuxt:chunk-reload",setup(n){const e=yo(),t=Ea(),i=new Set;e.beforeEach(()=>{i.clear()}),n.hook("app:chunkError",({error:s})=>{i.add(s)});function r(s){const o=uf(t.app.baseURL,s.fullPath);j1({path:o,persistState:!0})}n.hook("app:manifest:update",()=>{e.beforeResolve(r)}),e.onError((s,o)=>{i.has(s)&&r(o)})}}),Z1=ks({name:"nuxt:global-components"}),J1=[O1,V1,X1,$1,q1,Y1,K1,Z1];function Q1(n,e=!1){if(n){if(n.nodeName==="#comment"&&n.nodeValue==="[")return bx(n,[],e);if(e){const t=n.cloneNode(!0);return t.querySelectorAll("[data-island-slot]").forEach(i=>{i.innerHTML=""}),[t.outerHTML]}return[n.outerHTML]}}function bx(n,e=[],t=!1){if(n&&n.nodeName){if(nw(n))return e;if(!tw(n)){const i=n.cloneNode(!0);t&&i.querySelectorAll?.("[data-island-slot]").forEach(r=>{r.innerHTML=""}),e.push(i.outerHTML)}bx(n.nextSibling,e,t)}return e}function ew(n,e){const t=n?Q1(n):[e];return t?Rb(t.join(""),t.length):As("div")}function tw(n){return n.nodeName==="#comment"&&n.nodeValue==="["}function nw(n){return n.nodeName==="#comment"&&n.nodeValue==="]"}const iw="<div></div>";function rw(n){return n.nodeName==="#comment"&&n.nodeValue==="placeholder"}function Ff(n){return n&&!rw(n)?ew(n,iw):As("div")}const Of=new WeakMap;function sw(n){if(Of.has(n))return Of.get(n);const e={...n};if(e.render)e.render=(t,i,r,s,o,a)=>{if(s.mounted$??t.mounted$){const l=n.render?.bind(t)(t,i,r,s,o,a);return l.children===null||typeof l.children=="string"?Vr(l):As(l)}return Ff(t._.vnode.el)};else{const t="<div></div>";e.template&&=`
      <template v-if="mounted$">${n.template}</template>
      <template v-else>${t}</template>
    `}return e.setup=(t,i)=>{const r=wn(),s=Pl(r.isHydrating===!1),o=Fa();if(r.isHydrating){const l={...o.attrs},c=ow(o);for(const u in l)delete o.attrs[u];jr(()=>{Object.assign(o.attrs,l),o.vnode.dirs=c})}jr(()=>{s.value=!0});const a=n.setup?.(t,i)||{};return Mp(a)?Promise.resolve(a).then(l=>typeof l!="function"?(l||={},l.mounted$=s,l):(...c)=>{if(s.value||!r.isHydrating){const u=l(...c);return u.children===null||typeof u.children=="string"?Vr(u):As(u)}return Ff(o?.vnode.el)}):typeof a=="function"?(...l)=>{if(s.value){const c=a(...l),u=e.inheritAttrs!==!1?i.attrs:void 0;return c.children===null||typeof c.children=="string"?Vr(c,u):As(c,u)}return Ff(o?.vnode.el)}:Object.assign(a,{mounted$:s})},Of.set(n,e),e}function ow(n){if(!n||!n.vnode.dirs)return null;const e=n.vnode.dirs;return n.vnode.dirs=null,e}function aw(n={}){const e=Pl(""),t=Pl(n.politeness||"polite"),i=Yp();function r(c="",u="polite"){e.value=c,t.value=u}function s(c){r(c,"polite")}function o(c){r(c,"assertive")}function a(){r(document?.title?.trim(),t.value)}function l(){i?.hooks?.removeHook("dom:rendered",a)}return a(),i?.hooks?.hook("dom:rendered",a),{_cleanup:l,message:e,politeness:t,set:r,polite:s,assertive:o}}function lw(n={}){const e=wn(),t=e._routeAnnouncer||=aw(n);return n.politeness&&n.politeness!==t.politeness.value&&(t.politeness.value=n.politeness),Ep()&&(e._routeAnnouncerDeps||=0,e._routeAnnouncerDeps++,$S(()=>{e._routeAnnouncerDeps--,e._routeAnnouncerDeps===0&&(t._cleanup(),delete e._routeAnnouncer)})),t}const cw=Tr({name:"NuxtRouteAnnouncer",props:{atomic:{type:Boolean,default:!1},politeness:{type:String,default:"polite"}},setup(n,{slots:e,expose:t}){const{set:i,polite:r,assertive:s,message:o,politeness:a}=lw({politeness:n.politeness}),l=lf(()=>{if(a.value==="assertive")return"alert";if(a.value!=="off")return"status"});return t({set:i,polite:r,assertive:s,message:o,politeness:a}),()=>As("span",{class:"nuxt-route-announcer",style:{position:"absolute"}},As("span",{role:l.value,"aria-live":a.value,"aria-atomic":n.atomic,style:{border:"0",clip:"rect(0 0 0 0)","clip-path":"inset(50%)",height:"1px",width:"1px",overflow:"hidden",position:"absolute","white-space":"nowrap","word-wrap":"normal",margin:"-1px",padding:"0"}},e.default?e.default({message:o.value}):o.value))}}),uw={class:"grid"},fw=Tr({__name:"LoadingHero",props:{duration:{type:Number,default:3.2},tileSize:{type:Number,default:92},orangeRatio:{type:Number,default:.04},blue:{type:String,default:"#9FD6FF"},orange:{type:String,default:"#FF7F00"},white:{type:String,default:"#ffffff"},textColor:{type:String,default:"#686868"},startDelay:{type:Number,default:.2},finalOrangeDelay:{type:Number,default:.35}},emits:["done"],setup(n,{emit:e}){const t=n,i=e,r=At(null),s=At(null),o=At([]),a=At(0),l=At(0);let c=0,u=[],h=[],f=0,d=-1,p=0,m=!1;const _=E=>E<.5?2*E*E:1-(-2*E+2)**2/2,g=(E,A)=>{let D=Math.ceil(E/A);return D%2===0&&(D+=1),Math.max(3,D)},y=()=>{const E=r.value?.clientWidth||window.innerWidth,A=r.value?.clientHeight||window.innerHeight,D=t.tileSize,L=g(E,D),H=g(A,D);a.value=L,l.value=L*H,c=Math.floor(H/2)*L+Math.floor(L/2),r.value&&(r.value.style.setProperty("--cols",String(L)),r.value.style.setProperty("--tile",`${D}px`))},v=E=>{const A=Array.from({length:E},(L,H)=>H);for(let L=E-1;L>0;L--){const H=Math.floor(Math.random()*(L+1));[A[L],A[H]]=[A[H],A[L]]}const D=A.indexOf(c);[A[0],A[D]]=[A[D],A[0]],u=new Array(E);for(let L=0;L<E;L++)u[A[L]]=L;h=new Array(E).fill(-1)},x=(E,A)=>{const D=o.value[E];!D||h[E]===A||(h[E]=A,D.style.backgroundColor=A===2?t.white:A===1?t.orange:t.blue)},b=()=>{m=!0;const E=l.value;for(let A=0;A<E;A++)x(A,2);s.value&&(s.value.style.opacity="0"),i("done"),window.setTimeout(()=>{x(c,1)},t.finalOrangeDelay*1e3)},T=E=>{d<0&&(d=E);const A=Math.min((E-d)/1e3,.05);d=E,p+=A;const D=l.value,L=Math.max(1,Math.round(D*t.orangeRatio)),H=p-t.startDelay;if(H<=0){f=requestAnimationFrame(T);return}const z=Math.min(H/t.duration,1),k=_(z),B=Math.floor(k*D);for(let U=0;U<D;U++){const G=u[U],ee=G<B?2:G<B+L?1:0;x(U,ee)}if(s.value&&(s.value.textContent=`${Math.round(k*100)}%`),z>=1){m||b();return}f=requestAnimationFrame(T)},w=()=>{v(l.value),d=-1,p=0,m=!1,s.value&&(s.value.style.opacity="1"),cancelAnimationFrame(f),f=requestAnimationFrame(T)},S=()=>{m||(y(),_u(()=>w()))};return jr(()=>{s.value&&(s.value.style.color=t.textColor),y(),_u(()=>w()),window.addEventListener("resize",S)}),Bs(()=>{cancelAnimationFrame(f),window.removeEventListener("resize",S)}),(E,A)=>(wt(),cn("div",{ref_key:"rootRef",ref:r,class:"loader","aria-label":"載入中",role:"img"},[un("div",uw,[(wt(!0),cn(ln,null,sf(pt(l),D=>(wt(),cn("div",{key:D,ref_for:!0,ref_key:"tileRefs",ref:o,class:"tile"}))),128))]),un("div",{ref_key:"counterRef",ref:s,class:"counter"},"0%",512)],512))}}),Ba=(n,e)=>{const t=n.__vccOpts||n;for(const[i,r]of e)t[i]=r;return t},hw=Object.assign(Ba(fw,[["__scopeId","data-v-837fdbfe"]]),{__name:"LoadingHero"});function Nr(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function Ex(n,e){n.prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e}var Ri={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Ul={duration:.5,overwrite:!1,delay:0},Jp,Dn,Vt,Vi=1e8,It=1/Vi,id=Math.PI*2,dw=id/4,pw=0,Tx=Math.sqrt,mw=Math.cos,_w=Math.sin,An=function(e){return typeof e=="string"},qt=function(e){return typeof e=="function"},Kr=function(e){return typeof e=="number"},Qp=function(e){return typeof e>"u"},br=function(e){return typeof e=="object"},ai=function(e){return e!==!1},em=function(){return typeof window<"u"},fc=function(e){return qt(e)||An(e)},wx=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Wn=Array.isArray,gw=/random\([^)]+\)/g,vw=/,\s*/g,U_=/(?:-?\.?\d|\.)+/gi,Ax=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,na=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Bf=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Rx=/[+-]=-?[.\d]+/,xw=/[^,'"\[\]\s]+/gi,yw=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Wt,ar,rd,tm,Pi={},Ru={},Cx,Px=function(e){return(Ru=Ta(e,Pi))&&di},nm=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},Fl=function(e,t){return!t&&console.warn(e)},Dx=function(e,t){return e&&(Pi[e]=t)&&Ru&&(Ru[e]=t)||Pi},Ol=function(){return 0},Sw={suppressEvents:!0,isStart:!0,kill:!1},Jc={suppressEvents:!0,kill:!1},Mw={suppressEvents:!0},im={},Rs=[],sd={},Lx,yi={},kf={},F_=30,Qc=[],rm="",sm=function(e){var t=e[0],i,r;if(br(t)||qt(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(r=Qc.length;r--&&!Qc[r].targetTest(t););i=Qc[r]}for(r=e.length;r--;)e[r]&&(e[r]._gsap||(e[r]._gsap=new ey(e[r],i)))||e.splice(r,1);return e},ho=function(e){return e._gsap||sm(Gi(e))[0]._gsap},Ix=function(e,t,i){return(i=e[t])&&qt(i)?e[t]():Qp(i)&&e.getAttribute&&e.getAttribute(t)||i},li=function(e,t){return(e=e.split(",")).forEach(t)||e},Zt=function(e){return Math.round(e*1e5)/1e5||0},Gt=function(e){return Math.round(e*1e7)/1e7||0},fa=function(e,t){var i=t.charAt(0),r=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+r:i==="-"?e-r:i==="*"?e*r:e/r},bw=function(e,t){for(var i=t.length,r=0;e.indexOf(t[r])<0&&++r<i;);return r<i},Cu=function(){var e=Rs.length,t=Rs.slice(0),i,r;for(sd={},Rs.length=0,i=0;i<e;i++)r=t[i],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},om=function(e){return!!(e._initted||e._startAt||e.add)},Nx=function(e,t,i,r){Rs.length&&!Dn&&Cu(),e.render(t,i,!!(Dn&&t<0&&om(e))),Rs.length&&!Dn&&Cu()},Ux=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(xw).length<2?t:An(e)?e.trim():e},Fx=function(e){return e},Di=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},Ew=function(e){return function(t,i){for(var r in i)r in t||r==="duration"&&e||r==="ease"||(t[r]=i[r])}},Ta=function(e,t){for(var i in t)e[i]=t[i];return e},O_=function n(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=br(t[i])?n(e[i]||(e[i]={}),t[i]):t[i]);return e},Pu=function(e,t){var i={},r;for(r in e)r in t||(i[r]=e[r]);return i},_l=function(e){var t=e.parent||Wt,i=e.keyframes?Ew(Wn(e.keyframes)):Di;if(ai(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},Tw=function(e,t){for(var i=e.length,r=i===t.length;r&&i--&&e[i]===t[i];);return i<0},Ox=function(e,t,i,r,s){var o=e[r],a;if(s)for(a=t[s];o&&o[s]>a;)o=o._prev;return o?(t._next=o._next,o._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[r]=t,t._prev=o,t.parent=t._dp=e,t},hf=function(e,t,i,r){i===void 0&&(i="_first"),r===void 0&&(r="_last");var s=t._prev,o=t._next;s?s._next=o:e[i]===t&&(e[i]=o),o?o._prev=s:e[r]===t&&(e[r]=s),t._next=t._prev=t.parent=null},Ls=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},po=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},ww=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},od=function(e,t,i,r){return e._startAt&&(Dn?e._startAt.revert(Jc):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,r))},Aw=function n(e){return!e||e._ts&&n(e.parent)},B_=function(e){return e._repeat?wa(e._tTime,e=e.duration()+e._rDelay)*e:0},wa=function(e,t){var i=Math.floor(e=Gt(e/t));return e&&i===e?i-1:i},Du=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},df=function(e){return e._end=Gt(e._start+(e._tDur/Math.abs(e._ts||e._rts||It)||0))},pf=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=Gt(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),df(e),i._dirty||po(i,e)),e},Bx=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=Du(e.rawTime(),t),(!t._dur||Jl(0,t.totalDuration(),i)-t._tTime>It)&&t.render(i,!0)),po(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-It}},fr=function(e,t,i,r){return t.parent&&Ls(t),t._start=Gt((Kr(i)?i:i||e!==Wt?Fi(e,i,t):e._time)+t._delay),t._end=Gt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Ox(e,t,"_first","_last",e._sort?"_start":0),ad(t)||(e._recent=t),r||Bx(e,t),e._ts<0&&pf(e,e._tTime),e},kx=function(e,t){return(Pi.ScrollTrigger||nm("scrollTrigger",t))&&Pi.ScrollTrigger.create(t,e)},Hx=function(e,t,i,r,s){if(lm(e,t,s),!e._initted)return 1;if(!i&&e._pt&&!Dn&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Lx!==bi.frame)return Rs.push(e),e._lazy=[s,r],1},Rw=function n(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||n(t))},ad=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Cw=function(e,t,i,r){var s=e.ratio,o=t<0||!t&&(!e._start&&Rw(e)&&!(!e._initted&&ad(e))||(e._ts<0||e._dp._ts<0)&&!ad(e))?0:1,a=e._rDelay,l=0,c,u,h;if(a&&e._repeat&&(l=Jl(0,e._tDur,t),u=wa(l,a),e._yoyo&&u&1&&(o=1-o),u!==wa(e._tTime,a)&&(s=1-o,e.vars.repeatRefresh&&e._initted&&e.invalidate())),o!==s||Dn||r||e._zTime===It||!t&&e._zTime){if(!e._initted&&Hx(e,t,r,i,l))return;for(h=e._zTime,e._zTime=t||(i?It:0),i||(i=t&&!h),e.ratio=o,e._from&&(o=1-o),e._time=0,e._tTime=l,c=e._pt;c;)c.r(o,c.d),c=c._next;t<0&&od(e,t,i,!0),e._onUpdate&&!i&&Ti(e,"onUpdate"),l&&e._repeat&&!i&&e.parent&&Ti(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===o&&(o&&Ls(e,1),!i&&!Dn&&(Ti(e,o?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Pw=function(e,t,i){var r;if(i>t)for(r=e._first;r&&r._start<=i;){if(r.data==="isPause"&&r._start>t)return r;r=r._next}else for(r=e._last;r&&r._start>=i;){if(r.data==="isPause"&&r._start<t)return r;r=r._prev}},Aa=function(e,t,i,r){var s=e._repeat,o=Gt(t)||0,a=e._tTime/e._tDur;return a&&!r&&(e._time*=o/e._dur),e._dur=o,e._tDur=s?s<0?1e10:Gt(o*(s+1)+e._rDelay*s):o,a>0&&!r&&pf(e,e._tTime=e._tDur*a),e.parent&&df(e),i||po(e.parent,e),e},k_=function(e){return e instanceof si?po(e):Aa(e,e._dur)},Dw={_start:0,endTime:Ol,totalDuration:Ol},Fi=function n(e,t,i){var r=e.labels,s=e._recent||Dw,o=e.duration()>=Vi?s.endTime(!1):e._dur,a,l,c;return An(t)&&(isNaN(t)||t in r)?(l=t.charAt(0),c=t.substr(-1)==="%",a=t.indexOf("="),l==="<"||l===">"?(a>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(a<0?s:i).totalDuration()/100:1)):a<0?(t in r||(r[t]=o),r[t]):(l=parseFloat(t.charAt(a-1)+t.substr(a+1)),c&&i&&(l=l/100*(Wn(i)?i[0]:i).totalDuration()),a>1?n(e,t.substr(0,a-1),i)+l:o+l)):t==null?o:+t},gl=function(e,t,i){var r=Kr(t[1]),s=(r?2:1)+(e<2?0:1),o=t[s],a,l;if(r&&(o.duration=t[1]),o.parent=i,e){for(a=o,l=i;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=ai(l.vars.inherit)&&l.parent;o.immediateRender=ai(a.immediateRender),e<2?o.runBackwards=1:o.startAt=t[s-1]}return new an(t[0],o,t[s+1])},Hs=function(e,t){return e||e===0?t(e):t},Jl=function(e,t,i){return i<e?e:i>t?t:i},zn=function(e,t){return!An(e)||!(t=yw.exec(e))?"":t[1]},Lw=function(e,t,i){return Hs(i,function(r){return Jl(e,t,r)})},ld=[].slice,zx=function(e,t){return e&&br(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&br(e[0]))&&!e.nodeType&&e!==ar},Iw=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(r){var s;return An(r)&&!t||zx(r,1)?(s=i).push.apply(s,Gi(r)):i.push(r)})||i},Gi=function(e,t,i){return Vt&&!t&&Vt.selector?Vt.selector(e):An(e)&&!i&&(rd||!Ra())?ld.call((t||tm).querySelectorAll(e),0):Wn(e)?Iw(e,i):zx(e)?ld.call(e,0):e?[e]:[]},cd=function(e){return e=Gi(e)[0]||Fl("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return Gi(t,i.querySelectorAll?i:i===e?Fl("Invalid scope")||tm.createElement("div"):e)}},Vx=function(e){return e.sort(function(){return .5-Math.random()})},Gx=function(e){if(qt(e))return e;var t=br(e)?e:{each:e},i=mo(t.ease),r=t.from||0,s=parseFloat(t.base)||0,o={},a=r>0&&r<1,l=isNaN(r)||a,c=t.axis,u=r,h=r;return An(r)?u=h={center:.5,edges:.5,end:1}[r]||0:!a&&l&&(u=r[0],h=r[1]),function(f,d,p){var m=(p||t).length,_=o[m],g,y,v,x,b,T,w,S,E;if(!_){if(E=t.grid==="auto"?0:(t.grid||[1,Vi])[1],!E){for(w=-Vi;w<(w=p[E++].getBoundingClientRect().left)&&E<m;);E<m&&E--}for(_=o[m]=[],g=l?Math.min(E,m)*u-.5:r%E,y=E===Vi?0:l?m*h/E-.5:r/E|0,w=0,S=Vi,T=0;T<m;T++)v=T%E-g,x=y-(T/E|0),_[T]=b=c?Math.abs(c==="y"?x:v):Tx(v*v+x*x),b>w&&(w=b),b<S&&(S=b);r==="random"&&Vx(_),_.max=w-S,_.min=S,_.v=m=(parseFloat(t.amount)||parseFloat(t.each)*(E>m?m-1:c?c==="y"?m/E:E:Math.max(E,m/E))||0)*(r==="edges"?-1:1),_.b=m<0?s-m:s,_.u=zn(t.amount||t.each)||0,i=i&&m<0?$w(i):i}return m=(_[f]-_.min)/_.max||0,Gt(_.b+(i?i(m):m)*_.v)+_.u}},ud=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var r=Gt(Math.round(parseFloat(i)/e)*e*t);return(r-r%1)/t+(Kr(i)?0:zn(i))}},Wx=function(e,t){var i=Wn(e),r,s;return!i&&br(e)&&(r=i=e.radius||Vi,e.values?(e=Gi(e.values),(s=!Kr(e[0]))&&(r*=r)):e=ud(e.increment)),Hs(t,i?qt(e)?function(o){return s=e(o),Math.abs(s-o)<=r?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=Vi,u=0,h=e.length,f,d;h--;)s?(f=e[h].x-a,d=e[h].y-l,f=f*f+d*d):f=Math.abs(e[h]-a),f<c&&(c=f,u=h);return u=!r||c<=r?e[u]:o,s||u===o||Kr(o)?u:u+zn(o)}:ud(e))},Xx=function(e,t,i,r){return Hs(Wn(e)?!t:i===!0?!!(i=0):!r,function(){return Wn(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(r=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*r)/r})},Nw=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(r){return t.reduce(function(s,o){return o(s)},r)}},Uw=function(e,t){return function(i){return e(parseFloat(i))+(t||zn(i))}},Fw=function(e,t,i){return qx(e,t,0,1,i)},$x=function(e,t,i){return Hs(i,function(r){return e[~~t(r)]})},Ow=function n(e,t,i){var r=t-e;return Wn(e)?$x(e,n(0,e.length),t):Hs(i,function(s){return(r+(s-e)%r)%r+e})},Bw=function n(e,t,i){var r=t-e,s=r*2;return Wn(e)?$x(e,n(0,e.length-1),t):Hs(i,function(o){return o=(s+(o-e)%s)%s||0,e+(o>r?s-o:o)})},Bl=function(e){return e.replace(gw,function(t){var i=t.indexOf("[")+1,r=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(vw);return Xx(i?r:+r[0],i?0:+r[1],+r[2]||1e-5)})},qx=function(e,t,i,r,s){var o=t-e,a=r-i;return Hs(s,function(l){return i+((l-e)/o*a||0)})},kw=function n(e,t,i,r){var s=isNaN(e+t)?0:function(d){return(1-d)*e+d*t};if(!s){var o=An(e),a={},l,c,u,h,f;if(i===!0&&(r=1)&&(i=null),o)e={p:e},t={p:t};else if(Wn(e)&&!Wn(t)){for(u=[],h=e.length,f=h-2,c=1;c<h;c++)u.push(n(e[c-1],e[c]));h--,s=function(p){p*=h;var m=Math.min(f,~~p);return u[m](p-m)},i=t}else r||(e=Ta(Wn(e)?[]:{},e));if(!u){for(l in t)am.call(a,e,l,"get",t[l]);s=function(p){return fm(p,a)||(o?e.p:e)}}}return Hs(i,s)},H_=function(e,t,i){var r=e.labels,s=Vi,o,a,l;for(o in r)a=r[o]-t,a<0==!!i&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},Ti=function(e,t,i){var r=e.vars,s=r[t],o=Vt,a=e._ctx,l,c,u;if(s)return l=r[t+"Params"],c=r.callbackScope||e,i&&Rs.length&&Cu(),a&&(Vt=a),u=l?s.apply(c,l):s.call(c),Vt=o,u},tl=function(e){return Ls(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Dn),e.progress()<1&&Ti(e,"onInterrupt"),e},ia,Yx=[],jx=function(e){if(e)if(e=!e.name&&e.default||e,em()||e.headless){var t=e.name,i=qt(e),r=t&&!i&&e.init?function(){this._props=[]}:e,s={init:Ol,render:fm,add:am,kill:nA,modifier:tA,rawVars:0},o={targetTest:0,get:0,getSetter:um,aliases:{},register:0};if(Ra(),e!==r){if(yi[t])return;Di(r,Di(Pu(e,s),o)),Ta(r.prototype,Ta(s,Pu(e,o))),yi[r.prop=t]=r,e.targetTest&&(Qc.push(r),im[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Dx(t,r),e.register&&e.register(di,r,ci)}else Yx.push(e)},Lt=255,nl={aqua:[0,Lt,Lt],lime:[0,Lt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Lt],navy:[0,0,128],white:[Lt,Lt,Lt],olive:[128,128,0],yellow:[Lt,Lt,0],orange:[Lt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Lt,0,0],pink:[Lt,192,203],cyan:[0,Lt,Lt],transparent:[Lt,Lt,Lt,0]},Hf=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*Lt+.5|0},Kx=function(e,t,i){var r=e?Kr(e)?[e>>16,e>>8&Lt,e&Lt]:0:nl.black,s,o,a,l,c,u,h,f,d,p;if(!r){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),nl[e])r=nl[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),o=e.charAt(2),a=e.charAt(3),e="#"+s+s+o+o+a+a+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return r=parseInt(e.substr(1,6),16),[r>>16,r>>8&Lt,r&Lt,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),r=[e>>16,e>>8&Lt,e&Lt]}else if(e.substr(0,3)==="hsl"){if(r=p=e.match(U_),!t)l=+r[0]%360/360,c=+r[1]/100,u=+r[2]/100,o=u<=.5?u*(c+1):u+c-u*c,s=u*2-o,r.length>3&&(r[3]*=1),r[0]=Hf(l+1/3,s,o),r[1]=Hf(l,s,o),r[2]=Hf(l-1/3,s,o);else if(~e.indexOf("="))return r=e.match(Ax),i&&r.length<4&&(r[3]=1),r}else r=e.match(U_)||nl.transparent;r=r.map(Number)}return t&&!p&&(s=r[0]/Lt,o=r[1]/Lt,a=r[2]/Lt,h=Math.max(s,o,a),f=Math.min(s,o,a),u=(h+f)/2,h===f?l=c=0:(d=h-f,c=u>.5?d/(2-h-f):d/(h+f),l=h===s?(o-a)/d+(o<a?6:0):h===o?(a-s)/d+2:(s-o)/d+4,l*=60),r[0]=~~(l+.5),r[1]=~~(c*100+.5),r[2]=~~(u*100+.5)),i&&r.length<4&&(r[3]=1),r},Zx=function(e){var t=[],i=[],r=-1;return e.split(Cs).forEach(function(s){var o=s.match(na)||[];t.push.apply(t,o),i.push(r+=o.length+1)}),t.c=i,t},z_=function(e,t,i){var r="",s=(e+r).match(Cs),o=t?"hsla(":"rgba(",a=0,l,c,u,h;if(!s)return e;if(s=s.map(function(f){return(f=Kx(f,t,1))&&o+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),i&&(u=Zx(e),l=i.c,l.join(r)!==u.c.join(r)))for(c=e.replace(Cs,"1").split(na),h=c.length-1;a<h;a++)r+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:i).shift());if(!c)for(c=e.split(Cs),h=c.length-1;a<h;a++)r+=c[a]+s[a];return r+c[h]},Cs=(function(){var n="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in nl)n+="|"+e+"\\b";return new RegExp(n+")","gi")})(),Hw=/hsl[a]?\(/,Jx=function(e){var t=e.join(" "),i;if(Cs.lastIndex=0,Cs.test(t))return i=Hw.test(t),e[1]=z_(e[1],i),e[0]=z_(e[0],i,Zx(e[1])),!0},kl,bi=(function(){var n=Date.now,e=500,t=33,i=n(),r=i,s=1e3/240,o=s,a=[],l,c,u,h,f,d,p=function m(_){var g=n()-r,y=_===!0,v,x,b,T;if((g>e||g<0)&&(i+=g-t),r+=g,b=r-i,v=b-o,(v>0||y)&&(T=++h.frame,f=b-h.time*1e3,h.time=b=b/1e3,o+=v+(v>=s?4:s-v),x=1),y||(l=c(m)),x)for(d=0;d<a.length;d++)a[d](b,f,T,_)};return h={time:0,frame:0,tick:function(){p(!0)},deltaRatio:function(_){return f/(1e3/(_||60))},wake:function(){Cx&&(!rd&&em()&&(ar=rd=window,tm=ar.document||{},Pi.gsap=di,(ar.gsapVersions||(ar.gsapVersions=[])).push(di.version),Px(Ru||ar.GreenSockGlobals||!ar.gsap&&ar||{}),Yx.forEach(jx)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&h.sleep(),c=u||function(_){return setTimeout(_,o-h.time*1e3+1|0)},kl=1,p(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),kl=0,c=Ol},lagSmoothing:function(_,g){e=_||1/0,t=Math.min(g||33,e)},fps:function(_){s=1e3/(_||240),o=h.time*1e3+s},add:function(_,g,y){var v=g?function(x,b,T,w){_(x,b,T,w),h.remove(v)}:_;return h.remove(_),a[y?"unshift":"push"](v),Ra(),v},remove:function(_,g){~(g=a.indexOf(_))&&a.splice(g,1)&&d>=g&&d--},_listeners:a},h})(),Ra=function(){return!kl&&bi.wake()},ht={},zw=/^[\d.\-M][\d.\-,\s]/,Vw=/["']/g,Gw=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),r=i[0],s=1,o=i.length,a,l,c;s<o;s++)l=i[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),t[r]=isNaN(c)?c.replace(Vw,"").trim():+c,r=l.substr(a+1).trim();return t},Ww=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),r=e.indexOf("(",t);return e.substring(t,~r&&r<i?e.indexOf(")",i+1):i)},Xw=function(e){var t=(e+"").split("("),i=ht[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[Gw(t[1])]:Ww(e).split(",").map(Ux)):ht._CE&&zw.test(e)?ht._CE("",e):i},$w=function(e){return function(t){return 1-e(1-t)}},mo=function(e,t){return e&&(qt(e)?e:ht[e]||Xw(e))||t},Ao=function(e,t,i,r){i===void 0&&(i=function(l){return 1-t(1-l)}),r===void 0&&(r=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:i,easeInOut:r},o;return li(e,function(a){ht[a]=Pi[a]=s,ht[o=a.toLowerCase()]=i;for(var l in s)ht[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ht[a+"."+l]=s[l]}),s},Qx=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},zf=function n(e,t,i){var r=t>=1?t:1,s=(i||(e?.3:.45))/(t<1?t:1),o=s/id*(Math.asin(1/r)||0),a=function(u){return u===1?1:r*Math.pow(2,-10*u)*_w((u-o)*s)+1},l=e==="out"?a:e==="in"?function(c){return 1-a(1-c)}:Qx(a);return s=id/s,l.config=function(c,u){return n(e,c,u)},l},Vf=function n(e,t){t===void 0&&(t=1.70158);var i=function(o){return o?--o*o*((t+1)*o+t)+1:0},r=e==="out"?i:e==="in"?function(s){return 1-i(1-s)}:Qx(i);return r.config=function(s){return n(e,s)},r};li("Linear,Quad,Cubic,Quart,Quint,Strong",function(n,e){var t=e<5?e+1:e;Ao(n+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});ht.Linear.easeNone=ht.none=ht.Linear.easeIn;Ao("Elastic",zf("in"),zf("out"),zf());(function(n,e){var t=1/e,i=2*t,r=2.5*t,s=function(a){return a<t?n*a*a:a<i?n*Math.pow(a-1.5/e,2)+.75:a<r?n*(a-=2.25/e)*a+.9375:n*Math.pow(a-2.625/e,2)+.984375};Ao("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Ao("Expo",function(n){return Math.pow(2,10*(n-1))*n+n*n*n*n*n*n*(1-n)});Ao("Circ",function(n){return-(Tx(1-n*n)-1)});Ao("Sine",function(n){return n===1?1:-mw(n*dw)+1});Ao("Back",Vf("in"),Vf("out"),Vf());ht.SteppedEase=ht.steps=Pi.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,r=e+(t?0:1),s=t?1:0,o=1-It;return function(a){return((r*Jl(0,o,a)|0)+s)*i}}};Ul.ease=ht["quad.out"];li("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(n){return rm+=n+","+n+"Params,"});var ey=function(e,t){this.id=pw++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:Ix,this.set=t?t.getSetter:um},Hl=(function(){function n(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Aa(this,+t.duration,1,1),this.data=t.data,Vt&&(this._ctx=Vt,Vt.data.push(this)),kl||bi.wake()}var e=n.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,Aa(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,r){if(Ra(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(pf(this,i),!s._dp||s.parent||Bx(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&fr(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===It||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),Nx(this,i,r)),this},e.time=function(i,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+B_(this))%(this._dur+this._rDelay)||(i?this._dur:0),r):this._time},e.totalProgress=function(i,r){return arguments.length?this.totalTime(this.totalDuration()*i,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+B_(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,r){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*s,r):this._repeat?wa(this._tTime,s)+1:1},e.timeScale=function(i,r){if(!arguments.length)return this._rts===-It?0:this._rts;if(this._rts===i)return this;var s=this.parent&&this._ts?Du(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-It?0:this._rts,this.totalTime(Jl(-Math.abs(this._delay),this.totalDuration(),s),r!==!1),df(this),ww(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Ra(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==It&&(this._tTime-=It)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=Gt(i);var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&fr(r,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(ai(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var r=this.parent||this._dp;return r?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Du(r.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=Mw);var r=Dn;return Dn=i,om(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Dn=r,this},e.globalTime=function(i){for(var r=this,s=arguments.length?i:r.rawTime();r;)s=r._start+s/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(i):s},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,k_(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var r=this._time;return this._rDelay=i,k_(this),r?this.time(r):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,r){return this.totalTime(Fi(this,i),ai(r))},e.restart=function(i,r){return this.play().totalTime(i?-this._delay:0,ai(r)),this._dur||(this._zTime=-It),this},e.play=function(i,r){return i!=null&&this.seek(i,r),this.reversed(!1).paused(!1)},e.reverse=function(i,r){return i!=null&&this.seek(i||this.totalDuration(),r),this.reversed(!0).paused(!1)},e.pause=function(i,r){return i!=null&&this.seek(i,r),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-It:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-It,this},e.isActive=function(){var i=this.parent||this._dp,r=this._start,s;return!!(!i||this._ts&&this._initted&&i.isActive()&&(s=i.rawTime(!0))>=r&&s<this.endTime(!0)-It)},e.eventCallback=function(i,r,s){var o=this.vars;return arguments.length>1?(r?(o[i]=r,s&&(o[i+"Params"]=s),i==="onUpdate"&&(this._onUpdate=r)):delete o[i],this):o[i]},e.then=function(i){var r=this,s=r._prom;return new Promise(function(o){var a=qt(i)?i:Fx,l=function(){var u=r.then;r.then=null,s&&s(),qt(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=u),o(a),r.then=u};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?l():r._prom=l})},e.kill=function(){tl(this)},n})();Di(Hl.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-It,_prom:0,_ps:!1,_rts:1});var si=(function(n){Ex(e,n);function e(i,r){var s;return i===void 0&&(i={}),s=n.call(this,i)||this,s.labels={},s.smoothChildTiming=!!i.smoothChildTiming,s.autoRemoveChildren=!!i.autoRemoveChildren,s._sort=ai(i.sortChildren),Wt&&fr(i.parent||Wt,Nr(s),r),i.reversed&&s.reverse(),i.paused&&s.paused(!0),i.scrollTrigger&&kx(Nr(s),i.scrollTrigger),s}var t=e.prototype;return t.to=function(r,s,o){return gl(0,arguments,this),this},t.from=function(r,s,o){return gl(1,arguments,this),this},t.fromTo=function(r,s,o,a){return gl(2,arguments,this),this},t.set=function(r,s,o){return s.duration=0,s.parent=this,_l(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new an(r,s,Fi(this,o),1),this},t.call=function(r,s,o){return fr(this,an.delayedCall(0,r,s),o)},t.staggerTo=function(r,s,o,a,l,c,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=u,o.parent=this,new an(r,o,Fi(this,l)),this},t.staggerFrom=function(r,s,o,a,l,c,u){return o.runBackwards=1,_l(o).immediateRender=ai(o.immediateRender),this.staggerTo(r,s,o,a,l,c,u)},t.staggerFromTo=function(r,s,o,a,l,c,u,h){return a.startAt=o,_l(a).immediateRender=ai(a.immediateRender),this.staggerTo(r,s,a,l,c,u,h)},t.render=function(r,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=r<=0?0:Gt(r),h=this._zTime<0!=r<0&&(this._initted||!c),f,d,p,m,_,g,y,v,x,b,T,w;if(this!==Wt&&u>l&&r>=0&&(u=l),u!==this._tTime||o||h){if(a!==this._time&&c&&(u+=this._time-a,r+=this._time-a),f=u,x=this._start,v=this._ts,g=!v,h&&(c||(a=this._zTime),(r||!s)&&(this._zTime=r)),this._repeat){if(T=this._yoyo,_=c+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(_*100+r,s,o);if(f=Gt(u%_),u===l?(m=this._repeat,f=c):(b=Gt(u/_),m=~~b,m&&m===b&&(f=c,m--),f>c&&(f=c)),b=wa(this._tTime,_),!a&&this._tTime&&b!==m&&this._tTime-b*_-this._dur<=0&&(b=m),T&&m&1&&(f=c-f,w=1),m!==b&&!this._lock){var S=T&&b&1,E=S===(T&&m&1);if(m<b&&(S=!S),a=S?0:u%c?c:u,this._lock=1,this.render(a||(w?0:Gt(m*_)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&Ti(this,"onRepeat"),this.vars.repeatRefresh&&!w&&(this.invalidate()._lock=1,b=m),a&&a!==this._time||g!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,E&&(this._lock=2,a=S?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!w&&this.invalidate()),this._lock=0,!this._ts&&!g)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(y=Pw(this,Gt(a),Gt(f)),y&&(u-=f-(f=y._start))),this._tTime=u,this._time=f,this._act=!!v,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,a=0),!a&&u&&c&&!s&&!b&&(Ti(this,"onStart"),this._tTime!==u))return this;if(f>=a&&r>=0)for(d=this._first;d;){if(p=d._next,(d._act||f>=d._start)&&d._ts&&y!==d){if(d.parent!==this)return this.render(r,s,o);if(d.render(d._ts>0?(f-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(f-d._start)*d._ts,s,o),f!==this._time||!this._ts&&!g){y=0,p&&(u+=this._zTime=-It);break}}d=p}else{d=this._last;for(var A=r<0?r:f;d;){if(p=d._prev,(d._act||A<=d._end)&&d._ts&&y!==d){if(d.parent!==this)return this.render(r,s,o);if(d.render(d._ts>0?(A-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(A-d._start)*d._ts,s,o||Dn&&om(d)),f!==this._time||!this._ts&&!g){y=0,p&&(u+=this._zTime=A?-It:It);break}}d=p}}if(y&&!s&&(this.pause(),y.render(f>=a?0:-It)._zTime=f>=a?1:-1,this._ts))return this._start=x,df(this),this.render(r,s,o);this._onUpdate&&!s&&Ti(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&a)&&(x===this._start||Math.abs(v)!==Math.abs(this._ts))&&(this._lock||((r||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Ls(this,1),!s&&!(r<0&&!a)&&(u||a||!l)&&(Ti(this,u===l&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(r,s){var o=this;if(Kr(s)||(s=Fi(this,s,r)),!(r instanceof Hl)){if(Wn(r))return r.forEach(function(a){return o.add(a,s)}),this;if(An(r))return this.addLabel(r,s);if(qt(r))r=an.delayedCall(0,r);else return this}return this!==r?fr(this,r,s):this},t.getChildren=function(r,s,o,a){r===void 0&&(r=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-Vi);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof an?s&&l.push(c):(o&&l.push(c),r&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},t.getById=function(r){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===r)return s[o]},t.remove=function(r){return An(r)?this.removeLabel(r):qt(r)?this.killTweensOf(r):(r.parent===this&&hf(this,r),r===this._recent&&(this._recent=this._last),po(this))},t.totalTime=function(r,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Gt(bi.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),n.prototype.totalTime.call(this,r,s),this._forcing=0,this):this._tTime},t.addLabel=function(r,s){return this.labels[r]=Fi(this,s),this},t.removeLabel=function(r){return delete this.labels[r],this},t.addPause=function(r,s,o){var a=an.delayedCall(0,s||Ol,o);return a.data="isPause",this._hasPause=1,fr(this,a,Fi(this,r))},t.removePause=function(r){var s=this._first;for(r=Fi(this,r);s;)s._start===r&&s.data==="isPause"&&Ls(s),s=s._next},t.killTweensOf=function(r,s,o){for(var a=this.getTweensOf(r,o),l=a.length;l--;)xs!==a[l]&&a[l].kill(r,s);return this},t.getTweensOf=function(r,s){for(var o=[],a=Gi(r),l=this._first,c=Kr(s),u;l;)l instanceof an?bw(l._targets,a)&&(c?(!xs||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(u=l.getTweensOf(a,s)).length&&o.push.apply(o,u),l=l._next;return o},t.tweenTo=function(r,s){s=s||{};var o=this,a=Fi(o,r),l=s,c=l.startAt,u=l.onStart,h=l.onStartParams,f=l.immediateRender,d,p=an.to(o,Di({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||It,onStart:function(){if(o.pause(),!d){var _=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());p._dur!==_&&Aa(p,_,0,1).render(p._time,!0,!0),d=1}u&&u.apply(p,h||[])}},s));return f?p.render(0):p},t.tweenFromTo=function(r,s,o){return this.tweenTo(s,Di({startAt:{time:Fi(this,r)}},o))},t.recent=function(){return this._recent},t.nextLabel=function(r){return r===void 0&&(r=this._time),H_(this,Fi(this,r))},t.previousLabel=function(r){return r===void 0&&(r=this._time),H_(this,Fi(this,r),1)},t.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+It)},t.shiftChildren=function(r,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(r=Gt(r);a;)a._start>=o&&(a._start+=r,a._end+=r),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=r);return po(this)},t.invalidate=function(r){var s=this._first;for(this._lock=0;s;)s.invalidate(r),s=s._next;return n.prototype.invalidate.call(this,r)},t.clear=function(r){r===void 0&&(r=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),po(this)},t.totalDuration=function(r){var s=0,o=this,a=o._last,l=Vi,c,u,h;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-r:r));if(o._dirty){for(h=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,fr(o,a,u-a._delay,1)._lock=0):l=u,u<0&&a._ts&&(s-=u,(!h&&!o._dp||h&&h.smoothChildTiming)&&(o._start+=Gt(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;Aa(o,o===Wt&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},e.updateRoot=function(r){if(Wt._ts&&(Nx(Wt,Du(r,Wt)),Lx=bi.frame),bi.frame>=F_){F_+=Ri.autoSleep||120;var s=Wt._first;if((!s||!s._ts)&&Ri.autoSleep&&bi._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||bi.sleep()}}},e})(Hl);Di(si.prototype,{_lock:0,_hasPause:0,_forcing:0});var qw=function(e,t,i,r,s,o,a){var l=new ci(this._pt,e,t,0,1,oy,null,s),c=0,u=0,h,f,d,p,m,_,g,y;for(l.b=i,l.e=r,i+="",r+="",(g=~r.indexOf("random("))&&(r=Bl(r)),o&&(y=[i,r],o(y,e,t),i=y[0],r=y[1]),f=i.match(Bf)||[];h=Bf.exec(r);)p=h[0],m=r.substring(c,h.index),d?d=(d+1)%5:m.substr(-5)==="rgba("&&(d=1),p!==f[u++]&&(_=parseFloat(f[u-1])||0,l._pt={_next:l._pt,p:m||u===1?m:",",s:_,c:p.charAt(1)==="="?fa(_,p)-_:parseFloat(p)-_,m:d&&d<4?Math.round:0},c=Bf.lastIndex);return l.c=c<r.length?r.substring(c,r.length):"",l.fp=a,(Rx.test(r)||g)&&(l.e=0),this._pt=l,l},am=function(e,t,i,r,s,o,a,l,c,u){qt(r)&&(r=r(s||0,e,o));var h=e[t],f=i!=="get"?i:qt(h)?c?e[t.indexOf("set")||!qt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():h,d=qt(h)?c?Jw:ry:cm,p;if(An(r)&&(~r.indexOf("random(")&&(r=Bl(r)),r.charAt(1)==="="&&(p=fa(f,r)+(zn(f)||0),(p||p===0)&&(r=p))),!u||f!==r||fd)return!isNaN(f*r)&&r!==""?(p=new ci(this._pt,e,t,+f||0,r-(f||0),typeof h=="boolean"?eA:sy,0,d),c&&(p.fp=c),a&&p.modifier(a,this,e),this._pt=p):(!h&&!(t in e)&&nm(t,r),qw.call(this,e,t,f,r,d,l||Ri.stringFilter,c))},Yw=function(e,t,i,r,s){if(qt(e)&&(e=vl(e,s,t,i,r)),!br(e)||e.style&&e.nodeType||Wn(e)||wx(e))return An(e)?vl(e,s,t,i,r):e;var o={},a;for(a in e)o[a]=vl(e[a],s,t,i,r);return o},ty=function(e,t,i,r,s,o){var a,l,c,u;if(yi[e]&&(a=new yi[e]).init(s,a.rawVars?t[e]:Yw(t[e],r,s,o,i),i,r,o)!==!1&&(i._pt=l=new ci(i._pt,s,e,0,1,a.render,a,0,a.priority),i!==ia))for(c=i._ptLookup[i._targets.indexOf(s)],u=a._props.length;u--;)c[a._props[u]]=l;return a},xs,fd,lm=function n(e,t,i){var r=e.vars,s=r.ease,o=r.startAt,a=r.immediateRender,l=r.lazy,c=r.onUpdate,u=r.runBackwards,h=r.yoyoEase,f=r.keyframes,d=r.autoRevert,p=e._dur,m=e._startAt,_=e._targets,g=e.parent,y=g&&g.data==="nested"?g.vars.targets:_,v=e._overwrite==="auto"&&!Jp,x=e.timeline,b=r.easeReverse||h,T,w,S,E,A,D,L,H,z,k,B,U,G;if(x&&(!f||!s)&&(s="none"),e._ease=mo(s,Ul.ease),e._rEase=b&&(mo(b)||e._ease),e._from=!x&&!!r.runBackwards,e._from&&(e.ratio=1),!x||f&&!r.stagger){if(H=_[0]?ho(_[0]).harness:0,U=H&&r[H.prop],T=Pu(r,im),m&&(m._zTime<0&&m.progress(1),t<0&&u&&a&&!d?m.render(-1,!0):m.revert(u&&p?Jc:Sw),m._lazy=0),o){if(Ls(e._startAt=an.set(_,Di({data:"isStart",overwrite:!1,parent:g,immediateRender:!0,lazy:!m&&ai(l),startAt:null,delay:0,onUpdate:c&&function(){return Ti(e,"onUpdate")},stagger:0},o))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Dn||!a&&!d)&&e._startAt.revert(Jc),a&&p&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(u&&p&&!m){if(t&&(a=!1),S=Di({overwrite:!1,data:"isFromStart",lazy:a&&!m&&ai(l),immediateRender:a,stagger:0,parent:g},T),U&&(S[H.prop]=U),Ls(e._startAt=an.set(_,S)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Dn?e._startAt.revert(Jc):e._startAt.render(-1,!0)),e._zTime=t,!a)n(e._startAt,It,It);else if(!t)return}for(e._pt=e._ptCache=0,l=p&&ai(l)||l&&!p,w=0;w<_.length;w++){if(A=_[w],L=A._gsap||sm(_)[w]._gsap,e._ptLookup[w]=k={},sd[L.id]&&Rs.length&&Cu(),B=y===_?w:y.indexOf(A),H&&(z=new H).init(A,U||T,e,B,y)!==!1&&(e._pt=E=new ci(e._pt,A,z.name,0,1,z.render,z,0,z.priority),z._props.forEach(function(ee){k[ee]=E}),z.priority&&(D=1)),!H||U)for(S in T)yi[S]&&(z=ty(S,T,e,B,A,y))?z.priority&&(D=1):k[S]=E=am.call(e,A,S,"get",T[S],B,y,0,r.stringFilter);e._op&&e._op[w]&&e.kill(A,e._op[w]),v&&e._pt&&(xs=e,Wt.killTweensOf(A,k,e.globalTime(t)),G=!e.parent,xs=0),e._pt&&l&&(sd[L.id]=1)}D&&ay(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!G,f&&t<=0&&x.render(Vi,!0,!0)},jw=function(e,t,i,r,s,o,a,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,h,f,d;if(!c)for(c=e._ptCache[t]=[],f=e._ptLookup,d=e._targets.length;d--;){if(u=f[d][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return fd=1,e.vars[t]="+=0",lm(e,a),fd=0,l?Fl(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(d=c.length;d--;)h=c[d],u=h._pt||h,u.s=(r||r===0)&&!s?r:u.s+(r||0)+o*u.c,u.c=i-u.s,h.e&&(h.e=Zt(i)+zn(h.e)),h.b&&(h.b=u.s+zn(h.b))},Kw=function(e,t){var i=e[0]?ho(e[0]).harness:0,r=i&&i.aliases,s,o,a,l;if(!r)return t;s=Ta({},t);for(o in r)if(o in s)for(l=r[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},Zw=function(e,t,i,r){var s=t.ease||r||"power1.inOut",o,a;if(Wn(t))a=i[e]||(i[e]=[]),t.forEach(function(l,c){return a.push({t:c/(t.length-1)*100,v:l,e:s})});else for(o in t)a=i[o]||(i[o]=[]),o==="ease"||a.push({t:parseFloat(e),v:t[o],e:s})},vl=function(e,t,i,r,s){return qt(e)?e.call(t,i,r,s):An(e)&&~e.indexOf("random(")?Bl(e):e},ny=rm+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",iy={};li(ny+",id,stagger,delay,duration,paused,scrollTrigger",function(n){return iy[n]=1});var an=(function(n){Ex(e,n);function e(i,r,s,o){var a;typeof r=="number"&&(s.duration=r,r=s,s=null),a=n.call(this,o?r:_l(r))||this;var l=a.vars,c=l.duration,u=l.delay,h=l.immediateRender,f=l.stagger,d=l.overwrite,p=l.keyframes,m=l.defaults,_=l.scrollTrigger,g=r.parent||Wt,y=(Wn(i)||wx(i)?Kr(i[0]):"length"in r)?[i]:Gi(i),v,x,b,T,w,S,E,A;if(a._targets=y.length?sm(y):Fl("GSAP target "+i+" not found. https://gsap.com",!Ri.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=d,p||f||fc(c)||fc(u)){r=a.vars;var D=r.easeReverse||r.yoyoEase;if(v=a.timeline=new si({data:"nested",defaults:m||{},targets:g&&g.data==="nested"?g.vars.targets:y}),v.kill(),v.parent=v._dp=Nr(a),v._start=0,f||fc(c)||fc(u)){if(T=y.length,E=f&&Gx(f),br(f))for(w in f)~ny.indexOf(w)&&(A||(A={}),A[w]=f[w]);for(x=0;x<T;x++)b=Pu(r,iy),b.stagger=0,D&&(b.easeReverse=D),A&&Ta(b,A),S=y[x],b.duration=+vl(c,Nr(a),x,S,y),b.delay=(+vl(u,Nr(a),x,S,y)||0)-a._delay,!f&&T===1&&b.delay&&(a._delay=u=b.delay,a._start+=u,b.delay=0),v.to(S,b,E?E(x,S,y):0),v._ease=ht.none;v.duration()?c=u=0:a.timeline=0}else if(p){_l(Di(v.vars.defaults,{ease:"none"})),v._ease=mo(p.ease||r.ease||"none");var L=0,H,z,k;if(Wn(p))p.forEach(function(B){return v.to(y,B,">")}),v.duration();else{b={};for(w in p)w==="ease"||w==="easeEach"||Zw(w,p[w],b,p.easeEach);for(w in b)for(H=b[w].sort(function(B,U){return B.t-U.t}),L=0,x=0;x<H.length;x++)z=H[x],k={ease:z.e,duration:(z.t-(x?H[x-1].t:0))/100*c},k[w]=z.v,v.to(y,k,L),L+=k.duration;v.duration()<c&&v.to({},{duration:c-v.duration()})}}c||a.duration(c=v.duration())}else a.timeline=0;return d===!0&&!Jp&&(xs=Nr(a),Wt.killTweensOf(y),xs=0),fr(g,Nr(a),s),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(h||!c&&!p&&a._start===Gt(g._time)&&ai(h)&&Aw(Nr(a))&&g.data!=="nested")&&(a._tTime=-It,a.render(Math.max(0,-u)||0)),_&&kx(Nr(a),_),a}var t=e.prototype;return t.render=function(r,s,o){var a=this._time,l=this._tDur,c=this._dur,u=r<0,h=r>l-It&&!u?l:r<It?0:r,f,d,p,m,_,g,y,v;if(!c)Cw(this,r,s,o);else if(h!==this._tTime||!r||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=h,v=this.timeline,this._repeat){if(m=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(m*100+r,s,o);if(f=Gt(h%m),h===l?(p=this._repeat,f=c):(_=Gt(h/m),p=~~_,p&&p===_?(f=c,p--):f>c&&(f=c)),g=this._yoyo&&p&1,g&&(f=c-f),_=wa(this._tTime,m),f===a&&!o&&this._initted&&p===_)return this._tTime=h,this;p!==_&&this.vars.repeatRefresh&&!g&&!this._lock&&f!==m&&this._initted&&(this._lock=o=1,this.render(Gt(m*p),!0).invalidate()._lock=0)}if(!this._initted){if(Hx(this,u?r:f,o,s,h))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&p!==_))return this;if(c!==this._dur)return this.render(r,s,o)}if(this._rEase){var x=f<a;if(x!==this._inv){var b=x?a:c-a;this._inv=x,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=b?(x?-1:1)/b:0,this._invScale=x?-this.ratio:1-this.ratio,this._invEase=x?this._rEase:this._ease}this.ratio=y=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=y=this._ease(f/c);if(this._from&&(this.ratio=y=1-y),this._tTime=h,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&h&&!s&&!_&&(Ti(this,"onStart"),this._tTime!==h))return this;for(d=this._pt;d;)d.r(y,d.d),d=d._next;v&&v.render(r<0?r:v._dur*v._ease(f/this._dur),s,o)||this._startAt&&(this._zTime=r),this._onUpdate&&!s&&(u&&od(this,r,s,o),Ti(this,"onUpdate")),this._repeat&&p!==_&&this.vars.onRepeat&&!s&&this.parent&&Ti(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(u&&!this._onUpdate&&od(this,r,!0,!0),(r||!c)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&Ls(this,1),!s&&!(u&&!a)&&(h||a||g)&&(Ti(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),n.prototype.invalidate.call(this,r)},t.resetTo=function(r,s,o,a,l){kl||bi.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||lm(this,c),u=this._ease(c/this._dur),jw(this,r,s,o,a,u,c,l)?this.resetTo(r,s,o,a,1):(pf(this,0),this.parent||Ox(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(r,s){if(s===void 0&&(s="all"),!r&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?tl(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Dn),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(r,s,xs&&xs.vars.overwrite!==!0)._first||tl(this),this.parent&&o!==this.timeline.totalDuration()&&Aa(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=r?Gi(r):a,c=this._ptLookup,u=this._pt,h,f,d,p,m,_,g;if((!s||s==="all")&&Tw(a,l))return s==="all"&&(this._pt=0),tl(this);for(h=this._op=this._op||[],s!=="all"&&(An(s)&&(m={},li(s,function(y){return m[y]=1}),s=m),s=Kw(a,s)),g=a.length;g--;)if(~l.indexOf(a[g])){f=c[g],s==="all"?(h[g]=s,p=f,d={}):(d=h[g]=h[g]||{},p=s);for(m in p)_=f&&f[m],_&&((!("kill"in _.d)||_.d.kill(m)===!0)&&hf(this,_,"_pt"),delete f[m]),d!=="all"&&(d[m]=1)}return this._initted&&!this._pt&&u&&tl(this),this},e.to=function(r,s){return new e(r,s,arguments[2])},e.from=function(r,s){return gl(1,arguments)},e.delayedCall=function(r,s,o,a){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},e.fromTo=function(r,s,o){return gl(2,arguments)},e.set=function(r,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(r,s)},e.killTweensOf=function(r,s,o){return Wt.killTweensOf(r,s,o)},e})(Hl);Di(an.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});li("staggerTo,staggerFrom,staggerFromTo",function(n){an[n]=function(){var e=new si,t=ld.call(arguments,0);return t.splice(n==="staggerFromTo"?5:4,0,0),e[n].apply(e,t)}});var cm=function(e,t,i){return e[t]=i},ry=function(e,t,i){return e[t](i)},Jw=function(e,t,i,r){return e[t](r.fp,i)},Qw=function(e,t,i){return e.setAttribute(t,i)},um=function(e,t){return qt(e[t])?ry:Qp(e[t])&&e.setAttribute?Qw:cm},sy=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},eA=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},oy=function(e,t){var i=t._pt,r="";if(!e&&t.b)r=t.b;else if(e===1&&t.e)r=t.e;else{for(;i;)r=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+r,i=i._next;r+=t.c}t.set(t.t,t.p,r,t)},fm=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},tA=function(e,t,i,r){for(var s=this._pt,o;s;)o=s._next,s.p===r&&s.modifier(e,t,i),s=o},nA=function(e){for(var t=this._pt,i,r;t;)r=t._next,t.p===e&&!t.op||t.op===e?hf(this,t,"_pt"):t.dep||(i=1),t=r;return!i},iA=function(e,t,i,r){r.mSet(e,t,r.m.call(r.tween,i,r.mt),r)},ay=function(e){for(var t=e._pt,i,r,s,o;t;){for(i=t._next,r=s;r&&r.pr>t.pr;)r=r._next;(t._prev=r?r._prev:o)?t._prev._next=t:s=t,(t._next=r)?r._prev=t:o=t,t=i}e._pt=s},ci=(function(){function n(t,i,r,s,o,a,l,c,u){this.t=i,this.s=s,this.c=o,this.p=r,this.r=a||sy,this.d=l||this,this.set=c||cm,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=n.prototype;return e.modifier=function(i,r,s){this.mSet=this.mSet||this.set,this.set=iA,this.m=i,this.mt=s,this.tween=r},n})();li(rm+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(n){return im[n]=1});Pi.TweenMax=Pi.TweenLite=an;Pi.TimelineLite=Pi.TimelineMax=si;Wt=new si({sortChildren:!1,defaults:Ul,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Ri.stringFilter=Jx;var _o=[],eu={},rA=[],V_=0,sA=0,Gf=function(e){return(eu[e]||rA).map(function(t){return t()})},hd=function(){var e=Date.now(),t=[];e-V_>2&&(Gf("matchMediaInit"),_o.forEach(function(i){var r=i.queries,s=i.conditions,o,a,l,c;for(a in r)o=ar.matchMedia(r[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(i.revert(),l&&t.push(i))}),Gf("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(r){return i.add(null,r)})}),V_=e,Gf("matchMedia"))},ly=(function(){function n(t,i){this.selector=i&&cd(i),this.data=[],this._r=[],this.isReverted=!1,this.id=sA++,t&&this.add(t)}var e=n.prototype;return e.add=function(i,r,s){qt(i)&&(s=r,r=i,i=qt);var o=this,a=function(){var c=Vt,u=o.selector,h;return c&&c!==o&&c.data.push(o),s&&(o.selector=cd(s)),Vt=o,h=r.apply(o,arguments),qt(h)&&o._r.push(h),Vt=c,o.selector=u,o.isReverted=!1,h};return o.last=a,i===qt?a(o,function(l){return o.add(null,l)}):i?o[i]=a:a},e.ignore=function(i){var r=Vt;Vt=null,i(this),Vt=r},e.getTweens=function(){var i=[];return this.data.forEach(function(r){return r instanceof n?i.push.apply(i,r.getTweens()):r instanceof an&&!(r.parent&&r.parent.data==="nested")&&i.push(r)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,r){var s=this;if(i?(function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,h){return h.g-u.g||-1/0}).forEach(function(u){return u.t.revert(i)}),l=s.data.length;l--;)c=s.data[l],c instanceof si?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof an)&&c.revert&&c.revert(i);s._r.forEach(function(u){return u(i,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),r)for(var o=_o.length;o--;)_o[o].id===this.id&&_o.splice(o,1)},e.revert=function(i){this.kill(i||{})},n})(),oA=(function(){function n(t){this.contexts=[],this.scope=t,Vt&&Vt.data.push(this)}var e=n.prototype;return e.add=function(i,r,s){br(i)||(i={matches:i});var o=new ly(0,s||this.scope),a=o.conditions={},l,c,u;Vt&&!o.selector&&(o.selector=Vt.selector),this.contexts.push(o),r=o.add("onMatch",r),o.queries=i;for(c in i)c==="all"?u=1:(l=ar.matchMedia(i[c]),l&&(_o.indexOf(o)<0&&_o.push(o),(a[c]=l.matches)&&(u=1),l.addListener?l.addListener(hd):l.addEventListener("change",hd)));return u&&r(o,function(h){return o.add(null,h)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(r){return r.kill(i,!0)})},n})(),Lu={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(r){return jx(r)})},timeline:function(e){return new si(e)},getTweensOf:function(e,t){return Wt.getTweensOf(e,t)},getProperty:function(e,t,i,r){An(e)&&(e=Gi(e)[0]);var s=ho(e||{}).get,o=i?Fx:Ux;return i==="native"&&(i=""),e&&(t?o((yi[t]&&yi[t].get||s)(e,t,i,r)):function(a,l,c){return o((yi[a]&&yi[a].get||s)(e,a,l,c))})},quickSetter:function(e,t,i){if(e=Gi(e),e.length>1){var r=e.map(function(u){return di.quickSetter(u,t,i)}),s=r.length;return function(u){for(var h=s;h--;)r[h](u)}}e=e[0]||{};var o=yi[t],a=ho(e),l=a.harness&&(a.harness.aliases||{})[t]||t,c=o?function(u){var h=new o;ia._pt=0,h.init(e,i?u+i:u,ia,0,[e]),h.render(1,h),ia._pt&&fm(1,ia)}:a.set(e,l);return o?c:function(u){return c(e,l,i?u+i:u,a,1)}},quickTo:function(e,t,i){var r,s=di.to(e,Di((r={},r[t]="+=0.1",r.paused=!0,r.stagger=0,r),i||{})),o=function(l,c,u){return s.resetTo(t,l,c,u)};return o.tween=s,o},isTweening:function(e){return Wt.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=mo(e.ease,Ul.ease)),O_(Ul,e||{})},config:function(e){return O_(Ri,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,r=e.plugins,s=e.defaults,o=e.extendTimeline;(r||"").split(",").forEach(function(a){return a&&!yi[a]&&!Pi[a]&&Fl(t+" effect requires "+a+" plugin.")}),kf[t]=function(a,l,c){return i(Gi(a),Di(l||{},s),c)},o&&(si.prototype[t]=function(a,l,c){return this.add(kf[t](a,br(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){ht[e]=mo(t)},parseEase:function(e,t){return arguments.length?mo(e,t):ht},getById:function(e){return Wt.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new si(e),r,s;for(i.smoothChildTiming=ai(e.smoothChildTiming),Wt.remove(i),i._dp=0,i._time=i._tTime=Wt._time,r=Wt._first;r;)s=r._next,(t||!(!r._dur&&r instanceof an&&r.vars.onComplete===r._targets[0]))&&fr(i,r,r._start-r._delay),r=s;return fr(Wt,i,0),i},context:function(e,t){return e?new ly(e,t):Vt},matchMedia:function(e){return new oA(e)},matchMediaRefresh:function(){return _o.forEach(function(e){var t=e.conditions,i,r;for(r in t)t[r]&&(t[r]=!1,i=1);i&&e.revert()})||hd()},addEventListener:function(e,t){var i=eu[e]||(eu[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=eu[e],r=i&&i.indexOf(t);r>=0&&i.splice(r,1)},utils:{wrap:Ow,wrapYoyo:Bw,distribute:Gx,random:Xx,snap:Wx,normalize:Fw,getUnit:zn,clamp:Lw,splitColor:Kx,toArray:Gi,selector:cd,mapRange:qx,pipe:Nw,unitize:Uw,interpolate:kw,shuffle:Vx},install:Px,effects:kf,ticker:bi,updateRoot:si.updateRoot,plugins:yi,globalTimeline:Wt,core:{PropTween:ci,globals:Dx,Tween:an,Timeline:si,Animation:Hl,getCache:ho,_removeLinkedListItem:hf,reverting:function(){return Dn},context:function(e){return e&&Vt&&(Vt.data.push(e),e._ctx=Vt),Vt},suppressOverwrites:function(e){return Jp=e}}};li("to,from,fromTo,delayedCall,set,killTweensOf",function(n){return Lu[n]=an[n]});bi.add(si.updateRoot);ia=Lu.to({},{duration:0});var aA=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},lA=function(e,t){var i=e._targets,r,s,o;for(r in t)for(s=i.length;s--;)o=e._ptLookup[s][r],o&&(o=o.d)&&(o._pt&&(o=aA(o,r)),o&&o.modifier&&o.modifier(t[r],e,i[s],r))},Wf=function(e,t){return{name:e,headless:1,rawVars:1,init:function(r,s,o){o._onInit=function(a){var l,c;if(An(s)&&(l={},li(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}lA(a,s)}}}},di=Lu.registerPlugin({name:"attr",init:function(e,t,i,r,s){var o,a,l;this.tween=i;for(o in t)l=e.getAttribute(o)||"",a=this.add(e,"setAttribute",(l||0)+"",t[o],r,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(e,t){for(var i=t._pt;i;)Dn?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},Wf("roundProps",ud),Wf("modifiers"),Wf("snap",Wx))||Lu;an.version=si.version=di.version="3.15.0";Cx=1;em()&&Ra();ht.Power0;ht.Power1;ht.Power2;ht.Power3;ht.Power4;ht.Linear;ht.Quad;ht.Cubic;ht.Quart;ht.Quint;ht.Strong;ht.Elastic;ht.Back;ht.SteppedEase;ht.Bounce;ht.Sine;ht.Expo;ht.Circ;var G_,ys,ha,hm,io,W_,dm,cA=function(){return typeof window<"u"},Zr={},Ks=180/Math.PI,da=Math.PI/180,No=Math.atan2,X_=1e8,pm=/([A-Z])/g,uA=/(left|right|width|margin|padding|x)/i,fA=/[\s,\(]\S/,hr={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},dd=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},hA=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},dA=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},pA=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},mA=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},cy=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},uy=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},_A=function(e,t,i){return e.style[t]=i},gA=function(e,t,i){return e.style.setProperty(t,i)},vA=function(e,t,i){return e._gsap[t]=i},xA=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},yA=function(e,t,i,r,s){var o=e._gsap;o.scaleX=o.scaleY=i,o.renderTransform(s,o)},SA=function(e,t,i,r,s){var o=e._gsap;o[t]=i,o.renderTransform(s,o)},Xt="transform",ui=Xt+"Origin",MA=function n(e,t){var i=this,r=this.target,s=r.style,o=r._gsap;if(e in Zr&&s){if(this.tfm=this.tfm||{},e!=="transform")e=hr[e]||e,~e.indexOf(",")?e.split(",").forEach(function(a){return i.tfm[a]=Fr(r,a)}):this.tfm[e]=o.x?o[e]:Fr(r,e),e===ui&&(this.tfm.zOrigin=o.zOrigin);else return hr.transform.split(",").forEach(function(a){return n.call(i,a,t)});if(this.props.indexOf(Xt)>=0)return;o.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(ui,t,"")),e=Xt}(s||t)&&this.props.push(e,t,s[e])},fy=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},bA=function(){var e=this.props,t=this.target,i=t.style,r=t._gsap,s,o;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?i[e[s]]=e[s+2]:i.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(pm,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)r[o]=this.tfm[o];r.svg&&(r.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=dm(),(!s||!s.isStart)&&!i[Xt]&&(fy(i),r.zOrigin&&i[ui]&&(i[ui]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},hy=function(e,t){var i={target:e,props:[],revert:bA,save:MA};return e._gsap||di.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(r){return i.save(r)}),i},dy,pd=function(e,t){var i=ys.createElementNS?ys.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):ys.createElement(e);return i&&i.style?i:ys.createElement(e)},wi=function n(e,t,i){var r=getComputedStyle(e);return r[t]||r.getPropertyValue(t.replace(pm,"-$1").toLowerCase())||r.getPropertyValue(t)||!i&&n(e,Ca(t)||t,1)||""},$_="O,Moz,ms,Ms,Webkit".split(","),Ca=function(e,t,i){var r=t||io,s=r.style,o=5;if(e in s&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);o--&&!($_[o]+e in s););return o<0?null:(o===3?"ms":o>=0?$_[o]:"")+e},md=function(){cA()&&window.document&&(G_=window,ys=G_.document,ha=ys.documentElement,io=pd("div")||{style:{}},pd("div"),Xt=Ca(Xt),ui=Xt+"Origin",io.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",dy=!!Ca("perspective"),dm=di.core.reverting,hm=1)},q_=function(e){var t=e.ownerSVGElement,i=pd("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=e.cloneNode(!0),s;r.style.display="block",i.appendChild(r),ha.appendChild(i);try{s=r.getBBox()}catch{}return i.removeChild(r),ha.removeChild(i),s},Y_=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},py=function(e){var t,i;try{t=e.getBBox()}catch{t=q_(e),i=1}return t&&(t.width||t.height)||i||(t=q_(e)),t&&!t.width&&!t.x&&!t.y?{x:+Y_(e,["x","cx","x1"])||0,y:+Y_(e,["y","cy","y1"])||0,width:0,height:0}:t},my=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&py(e))},Is=function(e,t){if(t){var i=e.style,r;t in Zr&&t!==ui&&(t=Xt),i.removeProperty?(r=t.substr(0,2),(r==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(r==="--"?t:t.replace(pm,"-$1").toLowerCase())):i.removeAttribute(t)}},Ss=function(e,t,i,r,s,o){var a=new ci(e._pt,t,i,0,1,o?uy:cy);return e._pt=a,a.b=r,a.e=s,e._props.push(i),a},j_={deg:1,rad:1,turn:1},EA={grid:1,flex:1},Ns=function n(e,t,i,r){var s=parseFloat(i)||0,o=(i+"").trim().substr((s+"").length)||"px",a=io.style,l=uA.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),h=100,f=r==="px",d=r==="%",p,m,_,g;if(r===o||!s||j_[r]||j_[o])return s;if(o!=="px"&&!f&&(s=n(e,t,i,"px")),g=e.getCTM&&my(e),(d||o==="%")&&(Zr[t]||~t.indexOf("adius")))return p=g?e.getBBox()[l?"width":"height"]:e[u],Zt(d?s/p*h:s/100*p);if(a[l?"width":"height"]=h+(f?o:r),m=r!=="rem"&&~t.indexOf("adius")||r==="em"&&e.appendChild&&!c?e:e.parentNode,g&&(m=(e.ownerSVGElement||{}).parentNode),(!m||m===ys||!m.appendChild)&&(m=ys.body),_=m._gsap,_&&d&&_.width&&l&&_.time===bi.time&&!_.uncache)return Zt(s/_.width*h);if(d&&(t==="height"||t==="width")){var y=e.style[t];e.style[t]=h+r,p=e[u],y?e.style[t]=y:Is(e,t)}else(d||o==="%")&&!EA[wi(m,"display")]&&(a.position=wi(e,"position")),m===e&&(a.position="static"),m.appendChild(io),p=io[u],m.removeChild(io),a.position="absolute";return l&&d&&(_=ho(m),_.time=bi.time,_.width=m[u]),Zt(f?p*s/h:p&&s?h/p*s:0)},Fr=function(e,t,i,r){var s;return hm||md(),t in hr&&t!=="transform"&&(t=hr[t],~t.indexOf(",")&&(t=t.split(",")[0])),Zr[t]&&t!=="transform"?(s=Vl(e,r),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:Nu(wi(e,ui))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||r||~(s+"").indexOf("calc("))&&(s=Iu[t]&&Iu[t](e,t,i)||wi(e,t)||Ix(e,t)||(t==="opacity"?1:0))),i&&!~(s+"").trim().indexOf(" ")?Ns(e,t,s,i)+i:s},TA=function(e,t,i,r){if(!i||i==="none"){var s=Ca(t,e,1),o=s&&wi(e,s,1);o&&o!==i?(t=s,i=o):t==="borderColor"&&(i=wi(e,"borderTopColor"))}var a=new ci(this._pt,e.style,t,0,1,oy),l=0,c=0,u,h,f,d,p,m,_,g,y,v,x,b;if(a.b=i,a.e=r,i+="",r+="",r.substring(0,6)==="var(--"&&(r=wi(e,r.substring(4,r.indexOf(")")))),r==="auto"&&(m=e.style[t],e.style[t]=r,r=wi(e,t)||r,m?e.style[t]=m:Is(e,t)),u=[i,r],Jx(u),i=u[0],r=u[1],f=i.match(na)||[],b=r.match(na)||[],b.length){for(;h=na.exec(r);)_=h[0],y=r.substring(l,h.index),p?p=(p+1)%5:(y.substr(-5)==="rgba("||y.substr(-5)==="hsla(")&&(p=1),_!==(m=f[c++]||"")&&(d=parseFloat(m)||0,x=m.substr((d+"").length),_.charAt(1)==="="&&(_=fa(d,_)+x),g=parseFloat(_),v=_.substr((g+"").length),l=na.lastIndex-v.length,v||(v=v||Ri.units[t]||x,l===r.length&&(r+=v,a.e+=v)),x!==v&&(d=Ns(e,t,m,v)||0),a._pt={_next:a._pt,p:y||c===1?y:",",s:d,c:g-d,m:p&&p<4||t==="zIndex"?Math.round:0});a.c=l<r.length?r.substring(l,r.length):""}else a.r=t==="display"&&r==="none"?uy:cy;return Rx.test(r)&&(a.e=0),this._pt=a,a},K_={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},wA=function(e){var t=e.split(" "),i=t[0],r=t[1]||"50%";return(i==="top"||i==="bottom"||r==="left"||r==="right")&&(e=i,i=r,r=e),t[0]=K_[i]||i,t[1]=K_[r]||r,t.join(" ")},AA=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,r=i.style,s=t.u,o=i._gsap,a,l,c;if(s==="all"||s===!0)r.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Zr[a]&&(l=1,a=a==="transformOrigin"?ui:Xt),Is(i,a);l&&(Is(i,Xt),o&&(o.svg&&i.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",Vl(i,1),o.uncache=1,fy(r)))}},Iu={clearProps:function(e,t,i,r,s){if(s.data!=="isFromStart"){var o=e._pt=new ci(e._pt,t,i,0,0,AA);return o.u=r,o.pr=-10,o.tween=s,e._props.push(i),1}}},zl=[1,0,0,1,0,0],_y={},gy=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},Z_=function(e){var t=wi(e,Xt);return gy(t)?zl:t.substr(7).match(Ax).map(Zt)},mm=function(e,t){var i=e._gsap||ho(e),r=e.style,s=Z_(e),o,a,l,c;return i.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?zl:s):(s===zl&&!e.offsetParent&&e!==ha&&!i.svg&&(l=r.display,r.display="block",o=e.parentNode,(!o||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,a=e.nextElementSibling,ha.appendChild(e)),s=Z_(e),l?r.display=l:Is(e,"display"),c&&(a?o.insertBefore(e,a):o?o.appendChild(e):ha.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},_d=function(e,t,i,r,s,o){var a=e._gsap,l=s||mm(e,!0),c=a.xOrigin||0,u=a.yOrigin||0,h=a.xOffset||0,f=a.yOffset||0,d=l[0],p=l[1],m=l[2],_=l[3],g=l[4],y=l[5],v=t.split(" "),x=parseFloat(v[0])||0,b=parseFloat(v[1])||0,T,w,S,E;i?l!==zl&&(w=d*_-p*m)&&(S=x*(_/w)+b*(-m/w)+(m*y-_*g)/w,E=x*(-p/w)+b*(d/w)-(d*y-p*g)/w,x=S,b=E):(T=py(e),x=T.x+(~v[0].indexOf("%")?x/100*T.width:x),b=T.y+(~(v[1]||v[0]).indexOf("%")?b/100*T.height:b)),r||r!==!1&&a.smooth?(g=x-c,y=b-u,a.xOffset=h+(g*d+y*m)-g,a.yOffset=f+(g*p+y*_)-y):a.xOffset=a.yOffset=0,a.xOrigin=x,a.yOrigin=b,a.smooth=!!r,a.origin=t,a.originIsAbsolute=!!i,e.style[ui]="0px 0px",o&&(Ss(o,a,"xOrigin",c,x),Ss(o,a,"yOrigin",u,b),Ss(o,a,"xOffset",h,a.xOffset),Ss(o,a,"yOffset",f,a.yOffset)),e.setAttribute("data-svg-origin",x+" "+b)},Vl=function(e,t){var i=e._gsap||new ey(e);if("x"in i&&!t&&!i.uncache)return i;var r=e.style,s=i.scaleX<0,o="px",a="deg",l=getComputedStyle(e),c=wi(e,ui)||"0",u,h,f,d,p,m,_,g,y,v,x,b,T,w,S,E,A,D,L,H,z,k,B,U,G,ee,F,ve,Te,$e,Ge,Oe;return u=h=f=m=_=g=y=v=x=0,d=p=1,i.svg=!!(e.getCTM&&my(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(r[Xt]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Xt]!=="none"?l[Xt]:"")),r.scale=r.rotate=r.translate="none"),w=mm(e,i.svg),i.svg&&(i.uncache?(G=e.getBBox(),c=i.xOrigin-G.x+"px "+(i.yOrigin-G.y)+"px",U=""):U=!t&&e.getAttribute("data-svg-origin"),_d(e,U||c,!!U||i.originIsAbsolute,i.smooth!==!1,w)),b=i.xOrigin||0,T=i.yOrigin||0,w!==zl&&(D=w[0],L=w[1],H=w[2],z=w[3],u=k=w[4],h=B=w[5],w.length===6?(d=Math.sqrt(D*D+L*L),p=Math.sqrt(z*z+H*H),m=D||L?No(L,D)*Ks:0,y=H||z?No(H,z)*Ks+m:0,y&&(p*=Math.abs(Math.cos(y*da))),i.svg&&(u-=b-(b*D+T*H),h-=T-(b*L+T*z))):(Oe=w[6],$e=w[7],F=w[8],ve=w[9],Te=w[10],Ge=w[11],u=w[12],h=w[13],f=w[14],S=No(Oe,Te),_=S*Ks,S&&(E=Math.cos(-S),A=Math.sin(-S),U=k*E+F*A,G=B*E+ve*A,ee=Oe*E+Te*A,F=k*-A+F*E,ve=B*-A+ve*E,Te=Oe*-A+Te*E,Ge=$e*-A+Ge*E,k=U,B=G,Oe=ee),S=No(-H,Te),g=S*Ks,S&&(E=Math.cos(-S),A=Math.sin(-S),U=D*E-F*A,G=L*E-ve*A,ee=H*E-Te*A,Ge=z*A+Ge*E,D=U,L=G,H=ee),S=No(L,D),m=S*Ks,S&&(E=Math.cos(S),A=Math.sin(S),U=D*E+L*A,G=k*E+B*A,L=L*E-D*A,B=B*E-k*A,D=U,k=G),_&&Math.abs(_)+Math.abs(m)>359.9&&(_=m=0,g=180-g),d=Zt(Math.sqrt(D*D+L*L+H*H)),p=Zt(Math.sqrt(B*B+Oe*Oe)),S=No(k,B),y=Math.abs(S)>2e-4?S*Ks:0,x=Ge?1/(Ge<0?-Ge:Ge):0),i.svg&&(U=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!gy(wi(e,Xt)),U&&e.setAttribute("transform",U))),Math.abs(y)>90&&Math.abs(y)<270&&(s?(d*=-1,y+=m<=0?180:-180,m+=m<=0?180:-180):(p*=-1,y+=y<=0?180:-180)),t=t||i.uncache,i.x=u-((i.xPercent=u&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+o,i.y=h-((i.yPercent=h&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-h)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+o,i.z=f+o,i.scaleX=Zt(d),i.scaleY=Zt(p),i.rotation=Zt(m)+a,i.rotationX=Zt(_)+a,i.rotationY=Zt(g)+a,i.skewX=y+a,i.skewY=v+a,i.transformPerspective=x+o,(i.zOrigin=parseFloat(c.split(" ")[2])||!t&&i.zOrigin||0)&&(r[ui]=Nu(c)),i.xOffset=i.yOffset=0,i.force3D=Ri.force3D,i.renderTransform=i.svg?CA:dy?vy:RA,i.uncache=0,i},Nu=function(e){return(e=e.split(" "))[0]+" "+e[1]},Xf=function(e,t,i){var r=zn(t);return Zt(parseFloat(t)+parseFloat(Ns(e,"x",i+"px",r)))+r},RA=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,vy(e,t)},Gs="0deg",Ga="0px",Ws=") ",vy=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.z,c=i.rotation,u=i.rotationY,h=i.rotationX,f=i.skewX,d=i.skewY,p=i.scaleX,m=i.scaleY,_=i.transformPerspective,g=i.force3D,y=i.target,v=i.zOrigin,x="",b=g==="auto"&&e&&e!==1||g===!0;if(v&&(h!==Gs||u!==Gs)){var T=parseFloat(u)*da,w=Math.sin(T),S=Math.cos(T),E;T=parseFloat(h)*da,E=Math.cos(T),o=Xf(y,o,w*E*-v),a=Xf(y,a,-Math.sin(T)*-v),l=Xf(y,l,S*E*-v+v)}_!==Ga&&(x+="perspective("+_+Ws),(r||s)&&(x+="translate("+r+"%, "+s+"%) "),(b||o!==Ga||a!==Ga||l!==Ga)&&(x+=l!==Ga||b?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+Ws),c!==Gs&&(x+="rotate("+c+Ws),u!==Gs&&(x+="rotateY("+u+Ws),h!==Gs&&(x+="rotateX("+h+Ws),(f!==Gs||d!==Gs)&&(x+="skew("+f+", "+d+Ws),(p!==1||m!==1)&&(x+="scale("+p+", "+m+Ws),y.style[Xt]=x||"translate(0, 0)"},CA=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.rotation,c=i.skewX,u=i.skewY,h=i.scaleX,f=i.scaleY,d=i.target,p=i.xOrigin,m=i.yOrigin,_=i.xOffset,g=i.yOffset,y=i.forceCSS,v=parseFloat(o),x=parseFloat(a),b,T,w,S,E;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=da,c*=da,b=Math.cos(l)*h,T=Math.sin(l)*h,w=Math.sin(l-c)*-f,S=Math.cos(l-c)*f,c&&(u*=da,E=Math.tan(c-u),E=Math.sqrt(1+E*E),w*=E,S*=E,u&&(E=Math.tan(u),E=Math.sqrt(1+E*E),b*=E,T*=E)),b=Zt(b),T=Zt(T),w=Zt(w),S=Zt(S)):(b=h,S=f,T=w=0),(v&&!~(o+"").indexOf("px")||x&&!~(a+"").indexOf("px"))&&(v=Ns(d,"x",o,"px"),x=Ns(d,"y",a,"px")),(p||m||_||g)&&(v=Zt(v+p-(p*b+m*w)+_),x=Zt(x+m-(p*T+m*S)+g)),(r||s)&&(E=d.getBBox(),v=Zt(v+r/100*E.width),x=Zt(x+s/100*E.height)),E="matrix("+b+","+T+","+w+","+S+","+v+","+x+")",d.setAttribute("transform",E),y&&(d.style[Xt]=E)},PA=function(e,t,i,r,s){var o=360,a=An(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?Ks:1),c=l-r,u=r+c+"deg",h,f;return a&&(h=s.split("_")[1],h==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),h==="cw"&&c<0?c=(c+o*X_)%o-~~(c/o)*o:h==="ccw"&&c>0&&(c=(c-o*X_)%o-~~(c/o)*o)),e._pt=f=new ci(e._pt,t,i,r,c,hA),f.e=u,f.u="deg",e._props.push(i),f},J_=function(e,t){for(var i in t)e[i]=t[i];return e},DA=function(e,t,i){var r=J_({},i._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=i.style,a,l,c,u,h,f,d,p;r.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),o[Xt]=t,a=Vl(i,1),Is(i,Xt),i.setAttribute("transform",c)):(c=getComputedStyle(i)[Xt],o[Xt]=t,a=Vl(i,1),o[Xt]=c);for(l in Zr)c=r[l],u=a[l],c!==u&&s.indexOf(l)<0&&(d=zn(c),p=zn(u),h=d!==p?Ns(i,l,c,p):parseFloat(c),f=parseFloat(u),e._pt=new ci(e._pt,a,l,h,f-h,dd),e._pt.u=p||0,e._props.push(l));J_(a,r)};li("padding,margin,Width,Radius",function(n,e){var t="Top",i="Right",r="Bottom",s="Left",o=(e<3?[t,i,r,s]:[t+s,t+i,r+i,r+s]).map(function(a){return e<2?n+a:"border"+a+n});Iu[e>1?"border"+n:n]=function(a,l,c,u,h){var f,d;if(arguments.length<4)return f=o.map(function(p){return Fr(a,p,c)}),d=f.join(" "),d.split(f[0]).length===5?f[0]:d;f=(u+"").split(" "),d={},o.forEach(function(p,m){return d[p]=f[m]=f[m]||f[(m-1)/2|0]}),a.init(l,d,h)}});var xy={name:"css",register:md,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,r,s){var o=this._props,a=e.style,l=i.vars.startAt,c,u,h,f,d,p,m,_,g,y,v,x,b,T,w,S,E;hm||md(),this.styles=this.styles||hy(e),S=this.styles.props,this.tween=i;for(m in t)if(m!=="autoRound"&&(u=t[m],!(yi[m]&&ty(m,t,i,r,e,s)))){if(d=typeof u,p=Iu[m],d==="function"&&(u=u.call(i,r,e,s),d=typeof u),d==="string"&&~u.indexOf("random(")&&(u=Bl(u)),p)p(this,e,m,u,i)&&(w=1);else if(m.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(m)+"").trim(),u+="",Cs.lastIndex=0,Cs.test(c)||(_=zn(c),g=zn(u),g?_!==g&&(c=Ns(e,m,c,g)+g):_&&(u+=_)),this.add(a,"setProperty",c,u,r,s,0,0,m),o.push(m),S.push(m,0,a[m]);else if(d!=="undefined"){if(l&&m in l?(c=typeof l[m]=="function"?l[m].call(i,r,e,s):l[m],An(c)&&~c.indexOf("random(")&&(c=Bl(c)),zn(c+"")||c==="auto"||(c+=Ri.units[m]||zn(Fr(e,m))||""),(c+"").charAt(1)==="="&&(c=Fr(e,m))):c=Fr(e,m),f=parseFloat(c),y=d==="string"&&u.charAt(1)==="="&&u.substr(0,2),y&&(u=u.substr(2)),h=parseFloat(u),m in hr&&(m==="autoAlpha"&&(f===1&&Fr(e,"visibility")==="hidden"&&h&&(f=0),S.push("visibility",0,a.visibility),Ss(this,a,"visibility",f?"inherit":"hidden",h?"inherit":"hidden",!h)),m!=="scale"&&m!=="transform"&&(m=hr[m],~m.indexOf(",")&&(m=m.split(",")[0]))),v=m in Zr,v){if(this.styles.save(m),E=u,d==="string"&&u.substring(0,6)==="var(--"){if(u=wi(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var A=e.style.perspective;e.style.perspective=u,u=wi(e,"perspective"),A?e.style.perspective=A:Is(e,"perspective")}h=parseFloat(u)}if(x||(b=e._gsap,b.renderTransform&&!t.parseTransform||Vl(e,t.parseTransform),T=t.smoothOrigin!==!1&&b.smooth,x=this._pt=new ci(this._pt,a,Xt,0,1,b.renderTransform,b,0,-1),x.dep=1),m==="scale")this._pt=new ci(this._pt,b,"scaleY",b.scaleY,(y?fa(b.scaleY,y+h):h)-b.scaleY||0,dd),this._pt.u=0,o.push("scaleY",m),m+="X";else if(m==="transformOrigin"){S.push(ui,0,a[ui]),u=wA(u),b.svg?_d(e,u,0,T,0,this):(g=parseFloat(u.split(" ")[2])||0,g!==b.zOrigin&&Ss(this,b,"zOrigin",b.zOrigin,g),Ss(this,a,m,Nu(c),Nu(u)));continue}else if(m==="svgOrigin"){_d(e,u,1,T,0,this);continue}else if(m in _y){PA(this,b,m,f,y?fa(f,y+u):u);continue}else if(m==="smoothOrigin"){Ss(this,b,"smooth",b.smooth,u);continue}else if(m==="force3D"){b[m]=u;continue}else if(m==="transform"){DA(this,u,e);continue}}else m in a||(m=Ca(m)||m);if(v||(h||h===0)&&(f||f===0)&&!fA.test(u)&&m in a)_=(c+"").substr((f+"").length),h||(h=0),g=zn(u)||(m in Ri.units?Ri.units[m]:_),_!==g&&(f=Ns(e,m,c,g)),this._pt=new ci(this._pt,v?b:a,m,f,(y?fa(f,y+h):h)-f,!v&&(g==="px"||m==="zIndex")&&t.autoRound!==!1?mA:dd),this._pt.u=g||0,v&&E!==u?(this._pt.b=c,this._pt.e=E,this._pt.r=pA):_!==g&&g!=="%"&&(this._pt.b=c,this._pt.r=dA);else if(m in a)TA.call(this,e,m,c,y?y+u:u);else if(m in e)this.add(e,m,c||e[m],y?y+u:u,r,s);else if(m!=="parseTransform"){nm(m,u);continue}v||(m in a?S.push(m,0,a[m]):typeof e[m]=="function"?S.push(m,2,e[m]()):S.push(m,1,c||e[m])),o.push(m)}}w&&ay(this)},render:function(e,t){if(t.tween._time||!dm())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Fr,aliases:hr,getSetter:function(e,t,i){var r=hr[t];return r&&r.indexOf(",")<0&&(t=r),t in Zr&&t!==ui&&(e._gsap.x||Fr(e,"x"))?i&&W_===i?t==="scale"?xA:vA:(W_=i||{})&&(t==="scale"?yA:SA):e.style&&!Qp(e.style[t])?_A:~t.indexOf("-")?gA:um(e,t)},core:{_removeProperty:Is,_getMatrix:mm}};di.utils.checkPrefix=Ca;di.core.getStyleSaver=hy;(function(n,e,t,i){var r=li(n+","+e+","+t,function(s){Zr[s]=1});li(e,function(s){Ri.units[s]="deg",_y[s]=1}),hr[r[13]]=n+","+e,li(i,function(s){var o=s.split(":");hr[o[1]]=r[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");li("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(n){Ri.units[n]="px"});di.registerPlugin(xy);var Bn=di.registerPlugin(xy)||di;Bn.core.Tween;function LA(n,e){for(var t=0;t<e.length;t++){var i=e[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}function IA(n,e,t){return e&&LA(n.prototype,e),n}var Cn,tu,Ei,Ms,bs,pa,yy,Zs,ma,Sy,zr,Yi,My,by=function(){return Cn||typeof window<"u"&&(Cn=window.gsap)&&Cn.registerPlugin&&Cn},Ey=1,ra=[],ct=[],gr=[],xl=Date.now,gd=function(e,t){return t},NA=function(){var e=ma.core,t=e.bridge||{},i=e._scrollers,r=e._proxies;i.push.apply(i,ct),r.push.apply(r,gr),ct=i,gr=r,gd=function(o,a){return t[o](a)}},Ps=function(e,t){return~gr.indexOf(e)&&gr[gr.indexOf(e)+1][t]},yl=function(e){return!!~Sy.indexOf(e)},Yn=function(e,t,i,r,s){return e.addEventListener(t,i,{passive:r!==!1,capture:!!s})},$n=function(e,t,i,r){return e.removeEventListener(t,i,!!r)},hc="scrollLeft",dc="scrollTop",vd=function(){return zr&&zr.isPressed||ct.cache++},Uu=function(e,t){var i=function r(s){if(s||s===0){Ey&&(Ei.history.scrollRestoration="manual");var o=zr&&zr.isPressed;s=r.v=Math.round(s)||(zr&&zr.iOS?1:0),e(s),r.cacheID=ct.cache,o&&gd("ss",s)}else(t||ct.cache!==r.cacheID||gd("ref"))&&(r.cacheID=ct.cache,r.v=e());return r.v+r.offset};return i.offset=0,e&&i},ti={s:hc,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:Uu(function(n){return arguments.length?Ei.scrollTo(n,mn.sc()):Ei.pageXOffset||Ms[hc]||bs[hc]||pa[hc]||0})},mn={s:dc,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:ti,sc:Uu(function(n){return arguments.length?Ei.scrollTo(ti.sc(),n):Ei.pageYOffset||Ms[dc]||bs[dc]||pa[dc]||0})},ri=function(e,t){return(t&&t._ctx&&t._ctx.selector||Cn.utils.toArray)(e)[0]||(typeof e=="string"&&Cn.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},UA=function(e,t){for(var i=t.length;i--;)if(t[i]===e||t[i].contains(e))return!0;return!1},Us=function(e,t){var i=t.s,r=t.sc;yl(e)&&(e=Ms.scrollingElement||bs);var s=ct.indexOf(e),o=r===mn.sc?1:2;!~s&&(s=ct.push(e)-1),ct[s+o]||Yn(e,"scroll",vd);var a=ct[s+o],l=a||(ct[s+o]=Uu(Ps(e,i),!0)||(yl(e)?r:Uu(function(c){return arguments.length?e[i]=c:e[i]})));return l.target=e,a||(l.smooth=Cn.getProperty(e,"scrollBehavior")==="smooth"),l},xd=function(e,t,i){var r=e,s=e,o=xl(),a=o,l=t||50,c=Math.max(500,l*3),u=function(p,m){var _=xl();m||_-o>l?(s=r,r=p,a=o,o=_):i?r+=p:r=s+(p-s)/(_-a)*(o-a)},h=function(){s=r=i?0:r,a=o=0},f=function(p){var m=a,_=s,g=xl();return(p||p===0)&&p!==r&&u(p),o===a||g-a>c?0:(r+(i?_:-_))/((i?g:o)-m)*1e3};return{update:u,reset:h,getVelocity:f}},Wa=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},Q_=function(e){var t=Math.max.apply(Math,e),i=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(i)?t:i},Ty=function(){ma=Cn.core.globals().ScrollTrigger,ma&&ma.core&&NA()},wy=function(e){return Cn=e||by(),!tu&&Cn&&typeof document<"u"&&document.body&&(Ei=window,Ms=document,bs=Ms.documentElement,pa=Ms.body,Sy=[Ei,Ms,bs,pa],Cn.utils.clamp,My=Cn.core.context||function(){},Zs="onpointerenter"in pa?"pointer":"mouse",yy=Qt.isTouch=Ei.matchMedia&&Ei.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Ei||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Yi=Qt.eventTypes=("ontouchstart"in bs?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in bs?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return Ey=0},500),tu=1),ma||Ty(),tu};ti.op=mn;ct.cache=0;var Qt=(function(){function n(t){this.init(t)}var e=n.prototype;return e.init=function(i){tu||wy(Cn)||console.warn("Please gsap.registerPlugin(Observer)"),ma||Ty();var r=i.tolerance,s=i.dragMinimum,o=i.type,a=i.target,l=i.lineHeight,c=i.debounce,u=i.preventDefault,h=i.onStop,f=i.onStopDelay,d=i.ignore,p=i.wheelSpeed,m=i.event,_=i.onDragStart,g=i.onDragEnd,y=i.onDrag,v=i.onPress,x=i.onRelease,b=i.onRight,T=i.onLeft,w=i.onUp,S=i.onDown,E=i.onChangeX,A=i.onChangeY,D=i.onChange,L=i.onToggleX,H=i.onToggleY,z=i.onHover,k=i.onHoverEnd,B=i.onMove,U=i.ignoreCheck,G=i.isNormalizer,ee=i.onGestureStart,F=i.onGestureEnd,ve=i.onWheel,Te=i.onEnable,$e=i.onDisable,Ge=i.onClick,Oe=i.scrollSpeed,Y=i.capture,ce=i.allowClicks,ue=i.lockAxis,Ce=i.onLockAxis;this.target=a=ri(a)||bs,this.vars=i,d&&(d=Cn.utils.toArray(d)),r=r||1e-9,s=s||0,p=p||1,Oe=Oe||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Ei.getComputedStyle(pa).lineHeight)||22);var Fe,Le,ke,P,O,q,$,N=this,Z=0,fe=0,I=i.passive||!u&&i.passive!==!1,se=Us(a,ti),ne=Us(a,mn),xe=se(),K=ne(),_e=~o.indexOf("touch")&&!~o.indexOf("pointer")&&Yi[0]==="pointerdown",R=yl(a),M=a.ownerDocument||Ms,W=[0,0,0],J=[0,0,0],oe=0,me=function(){return oe=xl()},de=function(Ae,qe){return(N.event=Ae)&&d&&UA(Ae.target,d)||qe&&_e&&Ae.pointerType!=="touch"||U&&U(Ae,qe)},re=function(){N._vx.reset(),N._vy.reset(),Le.pause(),h&&h(N)},le=function(){var Ae=N.deltaX=Q_(W),qe=N.deltaY=Q_(J),Me=Math.abs(Ae)>=r,Ye=Math.abs(qe)>=r;D&&(Me||Ye)&&D(N,Ae,qe,W,J),Me&&(b&&N.deltaX>0&&b(N),T&&N.deltaX<0&&T(N),E&&E(N),L&&N.deltaX<0!=Z<0&&L(N),Z=N.deltaX,W[0]=W[1]=W[2]=0),Ye&&(S&&N.deltaY>0&&S(N),w&&N.deltaY<0&&w(N),A&&A(N),H&&N.deltaY<0!=fe<0&&H(N),fe=N.deltaY,J[0]=J[1]=J[2]=0),(P||ke)&&(B&&B(N),ke&&(_&&ke===1&&_(N),y&&y(N),ke=0),P=!1),q&&!(q=!1)&&Ce&&Ce(N),O&&(ve(N),O=!1),Fe=0},Ee=function(Ae,qe,Me){W[Me]+=Ae,J[Me]+=qe,N._vx.update(Ae),N._vy.update(qe),c?Fe||(Fe=requestAnimationFrame(le)):le()},he=function(Ae,qe){ue&&!$&&(N.axis=$=Math.abs(Ae)>Math.abs(qe)?"x":"y",q=!0),$!=="y"&&(W[2]+=Ae,N._vx.update(Ae,!0)),$!=="x"&&(J[2]+=qe,N._vy.update(qe,!0)),c?Fe||(Fe=requestAnimationFrame(le)):le()},pe=function(Ae){if(!de(Ae,1)){Ae=Wa(Ae,u);var qe=Ae.clientX,Me=Ae.clientY,Ye=qe-N.x,ze=Me-N.y,Qe=N.isDragging;N.x=qe,N.y=Me,(Qe||(Ye||ze)&&(Math.abs(N.startX-qe)>=s||Math.abs(N.startY-Me)>=s))&&(ke||(ke=Qe?2:1),Qe||(N.isDragging=!0),he(Ye,ze))}},ye=N.onPress=function(be){de(be,1)||be&&be.button||(N.axis=$=null,Le.pause(),N.isPressed=!0,be=Wa(be),Z=fe=0,N.startX=N.x=be.clientX,N.startY=N.y=be.clientY,N._vx.reset(),N._vy.reset(),Yn(G?a:M,Yi[1],pe,I,!0),N.deltaX=N.deltaY=0,v&&v(N))},Re=N.onRelease=function(be){if(!de(be,1)){$n(G?a:M,Yi[1],pe,!0);var Ae=!isNaN(N.y-N.startY),qe=N.isDragging,Me=qe&&(Math.abs(N.x-N.startX)>3||Math.abs(N.y-N.startY)>3),Ye=Wa(be);!Me&&Ae&&(N._vx.reset(),N._vy.reset(),u&&ce&&Cn.delayedCall(.08,function(){if(xl()-oe>300&&!be.defaultPrevented){if(be.target.click)be.target.click();else if(M.createEvent){var ze=M.createEvent("MouseEvents");ze.initMouseEvent("click",!0,!0,Ei,1,Ye.screenX,Ye.screenY,Ye.clientX,Ye.clientY,!1,!1,!1,!1,0,null),be.target.dispatchEvent(ze)}}})),N.isDragging=N.isGesturing=N.isPressed=!1,h&&qe&&!G&&Le.restart(!0),ke&&le(),g&&qe&&g(N),x&&x(N,Me)}},je=function(Ae){return Ae.touches&&Ae.touches.length>1&&(N.isGesturing=!0)&&ee(Ae,N.isDragging)},Ze=function(){return(N.isGesturing=!1)||F(N)},V=function(Ae){if(!de(Ae)){var qe=se(),Me=ne();Ee((qe-xe)*Oe,(Me-K)*Oe,1),xe=qe,K=Me,h&&Le.restart(!0)}},Se=function(Ae){if(!de(Ae)){Ae=Wa(Ae,u),ve&&(O=!0);var qe=(Ae.deltaMode===1?l:Ae.deltaMode===2?Ei.innerHeight:1)*p;Ee(Ae.deltaX*qe,Ae.deltaY*qe,0),h&&!G&&Le.restart(!0)}},ae=function(Ae){if(!de(Ae)){var qe=Ae.clientX,Me=Ae.clientY,Ye=qe-N.x,ze=Me-N.y;N.x=qe,N.y=Me,P=!0,h&&Le.restart(!0),(Ye||ze)&&he(Ye,ze)}},Pe=function(Ae){N.event=Ae,z(N)},we=function(Ae){N.event=Ae,k(N)},ge=function(Ae){return de(Ae)||Wa(Ae,u)&&Ge(N)};Le=N._dc=Cn.delayedCall(f||.25,re).pause(),N.deltaX=N.deltaY=0,N._vx=xd(0,50,!0),N._vy=xd(0,50,!0),N.scrollX=se,N.scrollY=ne,N.isDragging=N.isGesturing=N.isPressed=!1,My(this),N.enable=function(be){return N.isEnabled||(Yn(R?M:a,"scroll",vd),o.indexOf("scroll")>=0&&Yn(R?M:a,"scroll",V,I,Y),o.indexOf("wheel")>=0&&Yn(a,"wheel",Se,I,Y),(o.indexOf("touch")>=0&&yy||o.indexOf("pointer")>=0)&&(Yn(a,Yi[0],ye,I,Y),Yn(M,Yi[2],Re),Yn(M,Yi[3],Re),ce&&Yn(a,"click",me,!0,!0),Ge&&Yn(a,"click",ge),ee&&Yn(M,"gesturestart",je),F&&Yn(M,"gestureend",Ze),z&&Yn(a,Zs+"enter",Pe),k&&Yn(a,Zs+"leave",we),B&&Yn(a,Zs+"move",ae)),N.isEnabled=!0,N.isDragging=N.isGesturing=N.isPressed=P=ke=!1,N._vx.reset(),N._vy.reset(),xe=se(),K=ne(),be&&be.type&&ye(be),Te&&Te(N)),N},N.disable=function(){N.isEnabled&&(ra.filter(function(be){return be!==N&&yl(be.target)}).length||$n(R?M:a,"scroll",vd),N.isPressed&&(N._vx.reset(),N._vy.reset(),$n(G?a:M,Yi[1],pe,!0)),$n(R?M:a,"scroll",V,Y),$n(a,"wheel",Se,Y),$n(a,Yi[0],ye,Y),$n(M,Yi[2],Re),$n(M,Yi[3],Re),$n(a,"click",me,!0),$n(a,"click",ge),$n(M,"gesturestart",je),$n(M,"gestureend",Ze),$n(a,Zs+"enter",Pe),$n(a,Zs+"leave",we),$n(a,Zs+"move",ae),N.isEnabled=N.isPressed=N.isDragging=!1,$e&&$e(N))},N.kill=N.revert=function(){N.disable();var be=ra.indexOf(N);be>=0&&ra.splice(be,1),zr===N&&(zr=0)},ra.push(N),G&&yl(a)&&(zr=N),N.enable(m)},IA(n,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),n})();Qt.version="3.15.0";Qt.create=function(n){return new Qt(n)};Qt.register=wy;Qt.getAll=function(){return ra.slice()};Qt.getById=function(n){return ra.filter(function(e){return e.vars.id===n})[0]};by()&&Cn.registerPlugin(Qt);var He,Qo,lt,Et,Mi,vt,_m,Fu,Gl,Sl,il,pc,Fn,mf,yd,Jn,eg,tg,ea,Ay,$f,Ry,Zn,Sd,Cy,Py,hs,Md,gm,_a,vm,Ml,bd,qf,mc=1,On=Date.now,Yf=On(),Wi=0,rl=0,ng=function(e,t,i){var r=xi(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return i["_"+t+"Clamp"]=r,r?e.substr(6,e.length-7):e},ig=function(e,t){return t&&(!xi(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},FA=function n(){return rl&&requestAnimationFrame(n)},rg=function(){return mf=1},sg=function(){return mf=0},lr=function(e){return e},sl=function(e){return Math.round(e*1e5)/1e5||0},Dy=function(){return typeof window<"u"},Ly=function(){return He||Dy()&&(He=window.gsap)&&He.registerPlugin&&He},So=function(e){return!!~_m.indexOf(e)},Iy=function(e){return(e==="Height"?vm:lt["inner"+e])||Mi["client"+e]||vt["client"+e]},Ny=function(e){return Ps(e,"getBoundingClientRect")||(So(e)?function(){return ou.width=lt.innerWidth,ou.height=vm,ou}:function(){return Br(e)})},OA=function(e,t,i){var r=i.d,s=i.d2,o=i.a;return(o=Ps(e,"getBoundingClientRect"))?function(){return o()[r]}:function(){return(t?Iy(s):e["client"+s])||0}},BA=function(e,t){return!t||~gr.indexOf(e)?Ny(e):function(){return ou}},dr=function(e,t){var i=t.s,r=t.d2,s=t.d,o=t.a;return Math.max(0,(i="scroll"+r)&&(o=Ps(e,i))?o()-Ny(e)()[s]:So(e)?(Mi[i]||vt[i])-Iy(r):e[i]-e["offset"+r])},_c=function(e,t){for(var i=0;i<ea.length;i+=3)(!t||~t.indexOf(ea[i+1]))&&e(ea[i],ea[i+1],ea[i+2])},xi=function(e){return typeof e=="string"},Vn=function(e){return typeof e=="function"},ol=function(e){return typeof e=="number"},Js=function(e){return typeof e=="object"},Xa=function(e,t,i){return e&&e.progress(t?0:1)&&i&&e.pause()},Uo=function(e,t,i){if(e.enabled){var r=e._ctx?e._ctx.add(function(){return t(e,i)}):t(e,i);r&&r.totalTime&&(e.callbackAnimation=r)}},Fo=Math.abs,Uy="left",Fy="top",xm="right",ym="bottom",go="width",vo="height",bl="Right",El="Left",Tl="Top",wl="Bottom",on="padding",Bi="margin",Pa="Width",Sm="Height",hn="px",ki=function(e){return lt.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},kA=function(e){var t=ki(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},og=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},Br=function(e,t){var i=t&&ki(e)[yd]!=="matrix(1, 0, 0, 1, 0, 0)"&&He.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),r=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return i&&i.progress(0).kill(),r},Ou=function(e,t){var i=t.d2;return e["offset"+i]||e["client"+i]||0},Oy=function(e){var t=[],i=e.labels,r=e.duration(),s;for(s in i)t.push(i[s]/r);return t},HA=function(e){return function(t){return He.utils.snap(Oy(e),t)}},Mm=function(e){var t=He.utils.snap(e),i=Array.isArray(e)&&e.slice(0).sort(function(r,s){return r-s});return i?function(r,s,o){o===void 0&&(o=.001);var a;if(!s)return t(r);if(s>0){for(r-=o,a=0;a<i.length;a++)if(i[a]>=r)return i[a];return i[a-1]}else for(a=i.length,r+=o;a--;)if(i[a]<=r)return i[a];return i[0]}:function(r,s,o){o===void 0&&(o=.001);var a=t(r);return!s||Math.abs(a-r)<o||a-r<0==s<0?a:t(s<0?r-e:r+e)}},zA=function(e){return function(t,i){return Mm(Oy(e))(t,i.direction)}},gc=function(e,t,i,r){return i.split(",").forEach(function(s){return e(t,s,r)})},En=function(e,t,i,r,s){return e.addEventListener(t,i,{passive:!r,capture:!!s})},bn=function(e,t,i,r){return e.removeEventListener(t,i,!!r)},vc=function(e,t,i){i=i&&i.wheelHandler,i&&(e(t,"wheel",i),e(t,"touchmove",i))},ag={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},xc={toggleActions:"play",anticipatePin:0},Bu={top:0,left:0,center:.5,bottom:1,right:1},nu=function(e,t){if(xi(e)){var i=e.indexOf("="),r=~i?+(e.charAt(i-1)+1)*parseFloat(e.substr(i+1)):0;~i&&(e.indexOf("%")>i&&(r*=t/100),e=e.substr(0,i-1)),e=r+(e in Bu?Bu[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},yc=function(e,t,i,r,s,o,a,l){var c=s.startColor,u=s.endColor,h=s.fontSize,f=s.indent,d=s.fontWeight,p=Et.createElement("div"),m=So(i)||Ps(i,"pinType")==="fixed",_=e.indexOf("scroller")!==-1,g=m?vt:i.tagName==="IFRAME"?i.contentDocument.body:i,y=e.indexOf("start")!==-1,v=y?c:u,x="border-color:"+v+";font-size:"+h+";color:"+v+";font-weight:"+d+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return x+="position:"+((_||l)&&m?"fixed;":"absolute;"),(_||l||!m)&&(x+=(r===mn?xm:ym)+":"+(o+parseFloat(f))+"px;"),a&&(x+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),p._isStart=y,p.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),p.style.cssText=x,p.innerText=t||t===0?e+"-"+t:e,g.children[0]?g.insertBefore(p,g.children[0]):g.appendChild(p),p._offset=p["offset"+r.op.d2],iu(p,0,r,y),p},iu=function(e,t,i,r){var s={display:"block"},o=i[r?"os2":"p2"],a=i[r?"p2":"os2"];e._isFlipped=r,s[i.a+"Percent"]=r?-100:0,s[i.a]=r?"1px":0,s["border"+o+Pa]=1,s["border"+a+Pa]=0,s[i.p]=t+"px",He.set(e,s)},ot=[],Ed={},Wl,lg=function(){return On()-Wi>34&&(Wl||(Wl=requestAnimationFrame(Gr)))},Oo=function(){(!Zn||!Zn.isPressed||Zn.startX>vt.clientWidth)&&(ct.cache++,Zn?Wl||(Wl=requestAnimationFrame(Gr)):Gr(),Wi||bo("scrollStart"),Wi=On())},jf=function(){Py=lt.innerWidth,Cy=lt.innerHeight},al=function(e){ct.cache++,(e===!0||!Fn&&!Ry&&!Et.fullscreenElement&&!Et.webkitFullscreenElement&&(!Sd||Py!==lt.innerWidth||Math.abs(lt.innerHeight-Cy)>lt.innerHeight*.25))&&Fu.restart(!0)},Mo={},VA=[],By=function n(){return bn(rt,"scrollEnd",n)||ro(!0)},bo=function(e){return Mo[e]&&Mo[e].map(function(t){return t()})||VA},vi=[],ky=function(e){for(var t=0;t<vi.length;t+=5)(!e||vi[t+4]&&vi[t+4].query===e)&&(vi[t].style.cssText=vi[t+1],vi[t].getBBox&&vi[t].setAttribute("transform",vi[t+2]||""),vi[t+3].uncache=1)},Hy=function(){return ct.forEach(function(e){return Vn(e)&&++e.cacheID&&(e.rec=e())})},bm=function(e,t){var i;for(Jn=0;Jn<ot.length;Jn++)i=ot[Jn],i&&(!t||i._ctx===t)&&(e?i.kill(1):i.revert(!0,!0));Ml=!0,t&&ky(t),t||bo("revert")},zy=function(e,t){ct.cache++,(t||!Qn)&&ct.forEach(function(i){return Vn(i)&&i.cacheID++&&(i.rec=0)}),xi(e)&&(lt.history.scrollRestoration=gm=e)},Qn,xo=0,cg,GA=function(){if(cg!==xo){var e=cg=xo;requestAnimationFrame(function(){return e===xo&&ro(!0)})}},Vy=function(){vt.appendChild(_a),vm=!Zn&&_a.offsetHeight||lt.innerHeight,vt.removeChild(_a)},ug=function(e){return Gl(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},ro=function(e,t){if(Mi=Et.documentElement,vt=Et.body,_m=[lt,Et,Mi,vt],Wi&&!e&&!Ml){En(rt,"scrollEnd",By);return}Vy(),Qn=rt.isRefreshing=!0,Ml||Hy();var i=bo("refreshInit");Ay&&rt.sort(),t||bm(),ct.forEach(function(r){Vn(r)&&(r.smooth&&(r.target.style.scrollBehavior="auto"),r(0))}),ot.slice(0).forEach(function(r){return r.refresh()}),Ml=!1,ot.forEach(function(r){if(r._subPinOffset&&r.pin){var s=r.vars.horizontal?"offsetWidth":"offsetHeight",o=r.pin[s];r.revert(!0,1),r.adjustPinSpacing(r.pin[s]-o),r.refresh()}}),bd=1,ug(!0),ot.forEach(function(r){var s=dr(r.scroller,r._dir),o=r.vars.end==="max"||r._endClamp&&r.end>s,a=r._startClamp&&r.start>=s;(o||a)&&r.setPositions(a?s-1:r.start,o?Math.max(a?s:r.start+1,s):r.end,!0)}),ug(!1),bd=0,i.forEach(function(r){return r&&r.render&&r.render(-1)}),ct.forEach(function(r){Vn(r)&&(r.smooth&&requestAnimationFrame(function(){return r.target.style.scrollBehavior="smooth"}),r.rec&&r(r.rec))}),zy(gm,1),Fu.pause(),xo++,Qn=2,Gr(2),ot.forEach(function(r){return Vn(r.vars.onRefresh)&&r.vars.onRefresh(r)}),Qn=rt.isRefreshing=!1,bo("refresh")},Td=0,ru=1,Al,Gr=function(e){if(e===2||!Qn&&!Ml){rt.isUpdating=!0,Al&&Al.update(0);var t=ot.length,i=On(),r=i-Yf>=50,s=t&&ot[0].scroll();if(ru=Td>s?-1:1,Qn||(Td=s),r&&(Wi&&!mf&&i-Wi>200&&(Wi=0,bo("scrollEnd")),il=Yf,Yf=i),ru<0){for(Jn=t;Jn-- >0;)ot[Jn]&&ot[Jn].update(0,r);ru=1}else for(Jn=0;Jn<t;Jn++)ot[Jn]&&ot[Jn].update(0,r);rt.isUpdating=!1}Wl=0},wd=[Uy,Fy,ym,xm,Bi+wl,Bi+bl,Bi+Tl,Bi+El,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],su=wd.concat([go,vo,"boxSizing","max"+Pa,"max"+Sm,"position",Bi,on,on+Tl,on+bl,on+wl,on+El]),WA=function(e,t,i){ga(i);var r=e._gsap;if(r.spacerIsNative)ga(r.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},Kf=function(e,t,i,r){if(!e._gsap.swappedIn){for(var s=wd.length,o=t.style,a=e.style,l;s--;)l=wd[s],o[l]=i[l];o.position=i.position==="absolute"?"absolute":"relative",i.display==="inline"&&(o.display="inline-block"),a[ym]=a[xm]="auto",o.flexBasis=i.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[go]=Ou(e,ti)+hn,o[vo]=Ou(e,mn)+hn,o[on]=a[Bi]=a[Fy]=a[Uy]="0",ga(r),a[go]=a["max"+Pa]=i[go],a[vo]=a["max"+Sm]=i[vo],a[on]=i[on],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},XA=/([A-Z])/g,ga=function(e){if(e){var t=e.t.style,i=e.length,r=0,s,o;for((e.t._gsap||He.core.getCache(e.t)).uncache=1;r<i;r+=2)o=e[r+1],s=e[r],o?t[s]=o:t[s]&&t.removeProperty(s.replace(XA,"-$1").toLowerCase())}},Sc=function(e){for(var t=su.length,i=e.style,r=[],s=0;s<t;s++)r.push(su[s],i[su[s]]);return r.t=e,r},$A=function(e,t,i){for(var r=[],s=e.length,o=i?8:0,a;o<s;o+=2)a=e[o],r.push(a,a in t?t[a]:e[o+1]);return r.t=e.t,r},ou={left:0,top:0},fg=function(e,t,i,r,s,o,a,l,c,u,h,f,d,p){Vn(e)&&(e=e(l)),xi(e)&&e.substr(0,3)==="max"&&(e=f+(e.charAt(4)==="="?nu("0"+e.substr(3),i):0));var m=d?d.time():0,_,g,y;if(d&&d.seek(0),isNaN(e)||(e=+e),ol(e))d&&(e=He.utils.mapRange(d.scrollTrigger.start,d.scrollTrigger.end,0,f,e)),a&&iu(a,i,r,!0);else{Vn(t)&&(t=t(l));var v=(e||"0").split(" "),x,b,T,w;y=ri(t,l)||vt,x=Br(y)||{},(!x||!x.left&&!x.top)&&ki(y).display==="none"&&(w=y.style.display,y.style.display="block",x=Br(y),w?y.style.display=w:y.style.removeProperty("display")),b=nu(v[0],x[r.d]),T=nu(v[1]||"0",i),e=x[r.p]-c[r.p]-u+b+s-T,a&&iu(a,T,r,i-T<20||a._isStart&&T>20),i-=i-T}if(p&&(l[p]=e||-.001,e<0&&(e=0)),o){var S=e+i,E=o._isStart;_="scroll"+r.d2,iu(o,S,r,E&&S>20||!E&&(h?Math.max(vt[_],Mi[_]):o.parentNode[_])<=S+1),h&&(c=Br(a),h&&(o.style[r.op.p]=c[r.op.p]-r.op.m-o._offset+hn))}return d&&y&&(_=Br(y),d.seek(f),g=Br(y),d._caScrollDist=_[r.p]-g[r.p],e=e/d._caScrollDist*f),d&&d.seek(m),d?e:Math.round(e)},qA=/(webkit|moz|length|cssText|inset)/i,hg=function(e,t,i,r){if(e.parentNode!==t){var s=e.style,o,a;if(t===vt){e._stOrig=s.cssText,a=ki(e);for(o in a)!+o&&!qA.test(o)&&a[o]&&typeof s[o]=="string"&&o!=="0"&&(s[o]=a[o]);s.top=i,s.left=r}else s.cssText=e._stOrig;He.core.getCache(e).uncache=1,t.appendChild(e)}},Gy=function(e,t,i){var r=t,s=r;return function(o){var a=Math.round(e());return a!==r&&a!==s&&Math.abs(a-r)>3&&Math.abs(a-s)>3&&(o=a,i&&i()),s=r,r=Math.round(o),r}},Mc=function(e,t,i){var r={};r[t.p]="+="+i,He.set(e,r)},dg=function(e,t){var i=Us(e,t),r="_scroll"+t.p2,s=function o(a,l,c,u,h){var f=o.tween,d=l.onComplete,p={};c=c||i();var m=Gy(i,c,function(){f.kill(),o.tween=0});return h=u&&h||0,u=u||a-c,f&&f.kill(),l[r]=a,l.inherit=!1,l.modifiers=p,p[r]=function(){return m(c+u*f.ratio+h*f.ratio*f.ratio)},l.onUpdate=function(){ct.cache++,o.tween&&Gr()},l.onComplete=function(){o.tween=0,d&&d.call(f)},f=o.tween=He.to(e,l),f};return e[r]=i,i.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},En(e,"wheel",i.wheelHandler),rt.isTouch&&En(e,"touchmove",i.wheelHandler),s},rt=(function(){function n(t,i){Qo||n.register(He)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),Md(this),this.init(t,i)}var e=n.prototype;return e.init=function(i,r){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!rl){this.update=this.refresh=this.kill=lr;return}i=og(xi(i)||ol(i)||i.nodeType?{trigger:i}:i,xc);var s=i,o=s.onUpdate,a=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,h=s.scrub,f=s.trigger,d=s.pin,p=s.pinSpacing,m=s.invalidateOnRefresh,_=s.anticipatePin,g=s.onScrubComplete,y=s.onSnapComplete,v=s.once,x=s.snap,b=s.pinReparent,T=s.pinSpacer,w=s.containerAnimation,S=s.fastScrollEnd,E=s.preventOverlaps,A=i.horizontal||i.containerAnimation&&i.horizontal!==!1?ti:mn,D=!h&&h!==0,L=ri(i.scroller||lt),H=He.core.getCache(L),z=So(L),k=("pinType"in i?i.pinType:Ps(L,"pinType")||z&&"fixed")==="fixed",B=[i.onEnter,i.onLeave,i.onEnterBack,i.onLeaveBack],U=D&&i.toggleActions.split(" "),G="markers"in i?i.markers:xc.markers,ee=z?0:parseFloat(ki(L)["border"+A.p2+Pa])||0,F=this,ve=i.onRefreshInit&&function(){return i.onRefreshInit(F)},Te=OA(L,z,A),$e=BA(L,z),Ge=0,Oe=0,Y=0,ce=Us(L,A),ue,Ce,Fe,Le,ke,P,O,q,$,N,Z,fe,I,se,ne,xe,K,_e,R,M,W,J,oe,me,de,re,le,Ee,he,pe,ye,Re,je,Ze,V,Se,ae,Pe,we;if(F._startClamp=F._endClamp=!1,F._dir=A,_*=45,F.scroller=L,F.scroll=w?w.time.bind(w):ce,Le=ce(),F.vars=i,r=r||i.animation,"refreshPriority"in i&&(Ay=1,i.refreshPriority===-9999&&(Al=F)),H.tweenScroll=H.tweenScroll||{top:dg(L,mn),left:dg(L,ti)},F.tweenTo=ue=H.tweenScroll[A.p],F.scrubDuration=function(Me){je=ol(Me)&&Me,je?Re?Re.duration(Me):Re=He.to(r,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:je,paused:!0,onComplete:function(){return g&&g(F)}}):(Re&&Re.progress(1).kill(),Re=0)},r&&(r.vars.lazy=!1,r._initted&&!F.isReverted||r.vars.immediateRender!==!1&&i.immediateRender!==!1&&r.duration()&&r.render(0,!0,!0),F.animation=r.pause(),r.scrollTrigger=F,F.scrubDuration(h),pe=0,l||(l=r.vars.id)),x&&((!Js(x)||x.push)&&(x={snapTo:x}),"scrollBehavior"in vt.style&&He.set(z?[vt,Mi]:L,{scrollBehavior:"auto"}),ct.forEach(function(Me){return Vn(Me)&&Me.target===(z?Et.scrollingElement||Mi:L)&&(Me.smooth=!1)}),Fe=Vn(x.snapTo)?x.snapTo:x.snapTo==="labels"?HA(r):x.snapTo==="labelsDirectional"?zA(r):x.directional!==!1?function(Me,Ye){return Mm(x.snapTo)(Me,On()-Oe<500?0:Ye.direction)}:He.utils.snap(x.snapTo),Ze=x.duration||{min:.1,max:2},Ze=Js(Ze)?Sl(Ze.min,Ze.max):Sl(Ze,Ze),V=He.delayedCall(x.delay||je/2||.1,function(){var Me=ce(),Ye=On()-Oe<500,ze=ue.tween;if((Ye||Math.abs(F.getVelocity())<10)&&!ze&&!mf&&Ge!==Me){var Qe=(Me-P)/se,nn=r&&!D?r.totalProgress():Qe,at=Ye?0:(nn-ye)/(On()-il)*1e3||0,Ht=He.utils.clamp(-Qe,1-Qe,Fo(at/2)*at/.185),zt=Qe+(x.inertia===!1?0:Ht),Ut,Ct,gt=x,Ln=gt.onStart,Ft=gt.onInterrupt,xn=gt.onComplete;if(Ut=Fe(zt,F),ol(Ut)||(Ut=zt),Ct=Math.max(0,Math.round(P+Ut*se)),Me<=O&&Me>=P&&Ct!==Me){if(ze&&!ze._initted&&ze.data<=Fo(Ct-Me))return;x.inertia===!1&&(Ht=Ut-Qe),ue(Ct,{duration:Ze(Fo(Math.max(Fo(zt-nn),Fo(Ut-nn))*.185/at/.05||0)),ease:x.ease||"power3",data:Fo(Ct-Me),onInterrupt:function(){return V.restart(!0)&&Ft&&Uo(F,Ft)},onComplete:function(){F.update(),Ge=ce(),r&&!D&&(Re?Re.resetTo("totalProgress",Ut,r._tTime/r._tDur):r.progress(Ut)),pe=ye=r&&!D?r.totalProgress():F.progress,y&&y(F),xn&&Uo(F,xn)}},Me,Ht*se,Ct-Me-Ht*se),Ln&&Uo(F,Ln,ue.tween)}}else F.isActive&&Ge!==Me&&V.restart(!0)}).pause()),l&&(Ed[l]=F),f=F.trigger=ri(f||d!==!0&&d),we=f&&f._gsap&&f._gsap.stRevert,we&&(we=we(F)),d=d===!0?f:ri(d),xi(a)&&(a={targets:f,className:a}),d&&(p===!1||p===Bi||(p=!p&&d.parentNode&&d.parentNode.style&&ki(d.parentNode).display==="flex"?!1:on),F.pin=d,Ce=He.core.getCache(d),Ce.spacer?ne=Ce.pinState:(T&&(T=ri(T),T&&!T.nodeType&&(T=T.current||T.nativeElement),Ce.spacerIsNative=!!T,T&&(Ce.spacerState=Sc(T))),Ce.spacer=_e=T||Et.createElement("div"),_e.classList.add("pin-spacer"),l&&_e.classList.add("pin-spacer-"+l),Ce.pinState=ne=Sc(d)),i.force3D!==!1&&He.set(d,{force3D:!0}),F.spacer=_e=Ce.spacer,he=ki(d),me=he[p+A.os2],M=He.getProperty(d),W=He.quickSetter(d,A.a,hn),Kf(d,_e,he),K=Sc(d)),G){fe=Js(G)?og(G,ag):ag,N=yc("scroller-start",l,L,A,fe,0),Z=yc("scroller-end",l,L,A,fe,0,N),R=N["offset"+A.op.d2];var ge=ri(Ps(L,"content")||L);q=this.markerStart=yc("start",l,ge,A,fe,R,0,w),$=this.markerEnd=yc("end",l,ge,A,fe,R,0,w),w&&(Pe=He.quickSetter([q,$],A.a,hn)),!k&&!(gr.length&&Ps(L,"fixedMarkers")===!0)&&(kA(z?vt:L),He.set([N,Z],{force3D:!0}),re=He.quickSetter(N,A.a,hn),Ee=He.quickSetter(Z,A.a,hn))}if(w){var be=w.vars.onUpdate,Ae=w.vars.onUpdateParams;w.eventCallback("onUpdate",function(){F.update(0,0,1),be&&be.apply(w,Ae||[])})}if(F.previous=function(){return ot[ot.indexOf(F)-1]},F.next=function(){return ot[ot.indexOf(F)+1]},F.revert=function(Me,Ye){if(!Ye)return F.kill(!0);var ze=Me!==!1||!F.enabled,Qe=Fn;ze!==F.isReverted&&(ze&&(Se=Math.max(ce(),F.scroll.rec||0),Y=F.progress,ae=r&&r.progress()),q&&[q,$,N,Z].forEach(function(nn){return nn.style.display=ze?"none":"block"}),ze&&(Fn=F,F.update(ze)),d&&(!b||!F.isActive)&&(ze?WA(d,_e,ne):Kf(d,_e,ki(d),de)),ze||F.update(ze),Fn=Qe,F.isReverted=ze)},F.refresh=function(Me,Ye,ze,Qe){if(!((Fn||!F.enabled)&&!Ye)){if(d&&Me&&Wi){En(n,"scrollEnd",By);return}!Qn&&ve&&ve(F),Fn=F,ue.tween&&!ze&&(ue.tween.kill(),ue.tween=0),Re&&Re.pause(),m&&r&&(r.revert({kill:!1}).invalidate(),r.getChildren?r.getChildren(!0,!0,!1).forEach(function(Ie){return Ie.vars.immediateRender&&Ie.render(0,!0,!0)}):r.vars.immediateRender&&r.render(0,!0,!0)),F.isReverted||F.revert(!0,!0),F._subPinOffset=!1;var nn=Te(),at=$e(),Ht=w?w.duration():dr(L,A),zt=se<=.01||!se,Ut=0,Ct=Qe||0,gt=Js(ze)?ze.end:i.end,Ln=i.endTrigger||f,Ft=Js(ze)?ze.start:i.start||(i.start===0||!f?0:d?"0 0":"0 100%"),xn=F.pinnedContainer=i.pinnedContainer&&ri(i.pinnedContainer,F),pi=f&&Math.max(0,ot.indexOf(F))||0,rn=pi,fn,yn,wr,Co,Sn,Yt,Li,C,X,ie,j,Q,De;for(G&&Js(ze)&&(Q=He.getProperty(N,A.p),De=He.getProperty(Z,A.p));rn-- >0;)Yt=ot[rn],Yt.end||Yt.refresh(0,1)||(Fn=F),Li=Yt.pin,Li&&(Li===f||Li===d||Li===xn)&&!Yt.isReverted&&(ie||(ie=[]),ie.unshift(Yt),Yt.revert(!0,!0)),Yt!==ot[rn]&&(pi--,rn--);for(Vn(Ft)&&(Ft=Ft(F)),Ft=ng(Ft,"start",F),P=fg(Ft,f,nn,A,ce(),q,N,F,at,ee,k,Ht,w,F._startClamp&&"_startClamp")||(d?-.001:0),Vn(gt)&&(gt=gt(F)),xi(gt)&&!gt.indexOf("+=")&&(~gt.indexOf(" ")?gt=(xi(Ft)?Ft.split(" ")[0]:"")+gt:(Ut=nu(gt.substr(2),nn),gt=xi(Ft)?Ft:(w?He.utils.mapRange(0,w.duration(),w.scrollTrigger.start,w.scrollTrigger.end,P):P)+Ut,Ln=f)),gt=ng(gt,"end",F),O=Math.max(P,fg(gt||(Ln?"100% 0":Ht),Ln,nn,A,ce()+Ut,$,Z,F,at,ee,k,Ht,w,F._endClamp&&"_endClamp"))||-.001,Ut=0,rn=pi;rn--;)Yt=ot[rn]||{},Li=Yt.pin,Li&&Yt.start-Yt._pinPush<=P&&!w&&Yt.end>0&&(fn=Yt.end-(F._startClamp?Math.max(0,Yt.start):Yt.start),(Li===f&&Yt.start-Yt._pinPush<P||Li===xn)&&isNaN(Ft)&&(Ut+=fn*(1-Yt.progress)),Li===d&&(Ct+=fn));if(P+=Ut,O+=Ut,F._startClamp&&(F._startClamp+=Ut),F._endClamp&&!Qn&&(F._endClamp=O||-.001,O=Math.min(O,dr(L,A))),se=O-P||(P-=.01)&&.001,zt&&(Y=He.utils.clamp(0,1,He.utils.normalize(P,O,Se))),F._pinPush=Ct,q&&Ut&&(fn={},fn[A.a]="+="+Ut,xn&&(fn[A.p]="-="+ce()),He.set([q,$],fn)),d&&!(bd&&F.end>=dr(L,A)))fn=ki(d),Co=A===mn,wr=ce(),J=parseFloat(M(A.a))+Ct,!Ht&&O>1&&(j=(z?Et.scrollingElement||Mi:L).style,j={style:j,value:j["overflow"+A.a.toUpperCase()]},z&&ki(vt)["overflow"+A.a.toUpperCase()]!=="scroll"&&(j.style["overflow"+A.a.toUpperCase()]="scroll")),Kf(d,_e,fn),K=Sc(d),yn=Br(d,!0),C=k&&Us(L,Co?ti:mn)(),p?(de=[p+A.os2,se+Ct+hn],de.t=_e,rn=p===on?Ou(d,A)+se+Ct:0,rn&&(de.push(A.d,rn+hn),_e.style.flexBasis!=="auto"&&(_e.style.flexBasis=rn+hn)),ga(de),xn&&ot.forEach(function(Ie){Ie.pin===xn&&Ie.vars.pinSpacing!==!1&&(Ie._subPinOffset=!0)}),k&&ce(Se)):(rn=Ou(d,A),rn&&_e.style.flexBasis!=="auto"&&(_e.style.flexBasis=rn+hn)),k&&(Sn={top:yn.top+(Co?wr-P:C)+hn,left:yn.left+(Co?C:wr-P)+hn,boxSizing:"border-box",position:"fixed"},Sn[go]=Sn["max"+Pa]=Math.ceil(yn.width)+hn,Sn[vo]=Sn["max"+Sm]=Math.ceil(yn.height)+hn,Sn[Bi]=Sn[Bi+Tl]=Sn[Bi+bl]=Sn[Bi+wl]=Sn[Bi+El]="0",Sn[on]=fn[on],Sn[on+Tl]=fn[on+Tl],Sn[on+bl]=fn[on+bl],Sn[on+wl]=fn[on+wl],Sn[on+El]=fn[on+El],xe=$A(ne,Sn,b),Qn&&ce(0)),r?(X=r._initted,$f(1),r.render(r.duration(),!0,!0),oe=M(A.a)-J+se+Ct,le=Math.abs(se-oe)>1,k&&le&&xe.splice(xe.length-2,2),r.render(0,!0,!0),X||r.invalidate(!0),r.parent||r.totalTime(r.totalTime()),$f(0)):oe=se,j&&(j.value?j.style["overflow"+A.a.toUpperCase()]=j.value:j.style.removeProperty("overflow-"+A.a));else if(f&&ce()&&!w)for(yn=f.parentNode;yn&&yn!==vt;)yn._pinOffset&&(P-=yn._pinOffset,O-=yn._pinOffset),yn=yn.parentNode;ie&&ie.forEach(function(Ie){return Ie.revert(!1,!0)}),F.start=P,F.end=O,Le=ke=Qn?Se:ce(),!w&&!Qn&&(Le<Se&&ce(Se),F.scroll.rec=0),F.revert(!1,!0),Oe=On(),V&&(Ge=-1,V.restart(!0)),Fn=0,r&&D&&(r._initted||ae)&&r.progress()!==ae&&r.progress(ae||0,!0).render(r.time(),!0,!0),(zt||Y!==F.progress||w||m||r&&!r._initted)&&(r&&!D&&(r._initted||Y||r.vars.immediateRender!==!1)&&r.totalProgress(w&&P<-.001&&!Y?He.utils.normalize(P,O,0):Y,!0),F.progress=zt||(Le-P)/se===Y?0:Y),d&&p&&(_e._pinOffset=Math.round(F.progress*oe)),Re&&Re.invalidate(),isNaN(Q)||(Q-=He.getProperty(N,A.p),De-=He.getProperty(Z,A.p),Mc(N,A,Q),Mc(q,A,Q-(Qe||0)),Mc(Z,A,De),Mc($,A,De-(Qe||0))),zt&&!Qn&&F.update(),u&&!Qn&&!I&&(I=!0,u(F),I=!1)}},F.getVelocity=function(){return(ce()-ke)/(On()-il)*1e3||0},F.endAnimation=function(){Xa(F.callbackAnimation),r&&(Re?Re.progress(1):r.paused()?D||Xa(r,F.direction<0,1):Xa(r,r.reversed()))},F.labelToScroll=function(Me){return r&&r.labels&&(P||F.refresh()||P)+r.labels[Me]/r.duration()*se||0},F.getTrailing=function(Me){var Ye=ot.indexOf(F),ze=F.direction>0?ot.slice(0,Ye).reverse():ot.slice(Ye+1);return(xi(Me)?ze.filter(function(Qe){return Qe.vars.preventOverlaps===Me}):ze).filter(function(Qe){return F.direction>0?Qe.end<=P:Qe.start>=O})},F.update=function(Me,Ye,ze){if(!(w&&!ze&&!Me)){var Qe=Qn===!0?Se:F.scroll(),nn=Me?0:(Qe-P)/se,at=nn<0?0:nn>1?1:nn||0,Ht=F.progress,zt,Ut,Ct,gt,Ln,Ft,xn,pi;if(Ye&&(ke=Le,Le=w?ce():Qe,x&&(ye=pe,pe=r&&!D?r.totalProgress():at)),_&&d&&!Fn&&!mc&&Wi&&(!at&&P<Qe+(Qe-ke)/(On()-il)*_?at=1e-4:at===1&&O>Qe+(Qe-ke)/(On()-il)*_&&(at=.9999)),at!==Ht&&F.enabled){if(zt=F.isActive=!!at&&at<1,Ut=!!Ht&&Ht<1,Ft=zt!==Ut,Ln=Ft||!!at!=!!Ht,F.direction=at>Ht?1:-1,F.progress=at,Ln&&!Fn&&(Ct=at&&!Ht?0:at===1?1:Ht===1?2:3,D&&(gt=!Ft&&U[Ct+1]!=="none"&&U[Ct+1]||U[Ct],pi=r&&(gt==="complete"||gt==="reset"||gt in r))),E&&(Ft||pi)&&(pi||h||!r)&&(Vn(E)?E(F):F.getTrailing(E).forEach(function(wr){return wr.endAnimation()})),D||(Re&&!Fn&&!mc?(Re._dp._time-Re._start!==Re._time&&Re.render(Re._dp._time-Re._start),Re.resetTo?Re.resetTo("totalProgress",at,r._tTime/r._tDur):(Re.vars.totalProgress=at,Re.invalidate().restart())):r&&r.totalProgress(at,!!(Fn&&(Oe||Me)))),d){if(Me&&p&&(_e.style[p+A.os2]=me),!k)W(sl(J+oe*at));else if(Ln){if(xn=!Me&&at>Ht&&O+1>Qe&&Qe+1>=dr(L,A),b)if(!Me&&(zt||xn)){var rn=Br(d,!0),fn=Qe-P;hg(d,vt,rn.top+(A===mn?fn:0)+hn,rn.left+(A===mn?0:fn)+hn)}else hg(d,_e);ga(zt||xn?xe:K),le&&at<1&&zt||W(J+(at===1&&!xn?oe:0))}}x&&!ue.tween&&!Fn&&!mc&&V.restart(!0),a&&(Ft||v&&at&&(at<1||!qf))&&Gl(a.targets).forEach(function(wr){return wr.classList[zt||v?"add":"remove"](a.className)}),o&&!D&&!Me&&o(F),Ln&&!Fn?(D&&(pi&&(gt==="complete"?r.pause().totalProgress(1):gt==="reset"?r.restart(!0).pause():gt==="restart"?r.restart(!0):r[gt]()),o&&o(F)),(Ft||!qf)&&(c&&Ft&&Uo(F,c),B[Ct]&&Uo(F,B[Ct]),v&&(at===1?F.kill(!1,1):B[Ct]=0),Ft||(Ct=at===1?1:3,B[Ct]&&Uo(F,B[Ct]))),S&&!zt&&Math.abs(F.getVelocity())>(ol(S)?S:2500)&&(Xa(F.callbackAnimation),Re?Re.progress(1):Xa(r,gt==="reverse"?1:!at,1))):D&&o&&!Fn&&o(F)}if(Ee){var yn=w?Qe/w.duration()*(w._caScrollDist||0):Qe;re(yn+(N._isFlipped?1:0)),Ee(yn)}Pe&&Pe(-Qe/w.duration()*(w._caScrollDist||0))}},F.enable=function(Me,Ye){F.enabled||(F.enabled=!0,En(L,"resize",al),z||En(L,"scroll",Oo),ve&&En(n,"refreshInit",ve),Me!==!1&&(F.progress=Y=0,Le=ke=Ge=ce()),Ye!==!1&&F.refresh())},F.getTween=function(Me){return Me&&ue?ue.tween:Re},F.setPositions=function(Me,Ye,ze,Qe){if(w){var nn=w.scrollTrigger,at=w.duration(),Ht=nn.end-nn.start;Me=nn.start+Ht*Me/at,Ye=nn.start+Ht*Ye/at}F.refresh(!1,!1,{start:ig(Me,ze&&!!F._startClamp),end:ig(Ye,ze&&!!F._endClamp)},Qe),F.update()},F.adjustPinSpacing=function(Me){if(de&&Me){var Ye=de.indexOf(A.d)+1;de[Ye]=parseFloat(de[Ye])+Me+hn,de[1]=parseFloat(de[1])+Me+hn,ga(de)}},F.disable=function(Me,Ye){if(Me!==!1&&F.revert(!0,!0),F.enabled&&(F.enabled=F.isActive=!1,Ye||Re&&Re.pause(),Se=0,Ce&&(Ce.uncache=1),ve&&bn(n,"refreshInit",ve),V&&(V.pause(),ue.tween&&ue.tween.kill()&&(ue.tween=0)),!z)){for(var ze=ot.length;ze--;)if(ot[ze].scroller===L&&ot[ze]!==F)return;bn(L,"resize",al),z||bn(L,"scroll",Oo)}},F.kill=function(Me,Ye){F.disable(Me,Ye),Re&&!Ye&&Re.kill(),l&&delete Ed[l];var ze=ot.indexOf(F);ze>=0&&ot.splice(ze,1),ze===Jn&&ru>0&&Jn--,ze=0,ot.forEach(function(Qe){return Qe.scroller===F.scroller&&(ze=1)}),ze||Qn||(F.scroll.rec=0),r&&(r.scrollTrigger=null,Me&&r.revert({kill:!1}),Ye||r.kill()),q&&[q,$,N,Z].forEach(function(Qe){return Qe.parentNode&&Qe.parentNode.removeChild(Qe)}),Al===F&&(Al=0),d&&(Ce&&(Ce.uncache=1),ze=0,ot.forEach(function(Qe){return Qe.pin===d&&ze++}),ze||(Ce.spacer=0)),i.onKill&&i.onKill(F)},ot.push(F),F.enable(!1,!1),we&&we(F),r&&r.add&&!se){var qe=F.update;F.update=function(){F.update=qe,ct.cache++,P||O||F.refresh()},He.delayedCall(.01,F.update),se=.01,P=O=0}else F.refresh();d&&GA()},n.register=function(i){return Qo||(He=i||Ly(),Dy()&&window.document&&n.enable(),Qo=rl),Qo},n.defaults=function(i){if(i)for(var r in i)xc[r]=i[r];return xc},n.disable=function(i,r){rl=0,ot.forEach(function(o){return o[r?"kill":"disable"](i)}),bn(lt,"wheel",Oo),bn(Et,"scroll",Oo),clearInterval(pc),bn(Et,"touchcancel",lr),bn(vt,"touchstart",lr),gc(bn,Et,"pointerdown,touchstart,mousedown",rg),gc(bn,Et,"pointerup,touchend,mouseup",sg),Fu.kill(),_c(bn);for(var s=0;s<ct.length;s+=3)vc(bn,ct[s],ct[s+1]),vc(bn,ct[s],ct[s+2])},n.enable=function(){if(lt=window,Et=document,Mi=Et.documentElement,vt=Et.body,He){if(Gl=He.utils.toArray,Sl=He.utils.clamp,Md=He.core.context||lr,$f=He.core.suppressOverwrites||lr,gm=lt.history.scrollRestoration||"auto",Td=lt.pageYOffset||0,He.core.globals("ScrollTrigger",n),vt){rl=1,_a=document.createElement("div"),_a.style.height="100vh",_a.style.position="absolute",Vy(),FA(),Qt.register(He),n.isTouch=Qt.isTouch,hs=Qt.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Sd=Qt.isTouch===1,En(lt,"wheel",Oo),_m=[lt,Et,Mi,vt],He.matchMedia?(n.matchMedia=function(u){var h=He.matchMedia(),f;for(f in u)h.add(f,u[f]);return h},He.addEventListener("matchMediaInit",function(){Hy(),bm()}),He.addEventListener("matchMediaRevert",function(){return ky()}),He.addEventListener("matchMedia",function(){ro(0,1),bo("matchMedia")}),He.matchMedia().add("(orientation: portrait)",function(){return jf(),jf})):console.warn("Requires GSAP 3.11.0 or later"),jf(),En(Et,"scroll",Oo);var i=vt.hasAttribute("style"),r=vt.style,s=r.borderTopStyle,o=He.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),r.borderTopStyle="solid",a=Br(vt),mn.m=Math.round(a.top+mn.sc())||0,ti.m=Math.round(a.left+ti.sc())||0,s?r.borderTopStyle=s:r.removeProperty("border-top-style"),i||(vt.setAttribute("style",""),vt.removeAttribute("style")),pc=setInterval(lg,250),He.delayedCall(.5,function(){return mc=0}),En(Et,"touchcancel",lr),En(vt,"touchstart",lr),gc(En,Et,"pointerdown,touchstart,mousedown",rg),gc(En,Et,"pointerup,touchend,mouseup",sg),yd=He.utils.checkPrefix("transform"),su.push(yd),Qo=On(),Fu=He.delayedCall(.2,ro).pause(),ea=[Et,"visibilitychange",function(){var u=lt.innerWidth,h=lt.innerHeight;Et.hidden?(eg=u,tg=h):(eg!==u||tg!==h)&&al()},Et,"DOMContentLoaded",ro,lt,"load",ro,lt,"resize",al],_c(En),ot.forEach(function(u){return u.enable(0,1)}),l=0;l<ct.length;l+=3)vc(bn,ct[l],ct[l+1]),vc(bn,ct[l],ct[l+2])}else if(Et){var c=function u(){n.enable(),Et.removeEventListener("DOMContentLoaded",u)};Et.addEventListener("DOMContentLoaded",c)}}},n.config=function(i){"limitCallbacks"in i&&(qf=!!i.limitCallbacks);var r=i.syncInterval;r&&clearInterval(pc)||(pc=r)&&setInterval(lg,r),"ignoreMobileResize"in i&&(Sd=n.isTouch===1&&i.ignoreMobileResize),"autoRefreshEvents"in i&&(_c(bn)||_c(En,i.autoRefreshEvents||"none"),Ry=(i.autoRefreshEvents+"").indexOf("resize")===-1)},n.scrollerProxy=function(i,r){var s=ri(i),o=ct.indexOf(s),a=So(s);~o&&ct.splice(o,a?6:2),r&&(a?gr.unshift(lt,r,vt,r,Mi,r):gr.unshift(s,r))},n.clearMatchMedia=function(i){ot.forEach(function(r){return r._ctx&&r._ctx.query===i&&r._ctx.kill(!0,!0)})},n.isInViewport=function(i,r,s){var o=(xi(i)?ri(i):i).getBoundingClientRect(),a=o[s?go:vo]*r||0;return s?o.right-a>0&&o.left+a<lt.innerWidth:o.bottom-a>0&&o.top+a<lt.innerHeight},n.positionInViewport=function(i,r,s){xi(i)&&(i=ri(i));var o=i.getBoundingClientRect(),a=o[s?go:vo],l=r==null?a/2:r in Bu?Bu[r]*a:~r.indexOf("%")?parseFloat(r)*a/100:parseFloat(r)||0;return s?(o.left+l)/lt.innerWidth:(o.top+l)/lt.innerHeight},n.killAll=function(i){if(ot.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),i!==!0){var r=Mo.killAll||[];Mo={},r.forEach(function(s){return s()})}},n})();rt.version="3.15.0";rt.saveStyles=function(n){return n?Gl(n).forEach(function(e){if(e&&e.style){var t=vi.indexOf(e);t>=0&&vi.splice(t,5),vi.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),He.core.getCache(e),Md())}}):vi};rt.revert=function(n,e){return bm(!n,e)};rt.create=function(n,e){return new rt(n,e)};rt.refresh=function(n){return n?al(!0):(Qo||rt.register())&&ro(!0)};rt.update=function(n){return++ct.cache&&Gr(n===!0?2:0)};rt.clearScrollMemory=zy;rt.maxScroll=function(n,e){return dr(n,e?ti:mn)};rt.getScrollFunc=function(n,e){return Us(ri(n),e?ti:mn)};rt.getById=function(n){return Ed[n]};rt.getAll=function(){return ot.filter(function(n){return n.vars.id!=="ScrollSmoother"})};rt.isScrolling=function(){return!!Wi};rt.snapDirectional=Mm;rt.addEventListener=function(n,e){var t=Mo[n]||(Mo[n]=[]);~t.indexOf(e)||t.push(e)};rt.removeEventListener=function(n,e){var t=Mo[n],i=t&&t.indexOf(e);i>=0&&t.splice(i,1)};rt.batch=function(n,e){var t=[],i={},r=e.interval||.016,s=e.batchMax||1e9,o=function(c,u){var h=[],f=[],d=He.delayedCall(r,function(){u(h,f),h=[],f=[]}).pause();return function(p){h.length||d.restart(!0),h.push(p.trigger),f.push(p),s<=h.length&&d.progress(1)}},a;for(a in e)i[a]=a.substr(0,2)==="on"&&Vn(e[a])&&a!=="onRefreshInit"?o(a,e[a]):e[a];return Vn(s)&&(s=s(),En(rt,"refresh",function(){return s=e.batchMax()})),Gl(n).forEach(function(l){var c={};for(a in i)c[a]=i[a];c.trigger=l,t.push(rt.create(c))}),t};var pg=function(e,t,i,r){return t>r?e(r):t<0&&e(0),i>r?(r-t)/(i-t):i<0?t/(t-i):1},Zf=function n(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(Qt.isTouch?" pinch-zoom":""):"none",e===Mi&&n(vt,t)},bc={auto:1,scroll:1},YA=function(e){var t=e.event,i=e.target,r=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,o=s._gsap||He.core.getCache(s),a=On(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;s&&s!==vt&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(bc[(l=ki(s)).overflowY]||bc[l.overflowX]));)s=s.parentNode;o._isScroll=s&&s!==i&&!So(s)&&(bc[(l=ki(s)).overflowY]||bc[l.overflowX]),o._isScrollT=a}(o._isScroll||r==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},Wy=function(e,t,i,r){return Qt.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:r=r&&YA,onPress:r,onDrag:r,onScroll:r,onEnable:function(){return i&&En(Et,Qt.eventTypes[0],_g,!1,!0)},onDisable:function(){return bn(Et,Qt.eventTypes[0],_g,!0)}})},jA=/(input|label|select|textarea)/i,mg,_g=function(e){var t=jA.test(e.target.tagName);(t||mg)&&(e._gsapAllow=!0,mg=t)},KA=function(e){Js(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,i=t.normalizeScrollX,r=t.momentum,s=t.allowNestedScroll,o=t.onRelease,a,l,c=ri(e.target)||Mi,u=He.core.globals().ScrollSmoother,h=u&&u.get(),f=hs&&(e.content&&ri(e.content)||h&&e.content!==!1&&!h.smooth()&&h.content()),d=Us(c,mn),p=Us(c,ti),m=1,_=(Qt.isTouch&&lt.visualViewport?lt.visualViewport.scale*lt.visualViewport.width:lt.outerWidth)/lt.innerWidth,g=0,y=Vn(r)?function(){return r(a)}:function(){return r||2.8},v,x,b=Wy(c,e.type,!0,s),T=function(){return x=!1},w=lr,S=lr,E=function(){l=dr(c,mn),S=Sl(hs?1:0,l),i&&(w=Sl(0,dr(c,ti))),v=xo},A=function(){f._gsap.y=sl(parseFloat(f._gsap.y)+d.offset)+"px",f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(f._gsap.y)+", 0, 1)",d.offset=d.cacheID=0},D=function(){if(x){requestAnimationFrame(T);var G=sl(a.deltaY/2),ee=S(d.v-G);if(f&&ee!==d.v+d.offset){d.offset=ee-d.v;var F=sl((parseFloat(f&&f._gsap.y)||0)-d.offset);f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+F+", 0, 1)",f._gsap.y=F+"px",d.cacheID=ct.cache,Gr()}return!0}d.offset&&A(),x=!0},L,H,z,k,B=function(){E(),L.isActive()&&L.vars.scrollY>l&&(d()>l?L.progress(1)&&d(l):L.resetTo("scrollY",l))};return f&&He.set(f,{y:"+=0"}),e.ignoreCheck=function(U){return hs&&U.type==="touchmove"&&D()||m>1.05&&U.type!=="touchstart"||a.isGesturing||U.touches&&U.touches.length>1},e.onPress=function(){x=!1;var U=m;m=sl((lt.visualViewport&&lt.visualViewport.scale||1)/_),L.pause(),U!==m&&Zf(c,m>1.01?!0:i?!1:"x"),H=p(),z=d(),E(),v=xo},e.onRelease=e.onGestureStart=function(U,G){if(d.offset&&A(),!G)k.restart(!0);else{ct.cache++;var ee=y(),F,ve;i&&(F=p(),ve=F+ee*.05*-U.velocityX/.227,ee*=pg(p,F,ve,dr(c,ti)),L.vars.scrollX=w(ve)),F=d(),ve=F+ee*.05*-U.velocityY/.227,ee*=pg(d,F,ve,dr(c,mn)),L.vars.scrollY=S(ve),L.invalidate().duration(ee).play(.01),(hs&&L.vars.scrollY>=l||F>=l-1)&&He.to({},{onUpdate:B,duration:ee})}o&&o(U)},e.onWheel=function(){L._ts&&L.pause(),On()-g>1e3&&(v=0,g=On())},e.onChange=function(U,G,ee,F,ve){if(xo!==v&&E(),G&&i&&p(w(F[2]===G?H+(U.startX-U.x):p()+G-F[1])),ee){d.offset&&A();var Te=ve[2]===ee,$e=Te?z+U.startY-U.y:d()+ee-ve[1],Ge=S($e);Te&&$e!==Ge&&(z+=Ge-$e),d(Ge)}(ee||G)&&Gr()},e.onEnable=function(){Zf(c,i?!1:"x"),rt.addEventListener("refresh",B),En(lt,"resize",B),d.smooth&&(d.target.style.scrollBehavior="auto",d.smooth=p.smooth=!1),b.enable()},e.onDisable=function(){Zf(c,!0),bn(lt,"resize",B),rt.removeEventListener("refresh",B),b.kill()},e.lockAxis=e.lockAxis!==!1,a=new Qt(e),a.iOS=hs,hs&&!d()&&d(1),hs&&He.ticker.add(lr),k=a._dc,L=He.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:i?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:Gy(d,d(),function(){return L.pause()})},onUpdate:Gr,onComplete:k.vars.onComplete}),a};rt.sort=function(n){if(Vn(n))return ot.sort(n);var e=lt.pageYOffset||0;return rt.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+lt.innerHeight}),ot.sort(n||function(t,i){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((i.vars.containerAnimation?1e6:i._sortY)+(i.vars.refreshPriority||0)*-1e6)})};rt.observe=function(n){return new Qt(n)};rt.normalizeScroll=function(n){if(typeof n>"u")return Zn;if(n===!0&&Zn)return Zn.enable();if(n===!1){Zn&&Zn.kill(),Zn=n;return}var e=n instanceof Qt?n:KA(n);return Zn&&Zn.target===e.target&&Zn.kill(),So(e.target)&&(Zn=e),e};rt.core={_getVelocityProp:xd,_inputObserver:Wy,_scrollers:ct,_proxies:gr,bridge:{ss:function(){Wi||bo("scrollStart"),Wi=On()},ref:function(){return Fn}}};Ly()&&He.registerPlugin(rt);const ZA={viewBox:"0 0 300 300"},JA=["x","y","fill"],QA={class:"orange-core__content"},Jf=4,eR=2,tR=0,nR=Tr({__name:"OrangeCore",props:{color:{default:"#ff6a00"}},setup(n){const e=Array.from({length:9},(o,a)=>({x:a%3*100,y:Math.floor(a/3)*100})),t=[0,1,2,3,5,6,7,8],i=At(null),r=At(null),s=At(null);return jr(()=>{Bn.registerPlugin(rt);const o=i.value,a=r.value,l=s.value;if(!o||!a||!l)return;const c=Array.from(l.querySelectorAll(".orange-core__cell")),u=o.querySelector(".orange-core-anchor"),h=.92;Bn.set(a,{autoAlpha:0,zIndex:eR}),Bn.set(c,{opacity:0,scale:h,transformOrigin:"50% 50%"}),Bn.set(c[Jf],{opacity:1});const f=()=>{if(!u)return{x:0,y:0,scale:1};const _=u.getBoundingClientRect(),g=o.getBoundingClientRect(),y=a.getBoundingClientRect();return{x:_.left+_.width/2-(y.left+y.width/2),y:_.top-g.top+_.height/2-(y.top+y.height/2),scale:_.width*3/((l.offsetWidth||1)*h)}},d=()=>{const _=Math.abs(f().x);return Math.max(window.innerWidth/2+_,window.innerHeight/2)*2/(l.offsetWidth||1)*1.1},p=Bn.timeline({defaults:{ease:"none"},scrollTrigger:{trigger:o,start:"top bottom",end:"bottom bottom",scrub:!0,invalidateOnRefresh:!0,onToggle:_=>{Bn.to(a,{autoAlpha:_.isActive?1:0,duration:.25,overwrite:"auto"})}}});p.fromTo(l,{x:()=>f().x,y:()=>f().y+a.clientHeight,scale:()=>f().scale},{x:()=>f().x,y:()=>f().y,scale:()=>f().scale,duration:1,ease:"none",immediateRender:!0},0);const m=Bn.timeline({defaults:{ease:"none"}});m.addLabel("mosaic",0),m.fromTo(l,{x:()=>f().x,y:()=>f().y,scale:()=>f().scale},{x:()=>f().x,y:0,scale:1,duration:.45,ease:"power2.inOut",immediateRender:!1},.1);for(const _ of c)Array.from({length:3},()=>.05+Math.random()*.9).sort((y,v)=>y-v).forEach((y,v)=>m.set(_,{opacity:v%2===0?1:0},y));m.addLabel("converge",1),m.set(a,{zIndex:tR},1),m.set(c[Jf],{opacity:1},1);for(const _ of t){const g=1.05+Math.random()*.5;m.set(c[_],{opacity:0},g),m.set(c[_],{opacity:1},g+.06),m.set(c[_],{opacity:0},g+.12)}m.addLabel("expand",2),m.to(c[Jf],{scale:3,duration:.7,ease:"power2.inOut"},2),m.to(l,{scale:()=>d(),duration:.8,ease:"power2.in"},2.1),m.to({},{duration:.1},2.9),m.duration(2),p.add(m,1),Bs(()=>{p.scrollTrigger?.kill(),p.kill()})}),(o,a)=>(wt(),cn("div",{ref_key:"trackRef",ref:i,class:"orange-core"},[un("div",{ref_key:"layerRef",ref:r,class:"orange-core__layer","aria-hidden":"true"},[un("div",{ref_key:"boxRef",ref:s,class:"orange-core__box"},[(wt(),cn("svg",ZA,[(wt(!0),cn(ln,null,sf(pt(e),(l,c)=>(wt(),cn("rect",{key:c,class:"orange-core__cell",x:l.x,y:l.y,width:"100",height:"100",fill:n.color},null,8,JA))),128))]))],512)],512),un("div",QA,[cv(o.$slots,"default",{},void 0)])],512))}}),iR=Object.assign(Ba(nR,[["__scopeId","data-v-d19dff2a"]]),{__name:"OrangeCore"});const Em="184",rR=0,gg=1,sR=2,au=1,oR=2,ll=3,Fs=0,fi=1,kr=2,Wr=0,va=1,vg=2,xg=3,yg=4,aR=5,eo=100,lR=101,cR=102,uR=103,fR=104,hR=200,dR=201,pR=202,mR=203,Ad=204,Rd=205,_R=206,gR=207,vR=208,xR=209,yR=210,SR=211,MR=212,bR=213,ER=214,Cd=0,Pd=1,Dd=2,Da=3,Ld=4,Id=5,Nd=6,Ud=7,Xy=0,TR=1,wR=2,vr=0,$y=1,qy=2,Yy=3,jy=4,Ky=5,Zy=6,Jy=7,Qy=300,Eo=301,La=302,Qf=303,eh=304,_f=306,Fd=1e3,Ki=1001,Od=1002,Pn=1003,AR=1004,Ec=1005,_n=1006,th=1007,Es=1008,zi=1009,eS=1010,tS=1011,Xl=1012,Tm=1013,Er=1014,pr=1015,Jr=1016,wm=1017,Am=1018,$l=1020,nS=35902,iS=35899,rS=1021,sS=1022,Zi=1023,Qr=1026,so=1027,oS=1028,Rm=1029,To=1030,Cm=1031,Pm=1033,lu=33776,cu=33777,uu=33778,fu=33779,Bd=35840,kd=35841,Hd=35842,zd=35843,Vd=36196,Gd=37492,Wd=37496,Xd=37488,$d=37489,ku=37490,qd=37491,Yd=37808,jd=37809,Kd=37810,Zd=37811,Jd=37812,Qd=37813,ep=37814,tp=37815,np=37816,ip=37817,rp=37818,sp=37819,op=37820,ap=37821,lp=36492,cp=36494,up=36495,fp=36283,hp=36284,Hu=36285,dp=36286,RR=3200,Sg=0,CR=1,vs="",Oi="srgb",zu="srgb-linear",Vu="linear",Tt="srgb",Bo=7680,Mg=519,PR=512,DR=513,LR=514,Dm=515,IR=516,NR=517,Lm=518,UR=519,bg=35044,Eg="300 es",mr=2e3,Gu=2001;function FR(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Wu(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function OR(){const n=Wu("canvas");return n.style.display="block",n}const Tg={};function wg(...n){const e="THREE."+n.shift();console.log(e,...n)}function aS(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Je(...n){n=aS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function dt(...n){n=aS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function pp(...n){const e=n.join(" ");e in Tg||(Tg[e]=!0,Je(...n))}function BR(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const kR={[Cd]:Pd,[Dd]:Nd,[Ld]:Ud,[Da]:Id,[Pd]:Cd,[Nd]:Dd,[Ud]:Ld,[Id]:Da};class Ro{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],nh=Math.PI/180,mp=180/Math.PI;function Ql(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Nn[n&255]+Nn[n>>8&255]+Nn[n>>16&255]+Nn[n>>24&255]+"-"+Nn[e&255]+Nn[e>>8&255]+"-"+Nn[e>>16&15|64]+Nn[e>>24&255]+"-"+Nn[t&63|128]+Nn[t>>8&255]+"-"+Nn[t>>16&255]+Nn[t>>24&255]+Nn[i&255]+Nn[i>>8&255]+Nn[i>>16&255]+Nn[i>>24&255]).toLowerCase()}function ft(n,e,t){return Math.max(e,Math.min(t,n))}function HR(n,e){return(n%e+e)%e}function ih(n,e,t){return(1-t)*n+t*e}function $a(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ii(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Fm=class Fm{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Fm.prototype.isVector2=!0;let Mt=Fm;class ka{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3],f=s[o+0],d=s[o+1],p=s[o+2],m=s[o+3];if(h!==m||l!==f||c!==d||u!==p){let _=l*f+c*d+u*p+h*m;_<0&&(f=-f,d=-d,p=-p,m=-m,_=-_);let g=1-a;if(_<.9995){const y=Math.acos(_),v=Math.sin(y);g=Math.sin(g*y)/v,a=Math.sin(a*y)/v,l=l*g+f*a,c=c*g+d*a,u=u*g+p*a,h=h*g+m*a}else{l=l*g+f*a,c=c*g+d*a,u=u*g+p*a,h=h*g+m*a;const y=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=y,c*=y,u*=y,h*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],f=s[o+1],d=s[o+2],p=s[o+3];return e[t]=a*p+u*h+l*d-c*f,e[t+1]=l*p+u*f+c*h-a*d,e[t+2]=c*p+u*d+a*f-l*h,e[t+3]=u*p-a*h-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),f=l(i/2),d=l(r/2),p=l(s/2);switch(o){case"XYZ":this._x=f*u*h+c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h-f*d*p;break;case"YXZ":this._x=f*u*h+c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h+f*d*p;break;case"ZXY":this._x=f*u*h-c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h-f*d*p;break;case"ZYX":this._x=f*u*h-c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h+f*d*p;break;case"YZX":this._x=f*u*h+c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h-f*d*p;break;case"XZY":this._x=f*u*h-c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h+f*d*p;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>h){const d=2*Math.sqrt(1+i-a-h);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>h){const d=2*Math.sqrt(1+a-i-h);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+h-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Om=class Om{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ag.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ag.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return rh.copy(this).projectOnVector(e),this.sub(rh)}reflect(e){return this.sub(rh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Om.prototype.isVector3=!0;let te=Om;const rh=new te,Ag=new ka,Bm=class Bm{constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],d=i[5],p=i[8],m=r[0],_=r[3],g=r[6],y=r[1],v=r[4],x=r[7],b=r[2],T=r[5],w=r[8];return s[0]=o*m+a*y+l*b,s[3]=o*_+a*v+l*T,s[6]=o*g+a*x+l*w,s[1]=c*m+u*y+h*b,s[4]=c*_+u*v+h*T,s[7]=c*g+u*x+h*w,s[2]=f*m+d*y+p*b,s[5]=f*_+d*v+p*T,s[8]=f*g+d*x+p*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*s,d=c*s-o*l,p=t*h+i*f+r*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/p;return e[0]=h*m,e[1]=(r*c-u*i)*m,e[2]=(a*i-r*o)*m,e[3]=f*m,e[4]=(u*t-r*l)*m,e[5]=(r*s-a*t)*m,e[6]=d*m,e[7]=(i*l-c*t)*m,e[8]=(o*t-i*s)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Bm.prototype.isMatrix3=!0;let tt=Bm;const sh=new tt,Rg=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cg=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zR(){const n={enabled:!0,workingColorSpace:zu,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Tt&&(r.r=Xr(r.r),r.g=Xr(r.g),r.b=Xr(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Tt&&(r.r=xa(r.r),r.g=xa(r.g),r.b=xa(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===vs?Vu:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return pp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return pp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[zu]:{primaries:e,whitePoint:i,transfer:Vu,toXYZ:Rg,fromXYZ:Cg,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Oi},outputColorSpaceConfig:{drawingBufferColorSpace:Oi}},[Oi]:{primaries:e,whitePoint:i,transfer:Tt,toXYZ:Rg,fromXYZ:Cg,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Oi}}}),n}const ut=zR();function Xr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ko;class VR{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ko===void 0&&(ko=Wu("canvas")),ko.width=e.width,ko.height=e.height;const r=ko.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ko}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Wu("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Xr(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Xr(t[i]/255)*255):t[i]=Xr(t[i]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let GR=0;class Im{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:GR++}),this.uuid=Ql(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(oh(r[o].image)):s.push(oh(r[o]))}else s=oh(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function oh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?VR.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}let WR=0;const ah=new te;class Xn extends Ro{constructor(e=Xn.DEFAULT_IMAGE,t=Xn.DEFAULT_MAPPING,i=Ki,r=Ki,s=_n,o=Es,a=Zi,l=zi,c=Xn.DEFAULT_ANISOTROPY,u=vs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:WR++}),this.uuid=Ql(),this.name="",this.source=new Im(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ah).x}get height(){return this.source.getSize(ah).y}get depth(){return this.source.getSize(ah).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qy)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fd:e.x=e.x-Math.floor(e.x);break;case Ki:e.x=e.x<0?0:1;break;case Od:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fd:e.y=e.y-Math.floor(e.y);break;case Ki:e.y=e.y<0?0:1;break;case Od:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=Qy;Xn.DEFAULT_ANISOTROPY=1;const km=class km{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],d=l[5],p=l[9],m=l[2],_=l[6],g=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-m)<.01&&Math.abs(p-_)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+m)<.1&&Math.abs(p+_)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,x=(d+1)/2,b=(g+1)/2,T=(u+f)/4,w=(h+m)/4,S=(p+_)/4;return v>x&&v>b?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=T/i,s=w/i):x>b?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=T/r,s=S/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=w/s,r=S/s),this.set(i,r,s,t),this}let y=Math.sqrt((_-p)*(_-p)+(h-m)*(h-m)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(_-p)/y,this.y=(h-m)/y,this.z=(f-u)/y,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};km.prototype.isVector4=!0;let Jt=km;class XR extends Ro{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Jt(0,0,e,t),this.scissorTest=!1,this.viewport=new Jt(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new Xn(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:_n,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Im(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xr extends XR{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class lS extends Xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $R extends Xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Xu=class Xu{constructor(e,t,i,r,s,o,a,l,c,u,h,f,d,p,m,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,f,d,p,m,_)}set(e,t,i,r,s,o,a,l,c,u,h,f,d,p,m,_){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=r,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=f,g[3]=d,g[7]=p,g[11]=m,g[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xu().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Ho.setFromMatrixColumn(e,0).length(),s=1/Ho.setFromMatrixColumn(e,1).length(),o=1/Ho.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*u,d=o*h,p=a*u,m=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=d+p*c,t[5]=f-m*c,t[9]=-a*l,t[2]=m-f*c,t[6]=p+d*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,d=l*h,p=c*u,m=c*h;t[0]=f+m*a,t[4]=p*a-d,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-p,t[6]=m+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,d=l*h,p=c*u,m=c*h;t[0]=f-m*a,t[4]=-o*h,t[8]=p+d*a,t[1]=d+p*a,t[5]=o*u,t[9]=m-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,d=o*h,p=a*u,m=a*h;t[0]=l*u,t[4]=p*c-d,t[8]=f*c+m,t[1]=l*h,t[5]=m*c+f,t[9]=d*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,d=o*c,p=a*l,m=a*c;t[0]=l*u,t[4]=m-f*h,t[8]=p*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=d*h+p,t[10]=f-m*h}else if(e.order==="XZY"){const f=o*l,d=o*c,p=a*l,m=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+m,t[5]=o*u,t[9]=d*h-p,t[2]=p*h-d,t[6]=a*u,t[10]=m*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qR,e,YR)}lookAt(e,t,i){const r=this.elements;return _i.subVectors(e,t),_i.lengthSq()===0&&(_i.z=1),_i.normalize(),ss.crossVectors(i,_i),ss.lengthSq()===0&&(Math.abs(i.z)===1?_i.x+=1e-4:_i.z+=1e-4,_i.normalize(),ss.crossVectors(i,_i)),ss.normalize(),Tc.crossVectors(_i,ss),r[0]=ss.x,r[4]=Tc.x,r[8]=_i.x,r[1]=ss.y,r[5]=Tc.y,r[9]=_i.y,r[2]=ss.z,r[6]=Tc.z,r[10]=_i.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],d=i[13],p=i[2],m=i[6],_=i[10],g=i[14],y=i[3],v=i[7],x=i[11],b=i[15],T=r[0],w=r[4],S=r[8],E=r[12],A=r[1],D=r[5],L=r[9],H=r[13],z=r[2],k=r[6],B=r[10],U=r[14],G=r[3],ee=r[7],F=r[11],ve=r[15];return s[0]=o*T+a*A+l*z+c*G,s[4]=o*w+a*D+l*k+c*ee,s[8]=o*S+a*L+l*B+c*F,s[12]=o*E+a*H+l*U+c*ve,s[1]=u*T+h*A+f*z+d*G,s[5]=u*w+h*D+f*k+d*ee,s[9]=u*S+h*L+f*B+d*F,s[13]=u*E+h*H+f*U+d*ve,s[2]=p*T+m*A+_*z+g*G,s[6]=p*w+m*D+_*k+g*ee,s[10]=p*S+m*L+_*B+g*F,s[14]=p*E+m*H+_*U+g*ve,s[3]=y*T+v*A+x*z+b*G,s[7]=y*w+v*D+x*k+b*ee,s[11]=y*S+v*L+x*B+b*F,s[15]=y*E+v*H+x*U+b*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],d=e[14],p=e[3],m=e[7],_=e[11],g=e[15],y=l*d-c*f,v=a*d-c*h,x=a*f-l*h,b=o*d-c*u,T=o*f-l*u,w=o*h-a*u;return t*(m*y-_*v+g*x)-i*(p*y-_*b+g*T)+r*(p*v-m*b+g*w)-s*(p*x-m*T+_*w)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],d=e[11],p=e[12],m=e[13],_=e[14],g=e[15],y=t*a-i*o,v=t*l-r*o,x=t*c-s*o,b=i*l-r*a,T=i*c-s*a,w=r*c-s*l,S=u*m-h*p,E=u*_-f*p,A=u*g-d*p,D=h*_-f*m,L=h*g-d*m,H=f*g-d*_,z=y*H-v*L+x*D+b*A-T*E+w*S;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/z;return e[0]=(a*H-l*L+c*D)*k,e[1]=(r*L-i*H-s*D)*k,e[2]=(m*w-_*T+g*b)*k,e[3]=(f*T-h*w-d*b)*k,e[4]=(l*A-o*H-c*E)*k,e[5]=(t*H-r*A+s*E)*k,e[6]=(_*x-p*w-g*v)*k,e[7]=(u*w-f*x+d*v)*k,e[8]=(o*L-a*A+c*S)*k,e[9]=(i*A-t*L-s*S)*k,e[10]=(p*T-m*x+g*y)*k,e[11]=(h*x-u*T-d*y)*k,e[12]=(a*E-o*D-l*S)*k,e[13]=(t*D-i*E+r*S)*k,e[14]=(m*v-p*b-_*y)*k,e[15]=(u*b-h*v+f*y)*k,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,f=s*c,d=s*u,p=s*h,m=o*u,_=o*h,g=a*h,y=l*c,v=l*u,x=l*h,b=i.x,T=i.y,w=i.z;return r[0]=(1-(m+g))*b,r[1]=(d+x)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(d-x)*T,r[5]=(1-(f+g))*T,r[6]=(_+y)*T,r[7]=0,r[8]=(p+v)*w,r[9]=(_-y)*w,r[10]=(1-(f+m))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),t.identity(),this;let o=Ho.set(r[0],r[1],r[2]).length();const a=Ho.set(r[4],r[5],r[6]).length(),l=Ho.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Xi.copy(this);const c=1/o,u=1/a,h=1/l;return Xi.elements[0]*=c,Xi.elements[1]*=c,Xi.elements[2]*=c,Xi.elements[4]*=u,Xi.elements[5]*=u,Xi.elements[6]*=u,Xi.elements[8]*=h,Xi.elements[9]*=h,Xi.elements[10]*=h,t.setFromRotationMatrix(Xi),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=mr,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(i-r),f=(t+e)/(t-e),d=(i+r)/(i-r);let p,m;if(l)p=s/(o-s),m=o*s/(o-s);else if(a===mr)p=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(a===Gu)p=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=mr,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-r),f=-(t+e)/(t-e),d=-(i+r)/(i-r);let p,m;if(l)p=1/(o-s),m=o/(o-s);else if(a===mr)p=-2/(o-s),m=-(o+s)/(o-s);else if(a===Gu)p=-1/(o-s),m=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Xu.prototype.isMatrix4=!0;let tn=Xu;const Ho=new te,Xi=new tn,qR=new te(0,0,0),YR=new te(1,1,1),ss=new te,Tc=new te,_i=new te,Pg=new tn,Dg=new ka;class wo{constructor(e=0,t=0,i=0,r=wo.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ft(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Pg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Dg.setFromEuler(this),this.setFromQuaternion(Dg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wo.DEFAULT_ORDER="XYZ";class Nm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let jR=0;const Lg=new te,zo=new ka,Rr=new tn,wc=new te,qa=new te,KR=new te,ZR=new ka,Ig=new te(1,0,0),Ng=new te(0,1,0),Ug=new te(0,0,1),Fg={type:"added"},JR={type:"removed"},Vo={type:"childadded",child:null},lh={type:"childremoved",child:null};class hi extends Ro{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jR++}),this.uuid=Ql(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=hi.DEFAULT_UP.clone();const e=new te,t=new wo,i=new ka,r=new te(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new tn},normalMatrix:{value:new tt}}),this.matrix=new tn,this.matrixWorld=new tn,this.matrixAutoUpdate=hi.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zo.setFromAxisAngle(e,t),this.quaternion.multiply(zo),this}rotateOnWorldAxis(e,t){return zo.setFromAxisAngle(e,t),this.quaternion.premultiply(zo),this}rotateX(e){return this.rotateOnAxis(Ig,e)}rotateY(e){return this.rotateOnAxis(Ng,e)}rotateZ(e){return this.rotateOnAxis(Ug,e)}translateOnAxis(e,t){return Lg.copy(e).applyQuaternion(this.quaternion),this.position.add(Lg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ig,e)}translateY(e){return this.translateOnAxis(Ng,e)}translateZ(e){return this.translateOnAxis(Ug,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Rr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?wc.copy(e):wc.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rr.lookAt(qa,wc,this.up):Rr.lookAt(wc,qa,this.up),this.quaternion.setFromRotationMatrix(Rr),r&&(Rr.extractRotation(r.matrixWorld),zo.setFromRotationMatrix(Rr),this.quaternion.premultiply(zo.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(dt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fg),Vo.child=e,this.dispatchEvent(Vo),Vo.child=null):dt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(JR),lh.child=e,this.dispatchEvent(lh),lh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Rr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Rr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Rr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fg),Vo.child=e,this.dispatchEvent(Vo),Vo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,e,KR),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,ZR,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),p=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}hi.DEFAULT_UP=new te(0,1,0);hi.DEFAULT_MATRIX_AUTO_UPDATE=!0;hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ac extends hi{constructor(){super(),this.isGroup=!0,this.type="Group"}}const QR={type:"move"};class ch{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ac,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ac,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new te,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new te),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ac,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new te,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new te,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const m of e.hand.values()){const _=t.getJointPose(m,i),g=this._getHandJoint(c,m);_!==null&&(g.matrix.fromArray(_.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=_.radius),g.visible=_!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,p=.005;c.inputState.pinching&&f>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(QR)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ac;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const cS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},os={h:0,s:0,l:0},Rc={h:0,s:0,l:0};function uh(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class St{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Oi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ut.workingColorSpace){return this.r=e,this.g=t,this.b=i,ut.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ut.workingColorSpace){if(e=HR(e,1),t=ft(t,0,1),i=ft(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=uh(o,s,e+1/3),this.g=uh(o,s,e),this.b=uh(o,s,e-1/3)}return ut.colorSpaceToWorking(this,r),this}setStyle(e,t=Oi){function i(s){s!==void 0&&parseFloat(s)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Oi){const i=cS[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xr(e.r),this.g=Xr(e.g),this.b=Xr(e.b),this}copyLinearToSRGB(e){return this.r=xa(e.r),this.g=xa(e.g),this.b=xa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Oi){return ut.workingToColorSpace(Un.copy(this),e),Math.round(ft(Un.r*255,0,255))*65536+Math.round(ft(Un.g*255,0,255))*256+Math.round(ft(Un.b*255,0,255))}getHexString(e=Oi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(Un.copy(this),t);const i=Un.r,r=Un.g,s=Un.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(Un.copy(this),t),e.r=Un.r,e.g=Un.g,e.b=Un.b,e}getStyle(e=Oi){ut.workingToColorSpace(Un.copy(this),e);const t=Un.r,i=Un.g,r=Un.b;return e!==Oi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(os),this.setHSL(os.h+e,os.s+t,os.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(os),e.getHSL(Rc);const i=ih(os.h,Rc.h,t),r=ih(os.s,Rc.s,t),s=ih(os.l,Rc.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Un=new St;St.NAMES=cS;class eC extends hi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wo,this.environmentIntensity=1,this.environmentRotation=new wo,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const $i=new te,Cr=new te,fh=new te,Pr=new te,Go=new te,Wo=new te,Og=new te,hh=new te,dh=new te,ph=new te,mh=new Jt,_h=new Jt,gh=new Jt;class ji{constructor(e=new te,t=new te,i=new te){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),$i.subVectors(e,t),r.cross($i);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){$i.subVectors(r,t),Cr.subVectors(i,t),fh.subVectors(e,t);const o=$i.dot($i),a=$i.dot(Cr),l=$i.dot(fh),c=Cr.dot(Cr),u=Cr.dot(fh),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,d=(c*l-a*u)*f,p=(o*u-a*l)*f;return s.set(1-d-p,p,d)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Pr)===null?!1:Pr.x>=0&&Pr.y>=0&&Pr.x+Pr.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Pr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pr.x),l.addScaledVector(o,Pr.y),l.addScaledVector(a,Pr.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return mh.setScalar(0),_h.setScalar(0),gh.setScalar(0),mh.fromBufferAttribute(e,t),_h.fromBufferAttribute(e,i),gh.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(mh,s.x),o.addScaledVector(_h,s.y),o.addScaledVector(gh,s.z),o}static isFrontFacing(e,t,i,r){return $i.subVectors(i,t),Cr.subVectors(e,t),$i.cross(Cr).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $i.subVectors(this.c,this.b),Cr.subVectors(this.a,this.b),$i.cross(Cr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ji.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ji.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return ji.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return ji.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ji.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Go.subVectors(r,i),Wo.subVectors(s,i),hh.subVectors(e,i);const l=Go.dot(hh),c=Wo.dot(hh);if(l<=0&&c<=0)return t.copy(i);dh.subVectors(e,r);const u=Go.dot(dh),h=Wo.dot(dh);if(u>=0&&h<=u)return t.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Go,o);ph.subVectors(e,s);const d=Go.dot(ph),p=Wo.dot(ph);if(p>=0&&d<=p)return t.copy(s);const m=d*c-l*p;if(m<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(i).addScaledVector(Wo,a);const _=u*p-d*h;if(_<=0&&h-u>=0&&d-p>=0)return Og.subVectors(s,r),a=(h-u)/(h-u+(d-p)),t.copy(r).addScaledVector(Og,a);const g=1/(_+m+f);return o=m*g,a=f*g,t.copy(i).addScaledVector(Go,o).addScaledVector(Wo,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ec{constructor(e=new te(1/0,1/0,1/0),t=new te(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(qi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(qi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=qi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qi):qi.fromBufferAttribute(s,o),qi.applyMatrix4(e.matrixWorld),this.expandByPoint(qi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Cc.copy(i.boundingBox)),Cc.applyMatrix4(e.matrixWorld),this.union(Cc)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qi),qi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ya),Pc.subVectors(this.max,Ya),Xo.subVectors(e.a,Ya),$o.subVectors(e.b,Ya),qo.subVectors(e.c,Ya),as.subVectors($o,Xo),ls.subVectors(qo,$o),Xs.subVectors(Xo,qo);let t=[0,-as.z,as.y,0,-ls.z,ls.y,0,-Xs.z,Xs.y,as.z,0,-as.x,ls.z,0,-ls.x,Xs.z,0,-Xs.x,-as.y,as.x,0,-ls.y,ls.x,0,-Xs.y,Xs.x,0];return!vh(t,Xo,$o,qo,Pc)||(t=[1,0,0,0,1,0,0,0,1],!vh(t,Xo,$o,qo,Pc))?!1:(Dc.crossVectors(as,ls),t=[Dc.x,Dc.y,Dc.z],vh(t,Xo,$o,qo,Pc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Dr=[new te,new te,new te,new te,new te,new te,new te,new te],qi=new te,Cc=new ec,Xo=new te,$o=new te,qo=new te,as=new te,ls=new te,Xs=new te,Ya=new te,Pc=new te,Dc=new te,$s=new te;function vh(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){$s.fromArray(n,s);const a=r.x*Math.abs($s.x)+r.y*Math.abs($s.y)+r.z*Math.abs($s.z),l=e.dot($s),c=t.dot($s),u=i.dot($s);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const sn=new te,Lc=new Mt;let tC=0;class pn extends Ro{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tC++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=bg,this.updateRanges=[],this.gpuType=pr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Lc.fromBufferAttribute(this,t),Lc.applyMatrix3(e),this.setXY(t,Lc.x,Lc.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=$a(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ii(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$a(t,this.array)),t}setX(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$a(t,this.array)),t}setY(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$a(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$a(t,this.array)),t}setW(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),r=ii(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),r=ii(r,this.array),s=ii(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bg&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class uS extends pn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class fS extends pn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class $r extends pn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const nC=new ec,ja=new te,xh=new te;class gf{constructor(e=new te,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):nC.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ja.subVectors(e,this.center);const t=ja.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ja,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ja.copy(e.center).add(xh)),this.expandByPoint(ja.copy(e.center).sub(xh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let iC=0;const Ni=new tn,yh=new hi,Yo=new te,gi=new ec,Ka=new ec,Mn=new te;class tr extends Ro{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:iC++}),this.uuid=Ql(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(FR(e)?fS:uS)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new tt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ni.makeRotationFromQuaternion(e),this.applyMatrix4(Ni),this}rotateX(e){return Ni.makeRotationX(e),this.applyMatrix4(Ni),this}rotateY(e){return Ni.makeRotationY(e),this.applyMatrix4(Ni),this}rotateZ(e){return Ni.makeRotationZ(e),this.applyMatrix4(Ni),this}translate(e,t,i){return Ni.makeTranslation(e,t,i),this.applyMatrix4(Ni),this}scale(e,t,i){return Ni.makeScale(e,t,i),this.applyMatrix4(Ni),this}lookAt(e){return yh.lookAt(e),yh.updateMatrix(),this.applyMatrix4(yh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yo).negate(),this.translate(Yo.x,Yo.y,Yo.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new $r(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ec);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){dt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new te(-1/0,-1/0,-1/0),new te(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];gi.setFromBufferAttribute(s),this.morphTargetsRelative?(Mn.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(Mn),Mn.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(Mn)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&dt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gf);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){dt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new te,1/0);return}if(e){const i=this.boundingSphere.center;if(gi.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Ka.setFromBufferAttribute(a),this.morphTargetsRelative?(Mn.addVectors(gi.min,Ka.min),gi.expandByPoint(Mn),Mn.addVectors(gi.max,Ka.max),gi.expandByPoint(Mn)):(gi.expandByPoint(Ka.min),gi.expandByPoint(Ka.max))}gi.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Mn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Mn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Mn.fromBufferAttribute(a,c),l&&(Yo.fromBufferAttribute(e,c),Mn.add(Yo)),r=Math.max(r,i.distanceToSquared(Mn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&dt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){dt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let S=0;S<i.count;S++)a[S]=new te,l[S]=new te;const c=new te,u=new te,h=new te,f=new Mt,d=new Mt,p=new Mt,m=new te,_=new te;function g(S,E,A){c.fromBufferAttribute(i,S),u.fromBufferAttribute(i,E),h.fromBufferAttribute(i,A),f.fromBufferAttribute(s,S),d.fromBufferAttribute(s,E),p.fromBufferAttribute(s,A),u.sub(c),h.sub(c),d.sub(f),p.sub(f);const D=1/(d.x*p.y-p.x*d.y);isFinite(D)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(h,-d.y).multiplyScalar(D),_.copy(h).multiplyScalar(d.x).addScaledVector(u,-p.x).multiplyScalar(D),a[S].add(m),a[E].add(m),a[A].add(m),l[S].add(_),l[E].add(_),l[A].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let S=0,E=y.length;S<E;++S){const A=y[S],D=A.start,L=A.count;for(let H=D,z=D+L;H<z;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const v=new te,x=new te,b=new te,T=new te;function w(S){b.fromBufferAttribute(r,S),T.copy(b);const E=a[S];v.copy(E),v.sub(b.multiplyScalar(b.dot(E))).normalize(),x.crossVectors(T,E);const D=x.dot(l[S])<0?-1:1;o.setXYZW(S,v.x,v.y,v.z,D)}for(let S=0,E=y.length;S<E;++S){const A=y[S],D=A.start,L=A.count;for(let H=D,z=D+L;H<z;H+=3)w(e.getX(H+0)),w(e.getX(H+1)),w(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new pn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const r=new te,s=new te,o=new te,a=new te,l=new te,c=new te,u=new te,h=new te;if(e)for(let f=0,d=e.count;f<d;f+=3){const p=e.getX(f+0),m=e.getX(f+1),_=e.getX(f+2);r.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),o.fromBufferAttribute(t,_),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,m),c.fromBufferAttribute(i,_),a.add(u),l.add(u),c.add(u),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(m,l.x,l.y,l.z),i.setXYZ(_,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Mn.fromBufferAttribute(e,t),Mn.normalize(),e.setXYZ(t,Mn.x,Mn.y,Mn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let d=0,p=0;for(let m=0,_=l.length;m<_;m++){a.isInterleavedBufferAttribute?d=l[m]*a.data.stride+a.offset:d=l[m]*u;for(let g=0;g<u;g++)f[p++]=c[d++]}return new pn(f,u,h)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new tr,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],d=e(f,i);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const d=c[h];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let rC=0;class tc extends Ro{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rC++}),this.uuid=Ql(),this.name="",this.type="Material",this.blending=va,this.side=Fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ad,this.blendDst=Rd,this.blendEquation=eo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=Da,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bo,this.stencilZFail=Bo,this.stencilZPass=Bo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==va&&(i.blending=this.blending),this.side!==Fs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ad&&(i.blendSrc=this.blendSrc),this.blendDst!==Rd&&(i.blendDst=this.blendDst),this.blendEquation!==eo&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Da&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mg&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Bo&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Bo&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Bo&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Lr=new te,Sh=new te,Ic=new te,cs=new te,Mh=new te,Nc=new te,bh=new te;class Um{constructor(e=new te,t=new te(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Lr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Lr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Lr.copy(this.origin).addScaledVector(this.direction,t),Lr.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Sh.copy(e).add(t).multiplyScalar(.5),Ic.copy(t).sub(e).normalize(),cs.copy(this.origin).sub(Sh);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Ic),a=cs.dot(this.direction),l=-cs.dot(Ic),c=cs.lengthSq(),u=Math.abs(1-o*o);let h,f,d,p;if(u>0)if(h=o*l-a,f=o*a-l,p=s*u,h>=0)if(f>=-p)if(f<=p){const m=1/u;h*=m,f*=m,d=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f<=-p?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c):f<=p?(h=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Sh).addScaledVector(Ic,f),d}intersectSphere(e,t){Lr.subVectors(e.center,this.origin);const i=Lr.dot(this.direction),r=Lr.dot(Lr)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Lr)!==null}intersectTriangle(e,t,i,r,s){Mh.subVectors(t,e),Nc.subVectors(i,e),bh.crossVectors(Mh,Nc);let o=this.direction.dot(bh),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;cs.subVectors(this.origin,e);const l=a*this.direction.dot(Nc.crossVectors(cs,Nc));if(l<0)return null;const c=a*this.direction.dot(Mh.cross(cs));if(c<0||l+c>o)return null;const u=-a*cs.dot(bh);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class hS extends tc{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wo,this.combine=Xy,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Bg=new tn,qs=new Um,Uc=new gf,kg=new te,Fc=new te,Oc=new te,Bc=new te,Eh=new te,kc=new te,Hg=new te,Hc=new te;class es extends hi{constructor(e=new tr,t=new hS){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){kc.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Eh.fromBufferAttribute(h,e),o?kc.addScaledVector(Eh,u):kc.addScaledVector(Eh.sub(t),u))}t.add(kc)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Uc.copy(i.boundingSphere),Uc.applyMatrix4(s),qs.copy(e.ray).recast(e.near),!(Uc.containsPoint(qs.origin)===!1&&(qs.intersectSphere(Uc,kg)===null||qs.origin.distanceToSquared(kg)>(e.far-e.near)**2))&&(Bg.copy(s).invert(),qs.copy(e.ray).applyMatrix4(Bg),!(i.boundingBox!==null&&qs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,qs)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,m=f.length;p<m;p++){const _=f[p],g=o[_.materialIndex],y=Math.max(_.start,d.start),v=Math.min(a.count,Math.min(_.start+_.count,d.start+d.count));for(let x=y,b=v;x<b;x+=3){const T=a.getX(x),w=a.getX(x+1),S=a.getX(x+2);r=zc(this,g,e,i,c,u,h,T,w,S),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const p=Math.max(0,d.start),m=Math.min(a.count,d.start+d.count);for(let _=p,g=m;_<g;_+=3){const y=a.getX(_),v=a.getX(_+1),x=a.getX(_+2);r=zc(this,o,e,i,c,u,h,y,v,x),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,m=f.length;p<m;p++){const _=f[p],g=o[_.materialIndex],y=Math.max(_.start,d.start),v=Math.min(l.count,Math.min(_.start+_.count,d.start+d.count));for(let x=y,b=v;x<b;x+=3){const T=x,w=x+1,S=x+2;r=zc(this,g,e,i,c,u,h,T,w,S),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const p=Math.max(0,d.start),m=Math.min(l.count,d.start+d.count);for(let _=p,g=m;_<g;_+=3){const y=_,v=_+1,x=_+2;r=zc(this,o,e,i,c,u,h,y,v,x),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}}}function sC(n,e,t,i,r,s,o,a){let l;if(e.side===fi?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Fs,a),l===null)return null;Hc.copy(a),Hc.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Hc);return c<t.near||c>t.far?null:{distance:c,point:Hc.clone(),object:n}}function zc(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Fc),n.getVertexPosition(l,Oc),n.getVertexPosition(c,Bc);const u=sC(n,e,t,i,Fc,Oc,Bc,Hg);if(u){const h=new te;ji.getBarycoord(Hg,Fc,Oc,Bc,h),r&&(u.uv=ji.getInterpolatedAttribute(r,a,l,c,h,new Mt)),s&&(u.uv1=ji.getInterpolatedAttribute(s,a,l,c,h,new Mt)),o&&(u.normal=ji.getInterpolatedAttribute(o,a,l,c,h,new te),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new te,materialIndex:0};ji.getNormal(Fc,Oc,Bc,f.normal),u.face=f,u.barycoord=h}return u}class oC extends Xn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Pn,u=Pn,h,f){super(null,o,a,l,c,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Th=new te,aC=new te,lC=new tt;class ps{constructor(e=new te(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Th.subVectors(i,t).cross(aC.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(Th),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||lC.getNormalMatrix(e),r=this.coplanarPoint(Th).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ys=new gf,cC=new Mt(.5,.5),Vc=new te;class dS{constructor(e=new ps,t=new ps,i=new ps,r=new ps,s=new ps,o=new ps){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mr,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],f=s[6],d=s[7],p=s[8],m=s[9],_=s[10],g=s[11],y=s[12],v=s[13],x=s[14],b=s[15];if(r[0].setComponents(c-o,d-u,g-p,b-y).normalize(),r[1].setComponents(c+o,d+u,g+p,b+y).normalize(),r[2].setComponents(c+a,d+h,g+m,b+v).normalize(),r[3].setComponents(c-a,d-h,g-m,b-v).normalize(),i)r[4].setComponents(l,f,_,x).normalize(),r[5].setComponents(c-l,d-f,g-_,b-x).normalize();else if(r[4].setComponents(c-l,d-f,g-_,b-x).normalize(),t===mr)r[5].setComponents(c+l,d+f,g+_,b+x).normalize();else if(t===Gu)r[5].setComponents(l,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ys.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ys.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ys)}intersectsSprite(e){Ys.center.set(0,0,0);const t=cC.distanceTo(e.center);return Ys.radius=.7071067811865476+t,Ys.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ys)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Vc.x=r.normal.x>0?e.max.x:e.min.x,Vc.y=r.normal.y>0?e.max.y:e.min.y,Vc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Vc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class uC extends tc{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const zg=new tn,_p=new Um,Gc=new gf,Wc=new te;class fC extends hi{constructor(e=new tr,t=new uC){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Gc.copy(i.boundingSphere),Gc.applyMatrix4(r),Gc.radius+=s,e.ray.intersectsSphere(Gc)===!1)return;zg.copy(r).invert(),_p.copy(e.ray).applyMatrix4(zg);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=f,m=d;p<m;p++){const _=c.getX(p);Wc.fromBufferAttribute(h,_),Vg(Wc,_,l,r,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let p=f,m=d;p<m;p++)Wc.fromBufferAttribute(h,p),Vg(Wc,p,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Vg(n,e,t,i,r,s,o){const a=_p.distanceSqToPoint(n);if(a<t){const l=new te;_p.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class pS extends Xn{constructor(e=[],t=Eo,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gg extends Xn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ia extends Xn{constructor(e,t,i=Er,r,s,o,a=Pn,l=Pn,c,u=Qr,h=1){if(u!==Qr&&u!==so)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Im(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class hC extends Ia{constructor(e,t=Er,i=Eo,r,s,o=Pn,a=Pn,l,c=Qr){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class mS extends Xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class nc extends tr{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,d=0;p("z","y","x",-1,-1,i,t,e,o,s,0),p("z","y","x",1,-1,i,t,-e,o,s,1),p("x","z","y",1,1,e,i,t,r,o,2),p("x","z","y",1,-1,e,i,-t,r,o,3),p("x","y","z",1,-1,e,t,i,r,s,4),p("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new $r(c,3)),this.setAttribute("normal",new $r(u,3)),this.setAttribute("uv",new $r(h,2));function p(m,_,g,y,v,x,b,T,w,S,E){const A=x/w,D=b/S,L=x/2,H=b/2,z=T/2,k=w+1,B=S+1;let U=0,G=0;const ee=new te;for(let F=0;F<B;F++){const ve=F*D-H;for(let Te=0;Te<k;Te++){const $e=Te*A-L;ee[m]=$e*y,ee[_]=ve*v,ee[g]=z,c.push(ee.x,ee.y,ee.z),ee[m]=0,ee[_]=0,ee[g]=T>0?1:-1,u.push(ee.x,ee.y,ee.z),h.push(Te/w),h.push(1-F/S),U+=1}}for(let F=0;F<S;F++)for(let ve=0;ve<w;ve++){const Te=f+ve+k*F,$e=f+ve+k*(F+1),Ge=f+(ve+1)+k*(F+1),Oe=f+(ve+1)+k*F;l.push(Te,$e,Oe),l.push($e,Ge,Oe),G+=6}a.addGroup(d,G,E),d+=G,f+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nc(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class vf extends tr{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,f=t/l,d=[],p=[],m=[],_=[];for(let g=0;g<u;g++){const y=g*f-o;for(let v=0;v<c;v++){const x=v*h-s;p.push(x,-y,0),m.push(0,0,1),_.push(v/a),_.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<a;y++){const v=y+c*g,x=y+c*(g+1),b=y+1+c*(g+1),T=y+1+c*g;d.push(v,x,T),d.push(x,b,T)}this.setIndex(d),this.setAttribute("position",new $r(p,3)),this.setAttribute("normal",new $r(m,3)),this.setAttribute("uv",new $r(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vf(e.width,e.height,e.widthSegments,e.heightSegments)}}function Na(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(Wg(r))r.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(Wg(r[0])){const s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function jn(n){const e={};for(let t=0;t<n.length;t++){const i=Na(n[t]);for(const r in i)e[r]=i[r]}return e}function Wg(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function dC(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function _S(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const pC={clone:Na,merge:jn};var mC=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_C=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class er extends tc{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mC,this.fragmentShader=_C,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Na(e.uniforms),this.uniformsGroups=dC(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class gC extends er{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class vC extends tc{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=RR,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class xC extends tc{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Xc=new te,$c=new ka,ir=new te;class gS extends hi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tn,this.projectionMatrix=new tn,this.projectionMatrixInverse=new tn,this.coordinateSystem=mr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Xc,$c,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xc,$c,ir.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Xc,$c,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xc,$c,ir.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const us=new te,Xg=new Mt,$g=new Mt;class Hi extends gS{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mp*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(nh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mp*2*Math.atan(Math.tan(nh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){us.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(us.x,us.y).multiplyScalar(-e/us.z),us.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(us.x,us.y).multiplyScalar(-e/us.z)}getViewSize(e,t){return this.getViewBounds(e,Xg,$g),t.subVectors($g,Xg)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(nh*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class vS extends gS{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const jo=-90,Ko=1;class yC extends hi{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Hi(jo,Ko,e,t);r.layers=this.layers,this.add(r);const s=new Hi(jo,Ko,e,t);s.layers=this.layers,this.add(s);const o=new Hi(jo,Ko,e,t);o.layers=this.layers,this.add(o);const a=new Hi(jo,Ko,e,t);a.layers=this.layers,this.add(a);const l=new Hi(jo,Ko,e,t);l.layers=this.layers,this.add(l);const c=new Hi(jo,Ko,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===mr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Gu)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const m=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let _=!1;e.isWebGLRenderer===!0?_=e.state.buffers.depth.getReversed():_=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=m,e.setRenderTarget(i,5,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class SC extends Hi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const qg=new tn;class MC{constructor(e,t,i=0,r=1/0){this.ray=new Um(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Nm,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):dt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return qg.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qg),this}intersectObject(e,t=!0,i=[]){return gp(e,this,i,t),i.sort(Yg),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)gp(e[r],this,i,t);return i.sort(Yg),i}}function Yg(n,e){return n.distance-e.distance}function gp(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)gp(s[o],e,t,!0)}}class bC{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Je("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Hm=class Hm{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};Hm.prototype.isMatrix2=!0;let jg=Hm;function Kg(n,e,t,i){const r=EC(i);switch(t){case rS:return n*e;case oS:return n*e/r.components*r.byteLength;case Rm:return n*e/r.components*r.byteLength;case To:return n*e*2/r.components*r.byteLength;case Cm:return n*e*2/r.components*r.byteLength;case sS:return n*e*3/r.components*r.byteLength;case Zi:return n*e*4/r.components*r.byteLength;case Pm:return n*e*4/r.components*r.byteLength;case lu:case cu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case uu:case fu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case kd:case zd:return Math.max(n,16)*Math.max(e,8)/4;case Bd:case Hd:return Math.max(n,8)*Math.max(e,8)/2;case Vd:case Gd:case Xd:case $d:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wd:case ku:case qd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case jd:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Kd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Jd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Qd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ep:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case tp:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case np:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ip:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case rp:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case sp:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case op:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ap:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case lp:case cp:case up:return Math.ceil(n/4)*Math.ceil(e/4)*16;case fp:case hp:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Hu:case dp:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function EC(n){switch(n){case zi:case eS:return{byteLength:1,components:1};case Xl:case tS:case Jr:return{byteLength:2,components:1};case wm:case Am:return{byteLength:2,components:4};case Er:case Tm:case pr:return{byteLength:4,components:1};case nS:case iS:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Em}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Em);function xS(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function TC(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<h.length;d++){const p=h[f],m=h[d];m.start<=p.start+p.count+1?p.count=Math.max(p.count,m.start+m.count-p.start):(++f,h[f]=m)}h.length=f+1;for(let d=0,p=h.length;d<p;d++){const m=h[d];n.bufferSubData(c,m.start*u.BYTES_PER_ELEMENT,u,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var wC=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,AC=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,RC=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,CC=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PC=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,DC=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,LC=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,IC=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,NC=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,UC=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,FC=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,OC=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,BC=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,kC=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,HC=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,zC=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,VC=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,GC=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,WC=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,XC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,$C=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,qC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,YC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,jC=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,KC=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ZC=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,JC=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,QC=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,eP=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tP=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nP="gl_FragColor = linearToOutputTexel( gl_FragColor );",iP=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rP=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,sP=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,oP=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,aP=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lP=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cP=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uP=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fP=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hP=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dP=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pP=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mP=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_P=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gP=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,vP=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,xP=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yP=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,SP=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MP=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bP=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,EP=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,TP=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,wP=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,AP=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,RP=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,CP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,PP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,DP=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,LP=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,IP=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,NP=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,UP=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,FP=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,OP=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,BP=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kP=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,HP=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zP=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,VP=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,GP=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,WP=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,XP=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$P=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qP=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,YP=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jP=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,KP=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ZP=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,JP=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,QP=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eD=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tD=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,nD=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,iD=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rD=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sD=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,oD=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,aD=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lD=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,cD=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uD=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fD=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hD=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dD=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,pD=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mD=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_D=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gD=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vD=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xD=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yD=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,SD=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,MD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ED=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,TD=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wD=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,AD=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,CD=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,DD=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LD=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ID=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ND=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,UD=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,FD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,OD=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BD=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kD=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,HD=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,zD=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VD=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GD=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WD=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,XD=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$D=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qD=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,YD=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jD=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KD=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ZD=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JD=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QD=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e3=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,t3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n3=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i3=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,r3=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:wC,alphahash_pars_fragment:AC,alphamap_fragment:RC,alphamap_pars_fragment:CC,alphatest_fragment:PC,alphatest_pars_fragment:DC,aomap_fragment:LC,aomap_pars_fragment:IC,batching_pars_vertex:NC,batching_vertex:UC,begin_vertex:FC,beginnormal_vertex:OC,bsdfs:BC,iridescence_fragment:kC,bumpmap_pars_fragment:HC,clipping_planes_fragment:zC,clipping_planes_pars_fragment:VC,clipping_planes_pars_vertex:GC,clipping_planes_vertex:WC,color_fragment:XC,color_pars_fragment:$C,color_pars_vertex:qC,color_vertex:YC,common:jC,cube_uv_reflection_fragment:KC,defaultnormal_vertex:ZC,displacementmap_pars_vertex:JC,displacementmap_vertex:QC,emissivemap_fragment:eP,emissivemap_pars_fragment:tP,colorspace_fragment:nP,colorspace_pars_fragment:iP,envmap_fragment:rP,envmap_common_pars_fragment:sP,envmap_pars_fragment:oP,envmap_pars_vertex:aP,envmap_physical_pars_fragment:vP,envmap_vertex:lP,fog_vertex:cP,fog_pars_vertex:uP,fog_fragment:fP,fog_pars_fragment:hP,gradientmap_pars_fragment:dP,lightmap_pars_fragment:pP,lights_lambert_fragment:mP,lights_lambert_pars_fragment:_P,lights_pars_begin:gP,lights_toon_fragment:xP,lights_toon_pars_fragment:yP,lights_phong_fragment:SP,lights_phong_pars_fragment:MP,lights_physical_fragment:bP,lights_physical_pars_fragment:EP,lights_fragment_begin:TP,lights_fragment_maps:wP,lights_fragment_end:AP,lightprobes_pars_fragment:RP,logdepthbuf_fragment:CP,logdepthbuf_pars_fragment:PP,logdepthbuf_pars_vertex:DP,logdepthbuf_vertex:LP,map_fragment:IP,map_pars_fragment:NP,map_particle_fragment:UP,map_particle_pars_fragment:FP,metalnessmap_fragment:OP,metalnessmap_pars_fragment:BP,morphinstance_vertex:kP,morphcolor_vertex:HP,morphnormal_vertex:zP,morphtarget_pars_vertex:VP,morphtarget_vertex:GP,normal_fragment_begin:WP,normal_fragment_maps:XP,normal_pars_fragment:$P,normal_pars_vertex:qP,normal_vertex:YP,normalmap_pars_fragment:jP,clearcoat_normal_fragment_begin:KP,clearcoat_normal_fragment_maps:ZP,clearcoat_pars_fragment:JP,iridescence_pars_fragment:QP,opaque_fragment:eD,packing:tD,premultiplied_alpha_fragment:nD,project_vertex:iD,dithering_fragment:rD,dithering_pars_fragment:sD,roughnessmap_fragment:oD,roughnessmap_pars_fragment:aD,shadowmap_pars_fragment:lD,shadowmap_pars_vertex:cD,shadowmap_vertex:uD,shadowmask_pars_fragment:fD,skinbase_vertex:hD,skinning_pars_vertex:dD,skinning_vertex:pD,skinnormal_vertex:mD,specularmap_fragment:_D,specularmap_pars_fragment:gD,tonemapping_fragment:vD,tonemapping_pars_fragment:xD,transmission_fragment:yD,transmission_pars_fragment:SD,uv_pars_fragment:MD,uv_pars_vertex:bD,uv_vertex:ED,worldpos_vertex:TD,background_vert:wD,background_frag:AD,backgroundCube_vert:RD,backgroundCube_frag:CD,cube_vert:PD,cube_frag:DD,depth_vert:LD,depth_frag:ID,distance_vert:ND,distance_frag:UD,equirect_vert:FD,equirect_frag:OD,linedashed_vert:BD,linedashed_frag:kD,meshbasic_vert:HD,meshbasic_frag:zD,meshlambert_vert:VD,meshlambert_frag:GD,meshmatcap_vert:WD,meshmatcap_frag:XD,meshnormal_vert:$D,meshnormal_frag:qD,meshphong_vert:YD,meshphong_frag:jD,meshphysical_vert:KD,meshphysical_frag:ZD,meshtoon_vert:JD,meshtoon_frag:QD,points_vert:e3,points_frag:t3,shadow_vert:n3,shadow_frag:i3,sprite_vert:r3,sprite_frag:s3},Ne={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new te},probesMax:{value:new te},probesResolution:{value:new te}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},ur={basic:{uniforms:jn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:jn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:jn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:jn([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:jn([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new St(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:jn([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:jn([Ne.points,Ne.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:jn([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:jn([Ne.common,Ne.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:jn([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:jn([Ne.sprite,Ne.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distance:{uniforms:jn([Ne.common,Ne.displacementmap,{referencePosition:{value:new te},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distance_vert,fragmentShader:it.distance_frag},shadow:{uniforms:jn([Ne.lights,Ne.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};ur.physical={uniforms:jn([ur.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};const qc={r:0,b:0,g:0},o3=new tn,yS=new tt;yS.set(-1,0,0,0,1,0,0,0,1);function a3(n,e,t,i,r,s){const o=new St(0);let a=r===!0?0:1,l,c,u=null,h=0,f=null;function d(y){let v=y.isScene===!0?y.background:null;if(v&&v.isTexture){const x=y.backgroundBlurriness>0;v=e.get(v,x)}return v}function p(y){let v=!1;const x=d(y);x===null?_(o,a):x&&x.isColor&&(_(x,1),v=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){const x=d(v);x&&(x.isCubeTexture||x.mapping===_f)?(c===void 0&&(c=new es(new nc(1,1,1),new er({name:"BackgroundCubeMaterial",uniforms:Na(ur.backgroundCube.uniforms),vertexShader:ur.backgroundCube.vertexShader,fragmentShader:ur.backgroundCube.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(o3.makeRotationFromEuler(v.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(yS),c.material.toneMapped=ut.getTransfer(x.colorSpace)!==Tt,(u!==x||h!==x.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=x,h=x.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new es(new vf(2,2),new er({name:"BackgroundMaterial",uniforms:Na(ur.background.uniforms),vertexShader:ur.background.vertexShader,fragmentShader:ur.background.fragmentShader,side:Fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ut.getTransfer(x.colorSpace)!==Tt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||h!==x.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,h=x.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function _(y,v){y.getRGB(qc,_S(n)),t.buffers.color.setClear(qc.r,qc.g,qc.b,v,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),a=v,_(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,_(o,a)},render:p,addToRenderList:m,dispose:g}}function l3(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(D,L,H,z,k){let B=!1;const U=h(D,z,H,L);s!==U&&(s=U,c(s.object)),B=d(D,z,H,k),B&&p(D,z,H,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,x(D,L,H,z),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function u(D){return n.deleteVertexArray(D)}function h(D,L,H,z){const k=z.wireframe===!0;let B=i[L.id];B===void 0&&(B={},i[L.id]=B);const U=D.isInstancedMesh===!0?D.id:0;let G=B[U];G===void 0&&(G={},B[U]=G);let ee=G[H.id];ee===void 0&&(ee={},G[H.id]=ee);let F=ee[k];return F===void 0&&(F=f(l()),ee[k]=F),F}function f(D){const L=[],H=[],z=[];for(let k=0;k<t;k++)L[k]=0,H[k]=0,z[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:H,attributeDivisors:z,object:D,attributes:{},index:null}}function d(D,L,H,z){const k=s.attributes,B=L.attributes;let U=0;const G=H.getAttributes();for(const ee in G)if(G[ee].location>=0){const ve=k[ee];let Te=B[ee];if(Te===void 0&&(ee==="instanceMatrix"&&D.instanceMatrix&&(Te=D.instanceMatrix),ee==="instanceColor"&&D.instanceColor&&(Te=D.instanceColor)),ve===void 0||ve.attribute!==Te||Te&&ve.data!==Te.data)return!0;U++}return s.attributesNum!==U||s.index!==z}function p(D,L,H,z){const k={},B=L.attributes;let U=0;const G=H.getAttributes();for(const ee in G)if(G[ee].location>=0){let ve=B[ee];ve===void 0&&(ee==="instanceMatrix"&&D.instanceMatrix&&(ve=D.instanceMatrix),ee==="instanceColor"&&D.instanceColor&&(ve=D.instanceColor));const Te={};Te.attribute=ve,ve&&ve.data&&(Te.data=ve.data),k[ee]=Te,U++}s.attributes=k,s.attributesNum=U,s.index=z}function m(){const D=s.newAttributes;for(let L=0,H=D.length;L<H;L++)D[L]=0}function _(D){g(D,0)}function g(D,L){const H=s.newAttributes,z=s.enabledAttributes,k=s.attributeDivisors;H[D]=1,z[D]===0&&(n.enableVertexAttribArray(D),z[D]=1),k[D]!==L&&(n.vertexAttribDivisor(D,L),k[D]=L)}function y(){const D=s.newAttributes,L=s.enabledAttributes;for(let H=0,z=L.length;H<z;H++)L[H]!==D[H]&&(n.disableVertexAttribArray(H),L[H]=0)}function v(D,L,H,z,k,B,U){U===!0?n.vertexAttribIPointer(D,L,H,k,B):n.vertexAttribPointer(D,L,H,z,k,B)}function x(D,L,H,z){m();const k=z.attributes,B=H.getAttributes(),U=L.defaultAttributeValues;for(const G in B){const ee=B[G];if(ee.location>=0){let F=k[G];if(F===void 0&&(G==="instanceMatrix"&&D.instanceMatrix&&(F=D.instanceMatrix),G==="instanceColor"&&D.instanceColor&&(F=D.instanceColor)),F!==void 0){const ve=F.normalized,Te=F.itemSize,$e=e.get(F);if($e===void 0)continue;const Ge=$e.buffer,Oe=$e.type,Y=$e.bytesPerElement,ce=Oe===n.INT||Oe===n.UNSIGNED_INT||F.gpuType===Tm;if(F.isInterleavedBufferAttribute){const ue=F.data,Ce=ue.stride,Fe=F.offset;if(ue.isInstancedInterleavedBuffer){for(let Le=0;Le<ee.locationSize;Le++)g(ee.location+Le,ue.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let Le=0;Le<ee.locationSize;Le++)_(ee.location+Le);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let Le=0;Le<ee.locationSize;Le++)v(ee.location+Le,Te/ee.locationSize,Oe,ve,Ce*Y,(Fe+Te/ee.locationSize*Le)*Y,ce)}else{if(F.isInstancedBufferAttribute){for(let ue=0;ue<ee.locationSize;ue++)g(ee.location+ue,F.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let ue=0;ue<ee.locationSize;ue++)_(ee.location+ue);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ue=0;ue<ee.locationSize;ue++)v(ee.location+ue,Te/ee.locationSize,Oe,ve,Te*Y,Te/ee.locationSize*ue*Y,ce)}}else if(U!==void 0){const ve=U[G];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(ee.location,ve);break;case 3:n.vertexAttrib3fv(ee.location,ve);break;case 4:n.vertexAttrib4fv(ee.location,ve);break;default:n.vertexAttrib1fv(ee.location,ve)}}}}y()}function b(){E();for(const D in i){const L=i[D];for(const H in L){const z=L[H];for(const k in z){const B=z[k];for(const U in B)u(B[U].object),delete B[U];delete z[k]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const L=i[D.id];for(const H in L){const z=L[H];for(const k in z){const B=z[k];for(const U in B)u(B[U].object),delete B[U];delete z[k]}}delete i[D.id]}function w(D){for(const L in i){const H=i[L];for(const z in H){const k=H[z];if(k[D.id]===void 0)continue;const B=k[D.id];for(const U in B)u(B[U].object),delete B[U];delete k[D.id]}}}function S(D){for(const L in i){const H=i[L],z=D.isInstancedMesh===!0?D.id:0,k=H[z];if(k!==void 0){for(const B in k){const U=k[B];for(const G in U)u(U[G].object),delete U[G];delete k[B]}delete H[z],Object.keys(H).length===0&&delete i[L]}}}function E(){A(),o=!0,s!==r&&(s=r,c(s.object))}function A(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:E,resetDefaultState:A,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:S,releaseStatesOfProgram:w,initAttributes:m,enableAttribute:_,disableUnusedAttributes:y}}function c3(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let f=0;for(let d=0;d<u;d++)f+=c[d];t.update(f,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function u3(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==Zi&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const S=w===Jr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==zi&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==pr&&!S)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Je("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:x,maxSamples:b,samples:T}}function f3(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new ps,a=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||i!==0||r;return r=f,i=h.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const p=h.clippingPlanes,m=h.clipIntersection,_=h.clipShadows,g=n.get(h);if(!r||p===null||p.length===0||s&&!_)s?u(null):c();else{const y=s?0:i,v=y*4;let x=g.clippingState||null;l.value=x,x=u(p,f,v,d);for(let b=0;b!==v;++b)x[b]=t[b];g.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,p){const m=h!==null?h.length:0;let _=null;if(m!==0){if(_=l.value,p!==!0||_===null){const g=d+m*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(_===null||_.length<g)&&(_=new Float32Array(g));for(let v=0,x=d;v!==m;++v,x+=4)o.copy(h[v]).applyMatrix4(y,a),o.normal.toArray(_,x),_[x+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,_}}const Ts=4,Zg=[.125,.215,.35,.446,.526,.582],to=20,h3=256,Za=new vS,Jg=new St;let wh=null,Ah=0,Rh=0,Ch=!1;const d3=new te;class Qg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=d3}=s;wh=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Rh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=n0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=t0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(wh,Ah,Rh),this._renderer.xr.enabled=Ch,e.scissorTest=!1,Zo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Eo||e.mapping===La?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wh=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Rh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:_n,minFilter:_n,generateMipmaps:!1,type:Jr,format:Zi,colorSpace:zu,depthBuffer:!1},r=e0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=e0(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=p3(s)),this._blurMaterial=_3(s,e,t),this._ggxMaterial=m3(s,e,t)}return r}_compileMaterial(e){const t=new es(new tr,e);this._renderer.compile(t,Za)}_sceneToCubeUV(e,t,i,r,s){const l=new Hi(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Jg),h.toneMapping=vr,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new es(new nc,new hS({name:"PMREM.Background",side:fi,depthWrite:!1,depthTest:!1})));const m=this._backgroundBox,_=m.material;let g=!1;const y=e.background;y?y.isColor&&(_.color.copy(y),e.background=null,g=!0):(_.color.copy(Jg),g=!0);for(let v=0;v<6;v++){const x=v%3;x===0?(l.up.set(0,c[v],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[v],s.y,s.z)):x===1?(l.up.set(0,0,c[v]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[v],s.z)):(l.up.set(0,c[v],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[v]));const b=this._cubeSize;Zo(r,x*b,v>2?b:0,b,b),h.setRenderTarget(r),g&&h.render(m,l),h.render(e,l)}h.toneMapping=d,h.autoClear=f,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Eo||e.mapping===La;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=n0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=t0());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Zo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Za)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),f=0+c*1.25,d=h*f,{_lodMax:p}=this,m=this._sizeLods[i],_=3*m*(i>p-Ts?i-p+Ts:0),g=4*(this._cubeSize-m);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=p-t,Zo(s,_,g,3*m,2*m),r.setRenderTarget(s),r.render(a,Za),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-i,Zo(e,_,g,3*m,2*m),r.setRenderTarget(e),r.render(a,Za)}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&dt("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[r];h.material=c;const f=c.uniforms,d=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*to-1),m=s/p,_=isFinite(s)?1+Math.floor(u*m):to;_>to&&Je(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${to}`);const g=[];let y=0;for(let w=0;w<to;++w){const S=w/m,E=Math.exp(-S*S/2);g.push(E),w===0?y+=E:w<_&&(y+=2*E)}for(let w=0;w<g.length;w++)g[w]=g[w]/y;f.envMap.value=e.texture,f.samples.value=_,f.weights.value=g,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=p,f.mipInt.value=v-i;const x=this._sizeLods[r],b=3*x*(r>v-Ts?r-v+Ts:0),T=4*(this._cubeSize-x);Zo(t,b,T,3*x,2*x),l.setRenderTarget(t),l.render(h,Za)}}function p3(n){const e=[],t=[],i=[];let r=n;const s=n-Ts+1+Zg.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>n-Ts?l=Zg[o-n+Ts-1]:o===0&&(l=0),t.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,p=6,m=3,_=2,g=1,y=new Float32Array(m*p*d),v=new Float32Array(_*p*d),x=new Float32Array(g*p*d);for(let T=0;T<d;T++){const w=T%3*2/3-1,S=T>2?0:-1,E=[w,S,0,w+2/3,S,0,w+2/3,S+1,0,w,S,0,w+2/3,S+1,0,w,S+1,0];y.set(E,m*p*T),v.set(f,_*p*T);const A=[T,T,T,T,T,T];x.set(A,g*p*T)}const b=new tr;b.setAttribute("position",new pn(y,m)),b.setAttribute("uv",new pn(v,_)),b.setAttribute("faceIndex",new pn(x,g)),i.push(new es(b,null)),r>Ts&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function e0(n,e,t){const i=new xr(n,e,t);return i.texture.mapping=_f,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function m3(n,e,t){return new er({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:h3,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Wr,depthTest:!1,depthWrite:!1})}function _3(n,e,t){const i=new Float32Array(to),r=new te(0,1,0);return new er({name:"SphericalGaussianBlur",defines:{n:to,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:xf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wr,depthTest:!1,depthWrite:!1})}function t0(){return new er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wr,depthTest:!1,depthWrite:!1})}function n0(){return new er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wr,depthTest:!1,depthWrite:!1})}function xf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class SS extends xr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new pS(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new nc(5,5,5),s=new er({name:"CubemapFromEquirect",uniforms:Na(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:fi,blending:Wr});s.uniforms.tEquirect.value=t;const o=new es(r,s),a=t.minFilter;return t.minFilter===Es&&(t.minFilter=_n),new yC(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}function g3(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,d=!1){return f==null?null:d?o(f):s(f)}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===Qf||d===eh)if(e.has(f)){const p=e.get(f).texture;return a(p,f.mapping)}else{const p=f.image;if(p&&p.height>0){const m=new SS(p.height);return m.fromEquirectangularTexture(n,f),e.set(f,m),f.addEventListener("dispose",c),a(m.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const d=f.mapping,p=d===Qf||d===eh,m=d===Eo||d===La;if(p||m){let _=t.get(f);const g=_!==void 0?_.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return i===null&&(i=new Qg(n)),_=p?i.fromEquirectangular(f,_):i.fromCubemap(f,_),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),_.texture;if(_!==void 0)return _.texture;{const y=f.image;return p&&y&&y.height>0||m&&y&&l(y)?(i===null&&(i=new Qg(n)),_=p?i.fromEquirectangular(f):i.fromCubemap(f),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),f.addEventListener("dispose",u),_.texture):null}}}return f}function a(f,d){return d===Qf?f.mapping=Eo:d===eh&&(f.mapping=La),f}function l(f){let d=0;const p=6;for(let m=0;m<p;m++)f[m]!==void 0&&d++;return d===p}function c(f){const d=f.target;d.removeEventListener("dispose",c);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(f){const d=f.target;d.removeEventListener("dispose",u);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function v3(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&pp("WebGLRenderer: "+i+" extension not supported."),r}}}function x3(n,e,t,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete r[f.id];const d=s.get(f);d&&(e.remove(d),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const d in f)e.update(f[d],n.ARRAY_BUFFER)}function c(h){const f=[],d=h.index,p=h.attributes.position;let m=0;if(p===void 0)return;if(d!==null){const y=d.array;m=d.version;for(let v=0,x=y.length;v<x;v+=3){const b=y[v+0],T=y[v+1],w=y[v+2];f.push(b,T,T,w,w,b)}}else{const y=p.array;m=p.version;for(let v=0,x=y.length/3-1;v<x;v+=3){const b=v+0,T=v+1,w=v+2;f.push(b,T,T,w,w,b)}}const _=new(p.count>=65535?fS:uS)(f,1);_.version=m;const g=s.get(h);g&&e.remove(g),s.set(h,_)}function u(h){const f=s.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function y3(n,e,t){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,f){n.drawElements(i,f,s,h*o),t.update(f,i,1)}function c(h,f,d){d!==0&&(n.drawElementsInstanced(i,f,s,h*o,d),t.update(f,i,d))}function u(h,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,d);let m=0;for(let _=0;_<d;_++)m+=f[_];t.update(m,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function S3(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:dt("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function M3(n,e,t){const i=new WeakMap,r=new Jt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let E=function(){w.dispose(),i.delete(a),a.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let v=0;d===!0&&(v=1),p===!0&&(v=2),m===!0&&(v=3);let x=a.attributes.position.count*v,b=1;x>e.maxTextureSize&&(b=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const T=new Float32Array(x*b*4*h),w=new lS(T,x,b,h);w.type=pr,w.needsUpdate=!0;const S=v*4;for(let A=0;A<h;A++){const D=_[A],L=g[A],H=y[A],z=x*b*4*A;for(let k=0;k<D.count;k++){const B=k*S;d===!0&&(r.fromBufferAttribute(D,k),T[z+B+0]=r.x,T[z+B+1]=r.y,T[z+B+2]=r.z,T[z+B+3]=0),p===!0&&(r.fromBufferAttribute(L,k),T[z+B+4]=r.x,T[z+B+5]=r.y,T[z+B+6]=r.z,T[z+B+7]=0),m===!0&&(r.fromBufferAttribute(H,k),T[z+B+8]=r.x,T[z+B+9]=r.y,T[z+B+10]=r.z,T[z+B+11]=H.itemSize===4?r.w:1)}}f={count:h,texture:w,size:new Mt(x,b)},i.set(a,f),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let m=0;m<c.length;m++)d+=c[m];const p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function b3(n,e,t,i,r){let s=new WeakMap;function o(c){const u=r.render.frame,h=c.geometry,f=e.get(c,h);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return f}function a(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}const E3={[$y]:"LINEAR_TONE_MAPPING",[qy]:"REINHARD_TONE_MAPPING",[Yy]:"CINEON_TONE_MAPPING",[jy]:"ACES_FILMIC_TONE_MAPPING",[Zy]:"AGX_TONE_MAPPING",[Jy]:"NEUTRAL_TONE_MAPPING",[Ky]:"CUSTOM_TONE_MAPPING"};function T3(n,e,t,i,r){const s=new xr(e,t,{type:n,depthBuffer:i,stencilBuffer:r,depthTexture:i?new Ia(e,t):void 0}),o=new xr(e,t,{type:Jr,depthBuffer:!1,stencilBuffer:!1}),a=new tr;a.setAttribute("position",new $r([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new $r([0,2,0,0,2,0],2));const l=new gC({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new es(a,l),u=new vS(-1,1,1,-1,0,1);let h=null,f=null,d=!1,p,m=null,_=[],g=!1;this.setSize=function(y,v){s.setSize(y,v),o.setSize(y,v);for(let x=0;x<_.length;x++){const b=_[x];b.setSize&&b.setSize(y,v)}},this.setEffects=function(y){_=y,g=_.length>0&&_[0].isRenderPass===!0;const v=s.width,x=s.height;for(let b=0;b<_.length;b++){const T=_[b];T.setSize&&T.setSize(v,x)}},this.begin=function(y,v){if(d||y.toneMapping===vr&&_.length===0)return!1;if(m=v,v!==null){const x=v.width,b=v.height;(s.width!==x||s.height!==b)&&this.setSize(x,b)}return g===!1&&y.setRenderTarget(s),p=y.toneMapping,y.toneMapping=vr,!0},this.hasRenderPass=function(){return g},this.end=function(y,v){y.toneMapping=p,d=!0;let x=s,b=o;for(let T=0;T<_.length;T++){const w=_[T];if(w.enabled!==!1&&(w.render(y,b,x,v),w.needsSwap!==!1)){const S=x;x=b,b=S}}if(h!==y.outputColorSpace||f!==y.toneMapping){h=y.outputColorSpace,f=y.toneMapping,l.defines={},ut.getTransfer(h)===Tt&&(l.defines.SRGB_TRANSFER="");const T=E3[f];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,y.setRenderTarget(m),y.render(c,u),m=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const MS=new Xn,vp=new Ia(1,1),bS=new lS,ES=new $R,TS=new pS,i0=[],r0=[],s0=new Float32Array(16),o0=new Float32Array(9),a0=new Float32Array(4);function Ha(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=i0[r];if(s===void 0&&(s=new Float32Array(r),i0[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function gn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function yf(n,e){let t=r0[e];t===void 0&&(t=new Int32Array(e),r0[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function w3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function A3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2fv(this.addr,e),vn(t,e)}}function R3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gn(t,e))return;n.uniform3fv(this.addr,e),vn(t,e)}}function C3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4fv(this.addr,e),vn(t,e)}}function P3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;a0.set(i),n.uniformMatrix2fv(this.addr,!1,a0),vn(t,i)}}function D3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;o0.set(i),n.uniformMatrix3fv(this.addr,!1,o0),vn(t,i)}}function L3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(gn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vn(t,e)}else{if(gn(t,i))return;s0.set(i),n.uniformMatrix4fv(this.addr,!1,s0),vn(t,i)}}function I3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function N3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2iv(this.addr,e),vn(t,e)}}function U3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gn(t,e))return;n.uniform3iv(this.addr,e),vn(t,e)}}function F3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4iv(this.addr,e),vn(t,e)}}function O3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function B3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gn(t,e))return;n.uniform2uiv(this.addr,e),vn(t,e)}}function k3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gn(t,e))return;n.uniform3uiv(this.addr,e),vn(t,e)}}function H3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gn(t,e))return;n.uniform4uiv(this.addr,e),vn(t,e)}}function z3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(vp.compareFunction=t.isReversedDepthBuffer()?Lm:Dm,s=vp):s=MS,t.setTexture2D(e||s,r)}function V3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||ES,r)}function G3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||TS,r)}function W3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||bS,r)}function X3(n){switch(n){case 5126:return w3;case 35664:return A3;case 35665:return R3;case 35666:return C3;case 35674:return P3;case 35675:return D3;case 35676:return L3;case 5124:case 35670:return I3;case 35667:case 35671:return N3;case 35668:case 35672:return U3;case 35669:case 35673:return F3;case 5125:return O3;case 36294:return B3;case 36295:return k3;case 36296:return H3;case 35678:case 36198:case 36298:case 36306:case 35682:return z3;case 35679:case 36299:case 36307:return V3;case 35680:case 36300:case 36308:case 36293:return G3;case 36289:case 36303:case 36311:case 36292:return W3}}function $3(n,e){n.uniform1fv(this.addr,e)}function q3(n,e){const t=Ha(e,this.size,2);n.uniform2fv(this.addr,t)}function Y3(n,e){const t=Ha(e,this.size,3);n.uniform3fv(this.addr,t)}function j3(n,e){const t=Ha(e,this.size,4);n.uniform4fv(this.addr,t)}function K3(n,e){const t=Ha(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Z3(n,e){const t=Ha(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function J3(n,e){const t=Ha(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Q3(n,e){n.uniform1iv(this.addr,e)}function e2(n,e){n.uniform2iv(this.addr,e)}function t2(n,e){n.uniform3iv(this.addr,e)}function n2(n,e){n.uniform4iv(this.addr,e)}function i2(n,e){n.uniform1uiv(this.addr,e)}function r2(n,e){n.uniform2uiv(this.addr,e)}function s2(n,e){n.uniform3uiv(this.addr,e)}function o2(n,e){n.uniform4uiv(this.addr,e)}function a2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);gn(i,s)||(n.uniform1iv(this.addr,s),vn(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=vp:o=MS;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function l2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);gn(i,s)||(n.uniform1iv(this.addr,s),vn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||ES,s[o])}function c2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);gn(i,s)||(n.uniform1iv(this.addr,s),vn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||TS,s[o])}function u2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);gn(i,s)||(n.uniform1iv(this.addr,s),vn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||bS,s[o])}function f2(n){switch(n){case 5126:return $3;case 35664:return q3;case 35665:return Y3;case 35666:return j3;case 35674:return K3;case 35675:return Z3;case 35676:return J3;case 5124:case 35670:return Q3;case 35667:case 35671:return e2;case 35668:case 35672:return t2;case 35669:case 35673:return n2;case 5125:return i2;case 36294:return r2;case 36295:return s2;case 36296:return o2;case 35678:case 36198:case 36298:case 36306:case 35682:return a2;case 35679:case 36299:case 36307:return l2;case 35680:case 36300:case 36308:case 36293:return c2;case 36289:case 36303:case 36311:case 36292:return u2}}class h2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=X3(t.type)}}class d2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=f2(t.type)}}class p2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ph=/(\w+)(\])?(\[|\.)?/g;function l0(n,e){n.seq.push(e),n.map[e.id]=e}function m2(n,e,t){const i=n.name,r=i.length;for(Ph.lastIndex=0;;){const s=Ph.exec(i),o=Ph.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){l0(t,c===void 0?new h2(a,n,e):new d2(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new p2(a),l0(t,h)),t=h}}}class hu{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);m2(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function c0(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const _2=37297;let g2=0;function v2(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const u0=new tt;function x2(n){ut._getMatrix(u0,ut.workingColorSpace,n);const e=`mat3( ${u0.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(n)){case Vu:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function f0(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+v2(n.getShaderSource(e),a)}else return s}function y2(n,e){const t=x2(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const S2={[$y]:"Linear",[qy]:"Reinhard",[Yy]:"Cineon",[jy]:"ACESFilmic",[Zy]:"AgX",[Jy]:"Neutral",[Ky]:"Custom"};function M2(n,e){const t=S2[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Yc=new te;function b2(){ut.getLuminanceCoefficients(Yc);const n=Yc.x.toFixed(4),e=Yc.y.toFixed(4),t=Yc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function E2(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cl).join(`
`)}function T2(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function w2(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function cl(n){return n!==""}function h0(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function d0(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const A2=/^[ \t]*#include +<([\w\d./]+)>/gm;function xp(n){return n.replace(A2,C2)}const R2=new Map;function C2(n,e){let t=it[e];if(t===void 0){const i=R2.get(e);if(i!==void 0)t=it[i],Je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return xp(t)}const P2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function p0(n){return n.replace(P2,D2)}function D2(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function m0(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const L2={[au]:"SHADOWMAP_TYPE_PCF",[ll]:"SHADOWMAP_TYPE_VSM"};function I2(n){return L2[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const N2={[Eo]:"ENVMAP_TYPE_CUBE",[La]:"ENVMAP_TYPE_CUBE",[_f]:"ENVMAP_TYPE_CUBE_UV"};function U2(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":N2[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const F2={[La]:"ENVMAP_MODE_REFRACTION"};function O2(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":F2[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const B2={[Xy]:"ENVMAP_BLENDING_MULTIPLY",[TR]:"ENVMAP_BLENDING_MIX",[wR]:"ENVMAP_BLENDING_ADD"};function k2(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":B2[n.combine]||"ENVMAP_BLENDING_NONE"}function H2(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function z2(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=I2(t),c=U2(t),u=O2(t),h=k2(t),f=H2(t),d=E2(t),p=T2(s),m=r.createProgram();let _,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(cl).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(cl).join(`
`),g.length>0&&(g+=`
`)):(_=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cl).join(`
`),g=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==vr?"#define TONE_MAPPING":"",t.toneMapping!==vr?it.tonemapping_pars_fragment:"",t.toneMapping!==vr?M2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,y2("linearToOutputTexel",t.outputColorSpace),b2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(cl).join(`
`)),o=xp(o),o=h0(o,t),o=d0(o,t),a=xp(a),a=h0(a,t),a=d0(a,t),o=p0(o),a=p0(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===Eg?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Eg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const v=y+_+o,x=y+g+a,b=c0(r,r.VERTEX_SHADER,v),T=c0(r,r.FRAGMENT_SHADER,x);r.attachShader(m,b),r.attachShader(m,T),t.index0AttributeName!==void 0?r.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(m,0,"position"),r.linkProgram(m);function w(D){if(n.debug.checkShaderErrors){const L=r.getProgramInfoLog(m)||"",H=r.getShaderInfoLog(b)||"",z=r.getShaderInfoLog(T)||"",k=L.trim(),B=H.trim(),U=z.trim();let G=!0,ee=!0;if(r.getProgramParameter(m,r.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,m,b,T);else{const F=f0(r,b,"vertex"),ve=f0(r,T,"fragment");dt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(m,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+k+`
`+F+`
`+ve)}else k!==""?Je("WebGLProgram: Program Info Log:",k):(B===""||U==="")&&(ee=!1);ee&&(D.diagnostics={runnable:G,programLog:k,vertexShader:{log:B,prefix:_},fragmentShader:{log:U,prefix:g}})}r.deleteShader(b),r.deleteShader(T),S=new hu(r,m),E=w2(r,m)}let S;this.getUniforms=function(){return S===void 0&&w(this),S};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=r.getProgramParameter(m,_2)),A},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=g2++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=T,this}let V2=0;class G2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new W2(e),t.set(e,i)),i}}class W2{constructor(e){this.id=V2++,this.code=e,this.usedTimes=0}}function X2(n){return n===To||n===ku||n===Hu}function $2(n,e,t,i,r,s){const o=new Nm,a=new G2,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer;let f=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,E,A,D,L,H){const z=D.fog,k=L.geometry,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?D.environment:null,U=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,G=e.get(S.envMap||B,U),ee=G&&G.mapping===_f?G.image.height:null,F=d[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&Je("WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const ve=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Te=ve!==void 0?ve.length:0;let $e=0;k.morphAttributes.position!==void 0&&($e=1),k.morphAttributes.normal!==void 0&&($e=2),k.morphAttributes.color!==void 0&&($e=3);let Ge,Oe,Y,ce;if(F){const Ae=ur[F];Ge=Ae.vertexShader,Oe=Ae.fragmentShader}else Ge=S.vertexShader,Oe=S.fragmentShader,a.update(S),Y=a.getVertexShaderID(S),ce=a.getFragmentShaderID(S);const ue=n.getRenderTarget(),Ce=n.state.buffers.depth.getReversed(),Fe=L.isInstancedMesh===!0,Le=L.isBatchedMesh===!0,ke=!!S.map,P=!!S.matcap,O=!!G,q=!!S.aoMap,$=!!S.lightMap,N=!!S.bumpMap,Z=!!S.normalMap,fe=!!S.displacementMap,I=!!S.emissiveMap,se=!!S.metalnessMap,ne=!!S.roughnessMap,xe=S.anisotropy>0,K=S.clearcoat>0,_e=S.dispersion>0,R=S.iridescence>0,M=S.sheen>0,W=S.transmission>0,J=xe&&!!S.anisotropyMap,oe=K&&!!S.clearcoatMap,me=K&&!!S.clearcoatNormalMap,de=K&&!!S.clearcoatRoughnessMap,re=R&&!!S.iridescenceMap,le=R&&!!S.iridescenceThicknessMap,Ee=M&&!!S.sheenColorMap,he=M&&!!S.sheenRoughnessMap,pe=!!S.specularMap,ye=!!S.specularColorMap,Re=!!S.specularIntensityMap,je=W&&!!S.transmissionMap,Ze=W&&!!S.thicknessMap,V=!!S.gradientMap,Se=!!S.alphaMap,ae=S.alphaTest>0,Pe=!!S.alphaHash,we=!!S.extensions;let ge=vr;S.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(ge=n.toneMapping);const be={shaderID:F,shaderType:S.type,shaderName:S.name,vertexShader:Ge,fragmentShader:Oe,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:ce,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Le,batchingColor:Le&&L._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&L.instanceColor!==null,instancingMorph:Fe&&L.morphTexture!==null,outputColorSpace:ue===null?n.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:ut.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:ke,matcap:P,envMap:O,envMapMode:O&&G.mapping,envMapCubeUVHeight:ee,aoMap:q,lightMap:$,bumpMap:N,normalMap:Z,displacementMap:fe,emissiveMap:I,normalMapObjectSpace:Z&&S.normalMapType===CR,normalMapTangentSpace:Z&&S.normalMapType===Sg,packedNormalMap:Z&&S.normalMapType===Sg&&X2(S.normalMap.format),metalnessMap:se,roughnessMap:ne,anisotropy:xe,anisotropyMap:J,clearcoat:K,clearcoatMap:oe,clearcoatNormalMap:me,clearcoatRoughnessMap:de,dispersion:_e,iridescence:R,iridescenceMap:re,iridescenceThicknessMap:le,sheen:M,sheenColorMap:Ee,sheenRoughnessMap:he,specularMap:pe,specularColorMap:ye,specularIntensityMap:Re,transmission:W,transmissionMap:je,thicknessMap:Ze,gradientMap:V,opaque:S.transparent===!1&&S.blending===va&&S.alphaToCoverage===!1,alphaMap:Se,alphaTest:ae,alphaHash:Pe,combine:S.combine,mapUv:ke&&p(S.map.channel),aoMapUv:q&&p(S.aoMap.channel),lightMapUv:$&&p(S.lightMap.channel),bumpMapUv:N&&p(S.bumpMap.channel),normalMapUv:Z&&p(S.normalMap.channel),displacementMapUv:fe&&p(S.displacementMap.channel),emissiveMapUv:I&&p(S.emissiveMap.channel),metalnessMapUv:se&&p(S.metalnessMap.channel),roughnessMapUv:ne&&p(S.roughnessMap.channel),anisotropyMapUv:J&&p(S.anisotropyMap.channel),clearcoatMapUv:oe&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:me&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:le&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:he&&p(S.sheenRoughnessMap.channel),specularMapUv:pe&&p(S.specularMap.channel),specularColorMapUv:ye&&p(S.specularColorMap.channel),specularIntensityMapUv:Re&&p(S.specularIntensityMap.channel),transmissionMapUv:je&&p(S.transmissionMap.channel),thicknessMapUv:Ze&&p(S.thicknessMap.channel),alphaMapUv:Se&&p(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Z||xe),vertexNormals:!!k.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!k.attributes.uv&&(ke||Se),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||k.attributes.normal===void 0&&Z===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ce,skinning:L.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:$e,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&A.length>0,shadowMapType:n.shadowMap.type,toneMapping:ge,decodeVideoTexture:ke&&S.map.isVideoTexture===!0&&ut.getTransfer(S.map.colorSpace)===Tt,decodeVideoTextureEmissive:I&&S.emissiveMap.isVideoTexture===!0&&ut.getTransfer(S.emissiveMap.colorSpace)===Tt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===kr,flipSided:S.side===fi,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:we&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(we&&S.extensions.multiDraw===!0||Le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return be.vertexUv1s=l.has(1),be.vertexUv2s=l.has(2),be.vertexUv3s=l.has(3),l.clear(),be}function _(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)E.push(A),E.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(g(E,S),y(E,S),E.push(n.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function g(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function y(S,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),S.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),S.push(o.mask)}function v(S){const E=d[S.type];let A;if(E){const D=ur[E];A=pC.clone(D.uniforms)}else A=S.uniforms;return A}function x(S,E){let A=u.get(E);return A!==void 0?++A.usedTimes:(A=new z2(n,E,S,r),c.push(A),u.set(E,A)),A}function b(S){if(--S.usedTimes===0){const E=c.indexOf(S);c[E]=c[c.length-1],c.pop(),u.delete(S.cacheKey),S.destroy()}}function T(S){a.remove(S)}function w(){a.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:v,acquireProgram:x,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:w}}function q2(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Y2(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function _0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function g0(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,p,m,_,g){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:d,material:p,materialVariant:o(f),groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},n[e]=y):(y.id=f.id,y.object=f,y.geometry=d,y.material=p,y.materialVariant=o(f),y.groupOrder=m,y.renderOrder=f.renderOrder,y.z=_,y.group=g),e++,y}function l(f,d,p,m,_,g){const y=a(f,d,p,m,_,g);p.transmission>0?i.push(y):p.transparent===!0?r.push(y):t.push(y)}function c(f,d,p,m,_,g){const y=a(f,d,p,m,_,g);p.transmission>0?i.unshift(y):p.transparent===!0?r.unshift(y):t.unshift(y)}function u(f,d){t.length>1&&t.sort(f||Y2),i.length>1&&i.sort(d||_0),r.length>1&&r.sort(d||_0)}function h(){for(let f=e,d=n.length;f<d;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:h,sort:u}}function j2(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new g0,n.set(i,[o])):r>=s.length?(o=new g0,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function K2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new te,color:new St};break;case"SpotLight":t={position:new te,direction:new te,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new te,color:new St,distance:0,decay:0};break;case"HemisphereLight":t={direction:new te,skyColor:new St,groundColor:new St};break;case"RectAreaLight":t={color:new St,position:new te,halfWidth:new te,halfHeight:new te};break}return n[e.id]=t,t}}}function Z2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let J2=0;function Q2(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function eL(n){const e=new K2,t=Z2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new te);const r=new te,s=new tn,o=new tn;function a(c){let u=0,h=0,f=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let d=0,p=0,m=0,_=0,g=0,y=0,v=0,x=0,b=0,T=0,w=0;c.sort(Q2);for(let E=0,A=c.length;E<A;E++){const D=c[E],L=D.color,H=D.intensity,z=D.distance;let k=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===To?k=D.shadow.map.texture:k=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=L.r*H,h+=L.g*H,f+=L.b*H;else if(D.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(D.sh.coefficients[B],H);w++}else if(D.isDirectionalLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const U=D.shadow,G=t.get(D);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.directionalShadow[d]=G,i.directionalShadowMap[d]=k,i.directionalShadowMatrix[d]=D.shadow.matrix,y++}i.directional[d]=B,d++}else if(D.isSpotLight){const B=e.get(D);B.position.setFromMatrixPosition(D.matrixWorld),B.color.copy(L).multiplyScalar(H),B.distance=z,B.coneCos=Math.cos(D.angle),B.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),B.decay=D.decay,i.spot[m]=B;const U=D.shadow;if(D.map&&(i.spotLightMap[b]=D.map,b++,U.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[m]=U.matrix,D.castShadow){const G=t.get(D);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,i.spotShadow[m]=G,i.spotShadowMap[m]=k,x++}m++}else if(D.isRectAreaLight){const B=e.get(D);B.color.copy(L).multiplyScalar(H),B.halfWidth.set(D.width*.5,0,0),B.halfHeight.set(0,D.height*.5,0),i.rectArea[_]=B,_++}else if(D.isPointLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),B.distance=D.distance,B.decay=D.decay,D.castShadow){const U=D.shadow,G=t.get(D);G.shadowIntensity=U.intensity,G.shadowBias=U.bias,G.shadowNormalBias=U.normalBias,G.shadowRadius=U.radius,G.shadowMapSize=U.mapSize,G.shadowCameraNear=U.camera.near,G.shadowCameraFar=U.camera.far,i.pointShadow[p]=G,i.pointShadowMap[p]=k,i.pointShadowMatrix[p]=D.shadow.matrix,v++}i.point[p]=B,p++}else if(D.isHemisphereLight){const B=e.get(D);B.skyColor.copy(D.color).multiplyScalar(H),B.groundColor.copy(D.groundColor).multiplyScalar(H),i.hemi[g]=B,g++}}_>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ne.LTC_FLOAT_1,i.rectAreaLTC2=Ne.LTC_FLOAT_2):(i.rectAreaLTC1=Ne.LTC_HALF_1,i.rectAreaLTC2=Ne.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const S=i.hash;(S.directionalLength!==d||S.pointLength!==p||S.spotLength!==m||S.rectAreaLength!==_||S.hemiLength!==g||S.numDirectionalShadows!==y||S.numPointShadows!==v||S.numSpotShadows!==x||S.numSpotMaps!==b||S.numLightProbes!==w)&&(i.directional.length=d,i.spot.length=m,i.rectArea.length=_,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=x+b-T,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=w,S.directionalLength=d,S.pointLength=p,S.spotLength=m,S.rectAreaLength=_,S.hemiLength=g,S.numDirectionalShadows=y,S.numPointShadows=v,S.numSpotShadows=x,S.numSpotMaps=b,S.numLightProbes=w,i.version=J2++)}function l(c,u){let h=0,f=0,d=0,p=0,m=0;const _=u.matrixWorldInverse;for(let g=0,y=c.length;g<y;g++){const v=c[g];if(v.isDirectionalLight){const x=i.directional[h];x.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(_),h++}else if(v.isSpotLight){const x=i.spot[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(_),x.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(_),d++}else if(v.isRectAreaLight){const x=i.rectArea[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(_),o.identity(),s.copy(v.matrixWorld),s.premultiply(_),o.extractRotation(s),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(_),f++}else if(v.isHemisphereLight){const x=i.hemi[m];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(_),m++}}}return{setup:a,setupView:l,state:i}}function v0(n){const e=new eL(n),t=[],i=[],r=[];function s(f){h.camera=f,t.length=0,i.length=0,r.length=0}function o(f){t.push(f)}function a(f){i.push(f)}function l(f){r.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function tL(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new v0(n),e.set(r,[a])):s>=o.length?(a=new v0(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const nL=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iL=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,rL=[new te(1,0,0),new te(-1,0,0),new te(0,1,0),new te(0,-1,0),new te(0,0,1),new te(0,0,-1)],sL=[new te(0,-1,0),new te(0,-1,0),new te(0,0,1),new te(0,0,-1),new te(0,-1,0),new te(0,-1,0)],x0=new tn,Ja=new te,Dh=new te;function oL(n,e,t){let i=new dS;const r=new Mt,s=new Mt,o=new Jt,a=new vC,l=new xC,c={},u=t.maxTextureSize,h={[Fs]:fi,[fi]:Fs,[kr]:kr},f=new er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:nL,fragmentShader:iL}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const p=new tr;p.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new es(p,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=au;let g=this.type;this.render=function(T,w,S){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||T.length===0)return;this.type===oR&&(Je("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=au);const E=n.getRenderTarget(),A=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),L=n.state;L.setBlending(Wr),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const H=g!==this.type;H&&w.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(k=>k.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,k=T.length;z<k;z++){const B=T[z],U=B.shadow;if(U===void 0){Je("WebGLShadowMap:",B,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;r.copy(U.mapSize);const G=U.getFrameExtents();r.multiply(G),s.copy(U.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/G.x),r.x=s.x*G.x,U.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/G.y),r.y=s.y*G.y,U.mapSize.y=s.y));const ee=n.state.buffers.depth.getReversed();if(U.camera._reversedDepth=ee,U.map===null||H===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===ll){if(B.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new xr(r.x,r.y,{format:To,type:Jr,minFilter:_n,magFilter:_n,generateMipmaps:!1}),U.map.texture.name=B.name+".shadowMap",U.map.depthTexture=new Ia(r.x,r.y,pr),U.map.depthTexture.name=B.name+".shadowMapDepth",U.map.depthTexture.format=Qr,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Pn,U.map.depthTexture.magFilter=Pn}else B.isPointLight?(U.map=new SS(r.x),U.map.depthTexture=new hC(r.x,Er)):(U.map=new xr(r.x,r.y),U.map.depthTexture=new Ia(r.x,r.y,Er)),U.map.depthTexture.name=B.name+".shadowMap",U.map.depthTexture.format=Qr,this.type===au?(U.map.depthTexture.compareFunction=ee?Lm:Dm,U.map.depthTexture.minFilter=_n,U.map.depthTexture.magFilter=_n):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Pn,U.map.depthTexture.magFilter=Pn);U.camera.updateProjectionMatrix()}const F=U.map.isWebGLCubeRenderTarget?6:1;for(let ve=0;ve<F;ve++){if(U.map.isWebGLCubeRenderTarget)n.setRenderTarget(U.map,ve),n.clear();else{ve===0&&(n.setRenderTarget(U.map),n.clear());const Te=U.getViewport(ve);o.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),L.viewport(o)}if(B.isPointLight){const Te=U.camera,$e=U.matrix,Ge=B.distance||Te.far;Ge!==Te.far&&(Te.far=Ge,Te.updateProjectionMatrix()),Ja.setFromMatrixPosition(B.matrixWorld),Te.position.copy(Ja),Dh.copy(Te.position),Dh.add(rL[ve]),Te.up.copy(sL[ve]),Te.lookAt(Dh),Te.updateMatrixWorld(),$e.makeTranslation(-Ja.x,-Ja.y,-Ja.z),x0.multiplyMatrices(Te.projectionMatrix,Te.matrixWorldInverse),U._frustum.setFromProjectionMatrix(x0,Te.coordinateSystem,Te.reversedDepth)}else U.updateMatrices(B);i=U.getFrustum(),x(w,S,U.camera,B,this.type)}U.isPointLightShadow!==!0&&this.type===ll&&y(U,S),U.needsUpdate=!1}g=this.type,_.needsUpdate=!1,n.setRenderTarget(E,A,D)};function y(T,w){const S=e.update(m);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new xr(r.x,r.y,{format:To,type:Jr})),f.uniforms.shadow_pass.value=T.map.depthTexture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(w,null,S,f,m,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(w,null,S,d,m,null)}function v(T,w,S,E){let A=null;const D=S.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)A=D;else if(A=S.isPointLight===!0?l:a,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const L=A.uuid,H=w.uuid;let z=c[L];z===void 0&&(z={},c[L]=z);let k=z[H];k===void 0&&(k=A.clone(),z[H]=k,w.addEventListener("dispose",b)),A=k}if(A.visible=w.visible,A.wireframe=w.wireframe,E===ll?A.side=w.shadowSide!==null?w.shadowSide:w.side:A.side=w.shadowSide!==null?w.shadowSide:h[w.side],A.alphaMap=w.alphaMap,A.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,A.map=w.map,A.clipShadows=w.clipShadows,A.clippingPlanes=w.clippingPlanes,A.clipIntersection=w.clipIntersection,A.displacementMap=w.displacementMap,A.displacementScale=w.displacementScale,A.displacementBias=w.displacementBias,A.wireframeLinewidth=w.wireframeLinewidth,A.linewidth=w.linewidth,S.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const L=n.properties.get(A);L.light=S}return A}function x(T,w,S,E,A){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&A===ll)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,T.matrixWorld);const H=e.update(T),z=T.material;if(Array.isArray(z)){const k=H.groups;for(let B=0,U=k.length;B<U;B++){const G=k[B],ee=z[G.materialIndex];if(ee&&ee.visible){const F=v(T,ee,E,A);T.onBeforeShadow(n,T,w,S,H,F,G),n.renderBufferDirect(S,null,H,F,T,G),T.onAfterShadow(n,T,w,S,H,F,G)}}}else if(z.visible){const k=v(T,z,E,A);T.onBeforeShadow(n,T,w,S,H,k,null),n.renderBufferDirect(S,null,H,k,T,null),T.onAfterShadow(n,T,w,S,H,k,null)}}const L=T.children;for(let H=0,z=L.length;H<z;H++)x(L[H],w,S,E,A)}function b(T){T.target.removeEventListener("dispose",b);for(const S in c){const E=c[S],A=T.target.uuid;A in E&&(E[A].dispose(),delete E[A])}}}function aL(n,e){function t(){let V=!1;const Se=new Jt;let ae=null;const Pe=new Jt(0,0,0,0);return{setMask:function(we){ae!==we&&!V&&(n.colorMask(we,we,we,we),ae=we)},setLocked:function(we){V=we},setClear:function(we,ge,be,Ae,qe){qe===!0&&(we*=Ae,ge*=Ae,be*=Ae),Se.set(we,ge,be,Ae),Pe.equals(Se)===!1&&(n.clearColor(we,ge,be,Ae),Pe.copy(Se))},reset:function(){V=!1,ae=null,Pe.set(-1,0,0,0)}}}function i(){let V=!1,Se=!1,ae=null,Pe=null,we=null;return{setReversed:function(ge){if(Se!==ge){const be=e.get("EXT_clip_control");ge?be.clipControlEXT(be.LOWER_LEFT_EXT,be.ZERO_TO_ONE_EXT):be.clipControlEXT(be.LOWER_LEFT_EXT,be.NEGATIVE_ONE_TO_ONE_EXT),Se=ge;const Ae=we;we=null,this.setClear(Ae)}},getReversed:function(){return Se},setTest:function(ge){ge?ue(n.DEPTH_TEST):Ce(n.DEPTH_TEST)},setMask:function(ge){ae!==ge&&!V&&(n.depthMask(ge),ae=ge)},setFunc:function(ge){if(Se&&(ge=kR[ge]),Pe!==ge){switch(ge){case Cd:n.depthFunc(n.NEVER);break;case Pd:n.depthFunc(n.ALWAYS);break;case Dd:n.depthFunc(n.LESS);break;case Da:n.depthFunc(n.LEQUAL);break;case Ld:n.depthFunc(n.EQUAL);break;case Id:n.depthFunc(n.GEQUAL);break;case Nd:n.depthFunc(n.GREATER);break;case Ud:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Pe=ge}},setLocked:function(ge){V=ge},setClear:function(ge){we!==ge&&(we=ge,Se&&(ge=1-ge),n.clearDepth(ge))},reset:function(){V=!1,ae=null,Pe=null,we=null,Se=!1}}}function r(){let V=!1,Se=null,ae=null,Pe=null,we=null,ge=null,be=null,Ae=null,qe=null;return{setTest:function(Me){V||(Me?ue(n.STENCIL_TEST):Ce(n.STENCIL_TEST))},setMask:function(Me){Se!==Me&&!V&&(n.stencilMask(Me),Se=Me)},setFunc:function(Me,Ye,ze){(ae!==Me||Pe!==Ye||we!==ze)&&(n.stencilFunc(Me,Ye,ze),ae=Me,Pe=Ye,we=ze)},setOp:function(Me,Ye,ze){(ge!==Me||be!==Ye||Ae!==ze)&&(n.stencilOp(Me,Ye,ze),ge=Me,be=Ye,Ae=ze)},setLocked:function(Me){V=Me},setClear:function(Me){qe!==Me&&(n.clearStencil(Me),qe=Me)},reset:function(){V=!1,Se=null,ae=null,Pe=null,we=null,ge=null,be=null,Ae=null,qe=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},f={},d=new WeakMap,p=[],m=null,_=!1,g=null,y=null,v=null,x=null,b=null,T=null,w=null,S=new St(0,0,0),E=0,A=!1,D=null,L=null,H=null,z=null,k=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,G=0;const ee=n.getParameter(n.VERSION);ee.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(ee)[1]),U=G>=1):ee.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),U=G>=2);let F=null,ve={};const Te=n.getParameter(n.SCISSOR_BOX),$e=n.getParameter(n.VIEWPORT),Ge=new Jt().fromArray(Te),Oe=new Jt().fromArray($e);function Y(V,Se,ae,Pe){const we=new Uint8Array(4),ge=n.createTexture();n.bindTexture(V,ge),n.texParameteri(V,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(V,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let be=0;be<ae;be++)V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?n.texImage3D(Se,0,n.RGBA,1,1,Pe,0,n.RGBA,n.UNSIGNED_BYTE,we):n.texImage2D(Se+be,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,we);return ge}const ce={};ce[n.TEXTURE_2D]=Y(n.TEXTURE_2D,n.TEXTURE_2D,1),ce[n.TEXTURE_CUBE_MAP]=Y(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[n.TEXTURE_2D_ARRAY]=Y(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ce[n.TEXTURE_3D]=Y(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ue(n.DEPTH_TEST),o.setFunc(Da),N(!1),Z(gg),ue(n.CULL_FACE),q(Wr);function ue(V){u[V]!==!0&&(n.enable(V),u[V]=!0)}function Ce(V){u[V]!==!1&&(n.disable(V),u[V]=!1)}function Fe(V,Se){return f[V]!==Se?(n.bindFramebuffer(V,Se),f[V]=Se,V===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Se),V===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Se),!0):!1}function Le(V,Se){let ae=p,Pe=!1;if(V){ae=d.get(Se),ae===void 0&&(ae=[],d.set(Se,ae));const we=V.textures;if(ae.length!==we.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let ge=0,be=we.length;ge<be;ge++)ae[ge]=n.COLOR_ATTACHMENT0+ge;ae.length=we.length,Pe=!0}}else ae[0]!==n.BACK&&(ae[0]=n.BACK,Pe=!0);Pe&&n.drawBuffers(ae)}function ke(V){return m!==V?(n.useProgram(V),m=V,!0):!1}const P={[eo]:n.FUNC_ADD,[lR]:n.FUNC_SUBTRACT,[cR]:n.FUNC_REVERSE_SUBTRACT};P[uR]=n.MIN,P[fR]=n.MAX;const O={[hR]:n.ZERO,[dR]:n.ONE,[pR]:n.SRC_COLOR,[Ad]:n.SRC_ALPHA,[yR]:n.SRC_ALPHA_SATURATE,[vR]:n.DST_COLOR,[_R]:n.DST_ALPHA,[mR]:n.ONE_MINUS_SRC_COLOR,[Rd]:n.ONE_MINUS_SRC_ALPHA,[xR]:n.ONE_MINUS_DST_COLOR,[gR]:n.ONE_MINUS_DST_ALPHA,[SR]:n.CONSTANT_COLOR,[MR]:n.ONE_MINUS_CONSTANT_COLOR,[bR]:n.CONSTANT_ALPHA,[ER]:n.ONE_MINUS_CONSTANT_ALPHA};function q(V,Se,ae,Pe,we,ge,be,Ae,qe,Me){if(V===Wr){_===!0&&(Ce(n.BLEND),_=!1);return}if(_===!1&&(ue(n.BLEND),_=!0),V!==aR){if(V!==g||Me!==A){if((y!==eo||b!==eo)&&(n.blendEquation(n.FUNC_ADD),y=eo,b=eo),Me)switch(V){case va:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vg:n.blendFunc(n.ONE,n.ONE);break;case xg:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yg:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:dt("WebGLState: Invalid blending: ",V);break}else switch(V){case va:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vg:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xg:dt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yg:dt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:dt("WebGLState: Invalid blending: ",V);break}v=null,x=null,T=null,w=null,S.set(0,0,0),E=0,g=V,A=Me}return}we=we||Se,ge=ge||ae,be=be||Pe,(Se!==y||we!==b)&&(n.blendEquationSeparate(P[Se],P[we]),y=Se,b=we),(ae!==v||Pe!==x||ge!==T||be!==w)&&(n.blendFuncSeparate(O[ae],O[Pe],O[ge],O[be]),v=ae,x=Pe,T=ge,w=be),(Ae.equals(S)===!1||qe!==E)&&(n.blendColor(Ae.r,Ae.g,Ae.b,qe),S.copy(Ae),E=qe),g=V,A=!1}function $(V,Se){V.side===kr?Ce(n.CULL_FACE):ue(n.CULL_FACE);let ae=V.side===fi;Se&&(ae=!ae),N(ae),V.blending===va&&V.transparent===!1?q(Wr):q(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),s.setMask(V.colorWrite);const Pe=V.stencilWrite;a.setTest(Pe),Pe&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),I(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?ue(n.SAMPLE_ALPHA_TO_COVERAGE):Ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function N(V){D!==V&&(V?n.frontFace(n.CW):n.frontFace(n.CCW),D=V)}function Z(V){V!==rR?(ue(n.CULL_FACE),V!==L&&(V===gg?n.cullFace(n.BACK):V===sR?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ce(n.CULL_FACE),L=V}function fe(V){V!==H&&(U&&n.lineWidth(V),H=V)}function I(V,Se,ae){V?(ue(n.POLYGON_OFFSET_FILL),(z!==Se||k!==ae)&&(z=Se,k=ae,o.getReversed()&&(Se=-Se),n.polygonOffset(Se,ae))):Ce(n.POLYGON_OFFSET_FILL)}function se(V){V?ue(n.SCISSOR_TEST):Ce(n.SCISSOR_TEST)}function ne(V){V===void 0&&(V=n.TEXTURE0+B-1),F!==V&&(n.activeTexture(V),F=V)}function xe(V,Se,ae){ae===void 0&&(F===null?ae=n.TEXTURE0+B-1:ae=F);let Pe=ve[ae];Pe===void 0&&(Pe={type:void 0,texture:void 0},ve[ae]=Pe),(Pe.type!==V||Pe.texture!==Se)&&(F!==ae&&(n.activeTexture(ae),F=ae),n.bindTexture(V,Se||ce[V]),Pe.type=V,Pe.texture=Se)}function K(){const V=ve[F];V!==void 0&&V.type!==void 0&&(n.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function _e(){try{n.compressedTexImage2D(...arguments)}catch(V){dt("WebGLState:",V)}}function R(){try{n.compressedTexImage3D(...arguments)}catch(V){dt("WebGLState:",V)}}function M(){try{n.texSubImage2D(...arguments)}catch(V){dt("WebGLState:",V)}}function W(){try{n.texSubImage3D(...arguments)}catch(V){dt("WebGLState:",V)}}function J(){try{n.compressedTexSubImage2D(...arguments)}catch(V){dt("WebGLState:",V)}}function oe(){try{n.compressedTexSubImage3D(...arguments)}catch(V){dt("WebGLState:",V)}}function me(){try{n.texStorage2D(...arguments)}catch(V){dt("WebGLState:",V)}}function de(){try{n.texStorage3D(...arguments)}catch(V){dt("WebGLState:",V)}}function re(){try{n.texImage2D(...arguments)}catch(V){dt("WebGLState:",V)}}function le(){try{n.texImage3D(...arguments)}catch(V){dt("WebGLState:",V)}}function Ee(V){return h[V]!==void 0?h[V]:n.getParameter(V)}function he(V,Se){h[V]!==Se&&(n.pixelStorei(V,Se),h[V]=Se)}function pe(V){Ge.equals(V)===!1&&(n.scissor(V.x,V.y,V.z,V.w),Ge.copy(V))}function ye(V){Oe.equals(V)===!1&&(n.viewport(V.x,V.y,V.z,V.w),Oe.copy(V))}function Re(V,Se){let ae=c.get(Se);ae===void 0&&(ae=new WeakMap,c.set(Se,ae));let Pe=ae.get(V);Pe===void 0&&(Pe=n.getUniformBlockIndex(Se,V.name),ae.set(V,Pe))}function je(V,Se){const Pe=c.get(Se).get(V);l.get(Se)!==Pe&&(n.uniformBlockBinding(Se,Pe,V.__bindingPointIndex),l.set(Se,Pe))}function Ze(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},F=null,ve={},f={},d=new WeakMap,p=[],m=null,_=!1,g=null,y=null,v=null,x=null,b=null,T=null,w=null,S=new St(0,0,0),E=0,A=!1,D=null,L=null,H=null,z=null,k=null,Ge.set(0,0,n.canvas.width,n.canvas.height),Oe.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ue,disable:Ce,bindFramebuffer:Fe,drawBuffers:Le,useProgram:ke,setBlending:q,setMaterial:$,setFlipSided:N,setCullFace:Z,setLineWidth:fe,setPolygonOffset:I,setScissorTest:se,activeTexture:ne,bindTexture:xe,unbindTexture:K,compressedTexImage2D:_e,compressedTexImage3D:R,texImage2D:re,texImage3D:le,pixelStorei:he,getParameter:Ee,updateUBOMapping:Re,uniformBlockBinding:je,texStorage2D:me,texStorage3D:de,texSubImage2D:M,texSubImage3D:W,compressedTexSubImage2D:J,compressedTexSubImage3D:oe,scissor:pe,viewport:ye,reset:Ze}}function lL(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Mt,u=new WeakMap,h=new Set;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,M){return p?new OffscreenCanvas(R,M):Wu("canvas")}function _(R,M,W){let J=1;const oe=_e(R);if((oe.width>W||oe.height>W)&&(J=W/Math.max(oe.width,oe.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const me=Math.floor(J*oe.width),de=Math.floor(J*oe.height);f===void 0&&(f=m(me,de));const re=M?m(me,de):f;return re.width=me,re.height=de,re.getContext("2d").drawImage(R,0,0,me,de),Je("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+me+"x"+de+")."),re}else return"data"in R&&Je("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),R;return R}function g(R){return R.generateMipmaps}function y(R){n.generateMipmap(R)}function v(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(R,M,W,J,oe,me=!1){if(R!==null){if(n[R]!==void 0)return n[R];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let de;J&&(de=e.get("EXT_texture_norm16"),de||Je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let re=M;if(M===n.RED&&(W===n.FLOAT&&(re=n.R32F),W===n.HALF_FLOAT&&(re=n.R16F),W===n.UNSIGNED_BYTE&&(re=n.R8),W===n.UNSIGNED_SHORT&&de&&(re=de.R16_EXT),W===n.SHORT&&de&&(re=de.R16_SNORM_EXT)),M===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(re=n.R8UI),W===n.UNSIGNED_SHORT&&(re=n.R16UI),W===n.UNSIGNED_INT&&(re=n.R32UI),W===n.BYTE&&(re=n.R8I),W===n.SHORT&&(re=n.R16I),W===n.INT&&(re=n.R32I)),M===n.RG&&(W===n.FLOAT&&(re=n.RG32F),W===n.HALF_FLOAT&&(re=n.RG16F),W===n.UNSIGNED_BYTE&&(re=n.RG8),W===n.UNSIGNED_SHORT&&de&&(re=de.RG16_EXT),W===n.SHORT&&de&&(re=de.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(re=n.RG8UI),W===n.UNSIGNED_SHORT&&(re=n.RG16UI),W===n.UNSIGNED_INT&&(re=n.RG32UI),W===n.BYTE&&(re=n.RG8I),W===n.SHORT&&(re=n.RG16I),W===n.INT&&(re=n.RG32I)),M===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(re=n.RGB8UI),W===n.UNSIGNED_SHORT&&(re=n.RGB16UI),W===n.UNSIGNED_INT&&(re=n.RGB32UI),W===n.BYTE&&(re=n.RGB8I),W===n.SHORT&&(re=n.RGB16I),W===n.INT&&(re=n.RGB32I)),M===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),W===n.UNSIGNED_INT&&(re=n.RGBA32UI),W===n.BYTE&&(re=n.RGBA8I),W===n.SHORT&&(re=n.RGBA16I),W===n.INT&&(re=n.RGBA32I)),M===n.RGB&&(W===n.UNSIGNED_SHORT&&de&&(re=de.RGB16_EXT),W===n.SHORT&&de&&(re=de.RGB16_SNORM_EXT),W===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),M===n.RGBA){const le=me?Vu:ut.getTransfer(oe);W===n.FLOAT&&(re=n.RGBA32F),W===n.HALF_FLOAT&&(re=n.RGBA16F),W===n.UNSIGNED_BYTE&&(re=le===Tt?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT&&de&&(re=de.RGBA16_EXT),W===n.SHORT&&de&&(re=de.RGBA16_SNORM_EXT),W===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function b(R,M){let W;return R?M===null||M===Er||M===$l?W=n.DEPTH24_STENCIL8:M===pr?W=n.DEPTH32F_STENCIL8:M===Xl&&(W=n.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Er||M===$l?W=n.DEPTH_COMPONENT24:M===pr?W=n.DEPTH_COMPONENT32F:M===Xl&&(W=n.DEPTH_COMPONENT16),W}function T(R,M){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Pn&&R.minFilter!==_n?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function w(R){const M=R.target;M.removeEventListener("dispose",w),E(M),M.isVideoTexture&&u.delete(M),M.isHTMLTexture&&h.delete(M)}function S(R){const M=R.target;M.removeEventListener("dispose",S),D(M)}function E(R){const M=i.get(R);if(M.__webglInit===void 0)return;const W=R.source,J=d.get(W);if(J){const oe=J[M.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&A(R),Object.keys(J).length===0&&d.delete(W)}i.remove(R)}function A(R){const M=i.get(R);n.deleteTexture(M.__webglTexture);const W=R.source,J=d.get(W);delete J[M.__cacheKey],o.memory.textures--}function D(R){const M=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(M.__webglFramebuffer[J]))for(let oe=0;oe<M.__webglFramebuffer[J].length;oe++)n.deleteFramebuffer(M.__webglFramebuffer[J][oe]);else n.deleteFramebuffer(M.__webglFramebuffer[J]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[J])}else{if(Array.isArray(M.__webglFramebuffer))for(let J=0;J<M.__webglFramebuffer.length;J++)n.deleteFramebuffer(M.__webglFramebuffer[J]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let J=0;J<M.__webglColorRenderbuffer.length;J++)M.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[J]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const W=R.textures;for(let J=0,oe=W.length;J<oe;J++){const me=i.get(W[J]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),o.memory.textures--),i.remove(W[J])}i.remove(R)}let L=0;function H(){L=0}function z(){return L}function k(R){L=R}function B(){const R=L;return R>=r.maxTextures&&Je("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),L+=1,R}function U(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function G(R,M){const W=i.get(R);if(R.isVideoTexture&&xe(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&W.__version!==R.version){const J=R.image;if(J===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(W,R,M);return}}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+M)}function ee(R,M){const W=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){Ce(W,R,M);return}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+M)}function F(R,M){const W=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){Ce(W,R,M);return}t.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+M)}function ve(R,M){const W=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&W.__version!==R.version){Fe(W,R,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+M)}const Te={[Fd]:n.REPEAT,[Ki]:n.CLAMP_TO_EDGE,[Od]:n.MIRRORED_REPEAT},$e={[Pn]:n.NEAREST,[AR]:n.NEAREST_MIPMAP_NEAREST,[Ec]:n.NEAREST_MIPMAP_LINEAR,[_n]:n.LINEAR,[th]:n.LINEAR_MIPMAP_NEAREST,[Es]:n.LINEAR_MIPMAP_LINEAR},Ge={[PR]:n.NEVER,[UR]:n.ALWAYS,[DR]:n.LESS,[Dm]:n.LEQUAL,[LR]:n.EQUAL,[Lm]:n.GEQUAL,[IR]:n.GREATER,[NR]:n.NOTEQUAL};function Oe(R,M){if(M.type===pr&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===_n||M.magFilter===th||M.magFilter===Ec||M.magFilter===Es||M.minFilter===_n||M.minFilter===th||M.minFilter===Ec||M.minFilter===Es)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Te[M.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Te[M.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Te[M.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,$e[M.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,$e[M.minFilter]),M.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Ge[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Pn||M.minFilter!==Ec&&M.minFilter!==Es||M.type===pr&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Y(R,M){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",w));const J=M.source;let oe=d.get(J);oe===void 0&&(oe={},d.set(J,oe));const me=U(M);if(me!==R.__cacheKey){oe[me]===void 0&&(oe[me]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,W=!0),oe[me].usedTimes++;const de=oe[R.__cacheKey];de!==void 0&&(oe[R.__cacheKey].usedTimes--,de.usedTimes===0&&A(M)),R.__cacheKey=me,R.__webglTexture=oe[me].texture}return W}function ce(R,M,W){return Math.floor(Math.floor(R/W)/M)}function ue(R,M,W,J){const me=R.updateRanges;if(me.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,W,J,M.data);else{me.sort((he,pe)=>he.start-pe.start);let de=0;for(let he=1;he<me.length;he++){const pe=me[de],ye=me[he],Re=pe.start+pe.count,je=ce(ye.start,M.width,4),Ze=ce(pe.start,M.width,4);ye.start<=Re+1&&je===Ze&&ce(ye.start+ye.count-1,M.width,4)===je?pe.count=Math.max(pe.count,ye.start+ye.count-pe.start):(++de,me[de]=ye)}me.length=de+1;const re=t.getParameter(n.UNPACK_ROW_LENGTH),le=t.getParameter(n.UNPACK_SKIP_PIXELS),Ee=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let he=0,pe=me.length;he<pe;he++){const ye=me[he],Re=Math.floor(ye.start/4),je=Math.ceil(ye.count/4),Ze=Re%M.width,V=Math.floor(Re/M.width),Se=je,ae=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(n.UNPACK_SKIP_ROWS,V),t.texSubImage2D(n.TEXTURE_2D,0,Ze,V,Se,ae,W,J,M.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,re),t.pixelStorei(n.UNPACK_SKIP_PIXELS,le),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ee)}}function Ce(R,M,W){let J=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=n.TEXTURE_3D);const oe=Y(R,M),me=M.source;t.bindTexture(J,R.__webglTexture,n.TEXTURE0+W);const de=i.get(me);if(me.version!==de.__version||oe===!0){if(t.activeTexture(n.TEXTURE0+W),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const ae=ut.getPrimaries(ut.workingColorSpace),Pe=M.colorSpace===vs?null:ut.getPrimaries(M.colorSpace),we=M.colorSpace===vs||ae===Pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,we)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let le=_(M.image,!1,r.maxTextureSize);le=K(M,le);const Ee=s.convert(M.format,M.colorSpace),he=s.convert(M.type);let pe=x(M.internalFormat,Ee,he,M.normalized,M.colorSpace,M.isVideoTexture);Oe(J,M);let ye;const Re=M.mipmaps,je=M.isVideoTexture!==!0,Ze=de.__version===void 0||oe===!0,V=me.dataReady,Se=T(M,le);if(M.isDepthTexture)pe=b(M.format===so,M.type),Ze&&(je?t.texStorage2D(n.TEXTURE_2D,1,pe,le.width,le.height):t.texImage2D(n.TEXTURE_2D,0,pe,le.width,le.height,0,Ee,he,null));else if(M.isDataTexture)if(Re.length>0){je&&Ze&&t.texStorage2D(n.TEXTURE_2D,Se,pe,Re[0].width,Re[0].height);for(let ae=0,Pe=Re.length;ae<Pe;ae++)ye=Re[ae],je?V&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ye.width,ye.height,Ee,he,ye.data):t.texImage2D(n.TEXTURE_2D,ae,pe,ye.width,ye.height,0,Ee,he,ye.data);M.generateMipmaps=!1}else je?(Ze&&t.texStorage2D(n.TEXTURE_2D,Se,pe,le.width,le.height),V&&ue(M,le,Ee,he)):t.texImage2D(n.TEXTURE_2D,0,pe,le.width,le.height,0,Ee,he,le.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){je&&Ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,pe,Re[0].width,Re[0].height,le.depth);for(let ae=0,Pe=Re.length;ae<Pe;ae++)if(ye=Re[ae],M.format!==Zi)if(Ee!==null)if(je){if(V)if(M.layerUpdates.size>0){const we=Kg(ye.width,ye.height,M.format,M.type);for(const ge of M.layerUpdates){const be=ye.data.subarray(ge*we/ye.data.BYTES_PER_ELEMENT,(ge+1)*we/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,ge,ye.width,ye.height,1,Ee,be)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ye.width,ye.height,le.depth,Ee,ye.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,pe,ye.width,ye.height,le.depth,0,ye.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else je?V&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ye.width,ye.height,le.depth,Ee,he,ye.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,pe,ye.width,ye.height,le.depth,0,Ee,he,ye.data)}else{je&&Ze&&t.texStorage2D(n.TEXTURE_2D,Se,pe,Re[0].width,Re[0].height);for(let ae=0,Pe=Re.length;ae<Pe;ae++)ye=Re[ae],M.format!==Zi?Ee!==null?je?V&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ye.width,ye.height,Ee,ye.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,pe,ye.width,ye.height,0,ye.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?V&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ye.width,ye.height,Ee,he,ye.data):t.texImage2D(n.TEXTURE_2D,ae,pe,ye.width,ye.height,0,Ee,he,ye.data)}else if(M.isDataArrayTexture)if(je){if(Ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,pe,le.width,le.height,le.depth),V)if(M.layerUpdates.size>0){const ae=Kg(le.width,le.height,M.format,M.type);for(const Pe of M.layerUpdates){const we=le.data.subarray(Pe*ae/le.data.BYTES_PER_ELEMENT,(Pe+1)*ae/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Pe,le.width,le.height,1,Ee,he,we)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Ee,he,le.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,pe,le.width,le.height,le.depth,0,Ee,he,le.data);else if(M.isData3DTexture)je?(Ze&&t.texStorage3D(n.TEXTURE_3D,Se,pe,le.width,le.height,le.depth),V&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Ee,he,le.data)):t.texImage3D(n.TEXTURE_3D,0,pe,le.width,le.height,le.depth,0,Ee,he,le.data);else if(M.isFramebufferTexture){if(Ze)if(je)t.texStorage2D(n.TEXTURE_2D,Se,pe,le.width,le.height);else{let ae=le.width,Pe=le.height;for(let we=0;we<Se;we++)t.texImage2D(n.TEXTURE_2D,we,pe,ae,Pe,0,Ee,he,null),ae>>=1,Pe>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const ae=n.canvas;if(ae.hasAttribute("layoutsubtree")||ae.setAttribute("layoutsubtree","true"),le.parentNode!==ae){ae.appendChild(le),h.add(M),ae.onpaint=Ae=>{const qe=Ae.changedElements;for(const Me of h)qe.includes(Me.image)&&(Me.needsUpdate=!0)},ae.requestPaint();return}const Pe=0,we=n.RGBA,ge=n.RGBA,be=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,Pe,we,ge,be,le),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Re.length>0){if(je&&Ze){const ae=_e(Re[0]);t.texStorage2D(n.TEXTURE_2D,Se,pe,ae.width,ae.height)}for(let ae=0,Pe=Re.length;ae<Pe;ae++)ye=Re[ae],je?V&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Ee,he,ye):t.texImage2D(n.TEXTURE_2D,ae,pe,Ee,he,ye);M.generateMipmaps=!1}else if(je){if(Ze){const ae=_e(le);t.texStorage2D(n.TEXTURE_2D,Se,pe,ae.width,ae.height)}V&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ee,he,le)}else t.texImage2D(n.TEXTURE_2D,0,pe,Ee,he,le);g(M)&&y(J),de.__version=me.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Fe(R,M,W){if(M.image.length!==6)return;const J=Y(R,M),oe=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+W);const me=i.get(oe);if(oe.version!==me.__version||J===!0){t.activeTexture(n.TEXTURE0+W);const de=ut.getPrimaries(ut.workingColorSpace),re=M.colorSpace===vs?null:ut.getPrimaries(M.colorSpace),le=M.colorSpace===vs||de===re?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const Ee=M.isCompressedTexture||M.image[0].isCompressedTexture,he=M.image[0]&&M.image[0].isDataTexture,pe=[];for(let ge=0;ge<6;ge++)!Ee&&!he?pe[ge]=_(M.image[ge],!0,r.maxCubemapSize):pe[ge]=he?M.image[ge].image:M.image[ge],pe[ge]=K(M,pe[ge]);const ye=pe[0],Re=s.convert(M.format,M.colorSpace),je=s.convert(M.type),Ze=x(M.internalFormat,Re,je,M.normalized,M.colorSpace),V=M.isVideoTexture!==!0,Se=me.__version===void 0||J===!0,ae=oe.dataReady;let Pe=T(M,ye);Oe(n.TEXTURE_CUBE_MAP,M);let we;if(Ee){V&&Se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Pe,Ze,ye.width,ye.height);for(let ge=0;ge<6;ge++){we=pe[ge].mipmaps;for(let be=0;be<we.length;be++){const Ae=we[be];M.format!==Zi?Re!==null?V?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be,0,0,Ae.width,Ae.height,Re,Ae.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be,Ze,Ae.width,Ae.height,0,Ae.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be,0,0,Ae.width,Ae.height,Re,je,Ae.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be,Ze,Ae.width,Ae.height,0,Re,je,Ae.data)}}}else{if(we=M.mipmaps,V&&Se){we.length>0&&Pe++;const ge=_e(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Pe,Ze,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(he){V?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,pe[ge].width,pe[ge].height,Re,je,pe[ge].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Ze,pe[ge].width,pe[ge].height,0,Re,je,pe[ge].data);for(let be=0;be<we.length;be++){const qe=we[be].image[ge].image;V?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be+1,0,0,qe.width,qe.height,Re,je,qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be+1,Ze,qe.width,qe.height,0,Re,je,qe.data)}}else{V?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Re,je,pe[ge]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Ze,Re,je,pe[ge]);for(let be=0;be<we.length;be++){const Ae=we[be];V?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be+1,0,0,Re,je,Ae.image[ge]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be+1,Ze,Re,je,Ae.image[ge])}}}g(M)&&y(n.TEXTURE_CUBE_MAP),me.__version=oe.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Le(R,M,W,J,oe,me){const de=s.convert(W.format,W.colorSpace),re=s.convert(W.type),le=x(W.internalFormat,de,re,W.normalized,W.colorSpace),Ee=i.get(M),he=i.get(W);if(he.__renderTarget=M,!Ee.__hasExternalTextures){const pe=Math.max(1,M.width>>me),ye=Math.max(1,M.height>>me);oe===n.TEXTURE_3D||oe===n.TEXTURE_2D_ARRAY?t.texImage3D(oe,me,le,pe,ye,M.depth,0,de,re,null):t.texImage2D(oe,me,le,pe,ye,0,de,re,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),ne(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,oe,he.__webglTexture,0,se(M)):(oe===n.TEXTURE_2D||oe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,oe,he.__webglTexture,me),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ke(R,M,W){if(n.bindRenderbuffer(n.RENDERBUFFER,R),M.depthBuffer){const J=M.depthTexture,oe=J&&J.isDepthTexture?J.type:null,me=b(M.stencilBuffer,oe),de=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ne(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se(M),me,M.width,M.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,se(M),me,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,me,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,de,n.RENDERBUFFER,R)}else{const J=M.textures;for(let oe=0;oe<J.length;oe++){const me=J[oe],de=s.convert(me.format,me.colorSpace),re=s.convert(me.type),le=x(me.internalFormat,de,re,me.normalized,me.colorSpace);ne(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se(M),le,M.width,M.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,se(M),le,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,le,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function P(R,M,W){const J=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const oe=i.get(M.depthTexture);if(oe.__renderTarget=M,(!oe.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),J){if(oe.__webglInit===void 0&&(oe.__webglInit=!0,M.depthTexture.addEventListener("dispose",w)),oe.__webglTexture===void 0){oe.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,oe.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,M.depthTexture);const Ee=s.convert(M.depthTexture.format),he=s.convert(M.depthTexture.type);let pe;M.depthTexture.format===Qr?pe=n.DEPTH_COMPONENT24:M.depthTexture.format===so&&(pe=n.DEPTH24_STENCIL8);for(let ye=0;ye<6;ye++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,pe,M.width,M.height,0,Ee,he,null)}}else G(M.depthTexture,0);const me=oe.__webglTexture,de=se(M),re=J?n.TEXTURE_CUBE_MAP_POSITIVE_X+W:n.TEXTURE_2D,le=M.depthTexture.format===so?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===Qr)ne(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,le,re,me,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,le,re,me,0);else if(M.depthTexture.format===so)ne(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,le,re,me,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,le,re,me,0);else throw new Error("Unknown depthTexture format")}function O(R){const M=i.get(R),W=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const J=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),J){const oe=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,J.removeEventListener("dispose",oe)};J.addEventListener("dispose",oe),M.__depthDisposeCallback=oe}M.__boundDepthTexture=J}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(W)for(let J=0;J<6;J++)P(M.__webglFramebuffer[J],R,J);else{const J=R.texture.mipmaps;J&&J.length>0?P(M.__webglFramebuffer[0],R,0):P(M.__webglFramebuffer,R,0)}else if(W){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]===void 0)M.__webglDepthbuffer[J]=n.createRenderbuffer(),ke(M.__webglDepthbuffer[J],R,!1);else{const oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=M.__webglDepthbuffer[J];n.bindRenderbuffer(n.RENDERBUFFER,me),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,me)}}else{const J=R.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),ke(M.__webglDepthbuffer,R,!1);else{const oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,me),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,me)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function q(R,M,W){const J=i.get(R);M!==void 0&&Le(J.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&O(R)}function $(R){const M=R.texture,W=i.get(R),J=i.get(M);R.addEventListener("dispose",S);const oe=R.textures,me=R.isWebGLCubeRenderTarget===!0,de=oe.length>1;if(de||(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=M.version,o.memory.textures++),me){W.__webglFramebuffer=[];for(let re=0;re<6;re++)if(M.mipmaps&&M.mipmaps.length>0){W.__webglFramebuffer[re]=[];for(let le=0;le<M.mipmaps.length;le++)W.__webglFramebuffer[re][le]=n.createFramebuffer()}else W.__webglFramebuffer[re]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){W.__webglFramebuffer=[];for(let re=0;re<M.mipmaps.length;re++)W.__webglFramebuffer[re]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(de)for(let re=0,le=oe.length;re<le;re++){const Ee=i.get(oe[re]);Ee.__webglTexture===void 0&&(Ee.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&ne(R)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let re=0;re<oe.length;re++){const le=oe[re];W.__webglColorRenderbuffer[re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[re]);const Ee=s.convert(le.format,le.colorSpace),he=s.convert(le.type),pe=x(le.internalFormat,Ee,he,le.normalized,le.colorSpace,R.isXRRenderTarget===!0),ye=se(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,pe,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,W.__webglColorRenderbuffer[re])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),ke(W.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(me){t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,M);for(let re=0;re<6;re++)if(M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)Le(W.__webglFramebuffer[re][le],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,le);else Le(W.__webglFramebuffer[re],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);g(M)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let re=0,le=oe.length;re<le;re++){const Ee=oe[re],he=i.get(Ee);let pe=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,he.__webglTexture),Oe(pe,Ee),Le(W.__webglFramebuffer,R,Ee,n.COLOR_ATTACHMENT0+re,pe,0),g(Ee)&&y(pe)}t.unbindTexture()}else{let re=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(re=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,J.__webglTexture),Oe(re,M),M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)Le(W.__webglFramebuffer[le],R,M,n.COLOR_ATTACHMENT0,re,le);else Le(W.__webglFramebuffer,R,M,n.COLOR_ATTACHMENT0,re,0);g(M)&&y(re),t.unbindTexture()}R.depthBuffer&&O(R)}function N(R){const M=R.textures;for(let W=0,J=M.length;W<J;W++){const oe=M[W];if(g(oe)){const me=v(R),de=i.get(oe).__webglTexture;t.bindTexture(me,de),y(me),t.unbindTexture()}}}const Z=[],fe=[];function I(R){if(R.samples>0){if(ne(R)===!1){const M=R.textures,W=R.width,J=R.height;let oe=n.COLOR_BUFFER_BIT;const me=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=i.get(R),re=M.length>1;if(re)for(let Ee=0;Ee<M.length;Ee++)t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ee,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ee,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const le=R.texture.mipmaps;le&&le.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Ee=0;Ee<M.length;Ee++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(oe|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(oe|=n.STENCIL_BUFFER_BIT)),re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ee]);const he=i.get(M[Ee]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,he,0)}n.blitFramebuffer(0,0,W,J,0,0,W,J,oe,n.NEAREST),l===!0&&(Z.length=0,fe.length=0,Z.push(n.COLOR_ATTACHMENT0+Ee),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Z.push(me),fe.push(me),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,fe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Z))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),re)for(let Ee=0;Ee<M.length;Ee++){t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ee,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ee]);const he=i.get(M[Ee]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ee,n.TEXTURE_2D,he,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const M=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function se(R){return Math.min(r.maxSamples,R.samples)}function ne(R){const M=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function xe(R){const M=o.render.frame;u.get(R)!==M&&(u.set(R,M),R.update())}function K(R,M){const W=R.colorSpace,J=R.format,oe=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==zu&&W!==vs&&(ut.getTransfer(W)===Tt?(J!==Zi||oe!==zi)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):dt("WebGLTextures: Unsupported texture color space:",W)),M}function _e(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=H,this.getTextureUnits=z,this.setTextureUnits=k,this.setTexture2D=G,this.setTexture2DArray=ee,this.setTexture3D=F,this.setTextureCube=ve,this.rebindTextures=q,this.setupRenderTarget=$,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=I,this.setupDepthRenderbuffer=O,this.setupFrameBufferTexture=Le,this.useMultisampledRTT=ne,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function cL(n,e){function t(i,r=vs){let s;const o=ut.getTransfer(r);if(i===zi)return n.UNSIGNED_BYTE;if(i===wm)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Am)return n.UNSIGNED_SHORT_5_5_5_1;if(i===nS)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===iS)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===eS)return n.BYTE;if(i===tS)return n.SHORT;if(i===Xl)return n.UNSIGNED_SHORT;if(i===Tm)return n.INT;if(i===Er)return n.UNSIGNED_INT;if(i===pr)return n.FLOAT;if(i===Jr)return n.HALF_FLOAT;if(i===rS)return n.ALPHA;if(i===sS)return n.RGB;if(i===Zi)return n.RGBA;if(i===Qr)return n.DEPTH_COMPONENT;if(i===so)return n.DEPTH_STENCIL;if(i===oS)return n.RED;if(i===Rm)return n.RED_INTEGER;if(i===To)return n.RG;if(i===Cm)return n.RG_INTEGER;if(i===Pm)return n.RGBA_INTEGER;if(i===lu||i===cu||i===uu||i===fu)if(o===Tt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===lu)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===cu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===uu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===fu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===lu)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===cu)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===uu)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===fu)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bd||i===kd||i===Hd||i===zd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Bd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===kd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Hd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===zd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Vd||i===Gd||i===Wd||i===Xd||i===$d||i===ku||i===qd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Vd||i===Gd)return o===Tt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Wd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Xd)return s.COMPRESSED_R11_EAC;if(i===$d)return s.COMPRESSED_SIGNED_R11_EAC;if(i===ku)return s.COMPRESSED_RG11_EAC;if(i===qd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Yd||i===jd||i===Kd||i===Zd||i===Jd||i===Qd||i===ep||i===tp||i===np||i===ip||i===rp||i===sp||i===op||i===ap)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Yd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Kd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Jd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qd)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ep)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===tp)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===np)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ip)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rp)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sp)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===op)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ap)return o===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===lp||i===cp||i===up)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===lp)return o===Tt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===cp)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===up)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fp||i===hp||i===Hu||i===dp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===fp)return s.COMPRESSED_RED_RGTC1_EXT;if(i===hp)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Hu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===dp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$l?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const uL=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fL=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class hL{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new mS(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new er({vertexShader:uL,fragmentShader:fL,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new es(new vf(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dL extends Ro{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,d=null,p=null;const m=typeof XRWebGLBinding<"u",_=new hL,g={},y=t.getContextAttributes();let v=null,x=null;const b=[],T=[],w=new Mt;let S=null;const E=new Hi;E.viewport=new Jt;const A=new Hi;A.viewport=new Jt;const D=[E,A],L=new SC;let H=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ce=b[Y];return ce===void 0&&(ce=new ch,b[Y]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(Y){let ce=b[Y];return ce===void 0&&(ce=new ch,b[Y]=ce),ce.getGripSpace()},this.getHand=function(Y){let ce=b[Y];return ce===void 0&&(ce=new ch,b[Y]=ce),ce.getHandSpace()};function k(Y){const ce=T.indexOf(Y.inputSource);if(ce===-1)return;const ue=b[ce];ue!==void 0&&(ue.update(Y.inputSource,Y.frame,c||o),ue.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",U);for(let Y=0;Y<b.length;Y++){const ce=T[Y];ce!==null&&(T[Y]=null,b[Y].disconnect(ce))}H=null,z=null,_.reset();for(const Y in g)delete g[Y];e.setRenderTarget(v),d=null,f=null,h=null,r=null,x=null,Oe.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&m&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(v=e.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",B),r.addEventListener("inputsourceschange",U),y.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(w),m&&"createProjectionLayer"in XRWebGLBinding.prototype){let ue=null,Ce=null,Fe=null;y.depth&&(Fe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ue=y.stencil?so:Qr,Ce=y.stencil?$l:Er);const Le={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:s};h=this.getBinding(),f=h.createProjectionLayer(Le),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new xr(f.textureWidth,f.textureHeight,{format:Zi,type:zi,depthTexture:new Ia(f.textureWidth,f.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ue),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const ue={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,ue),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new xr(d.framebufferWidth,d.framebufferHeight,{format:Zi,type:zi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Oe.setContext(r),Oe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function U(Y){for(let ce=0;ce<Y.removed.length;ce++){const ue=Y.removed[ce],Ce=T.indexOf(ue);Ce>=0&&(T[Ce]=null,b[Ce].disconnect(ue))}for(let ce=0;ce<Y.added.length;ce++){const ue=Y.added[ce];let Ce=T.indexOf(ue);if(Ce===-1){for(let Le=0;Le<b.length;Le++)if(Le>=T.length){T.push(ue),Ce=Le;break}else if(T[Le]===null){T[Le]=ue,Ce=Le;break}if(Ce===-1)break}const Fe=b[Ce];Fe&&Fe.connect(ue)}}const G=new te,ee=new te;function F(Y,ce,ue){G.setFromMatrixPosition(ce.matrixWorld),ee.setFromMatrixPosition(ue.matrixWorld);const Ce=G.distanceTo(ee),Fe=ce.projectionMatrix.elements,Le=ue.projectionMatrix.elements,ke=Fe[14]/(Fe[10]-1),P=Fe[14]/(Fe[10]+1),O=(Fe[9]+1)/Fe[5],q=(Fe[9]-1)/Fe[5],$=(Fe[8]-1)/Fe[0],N=(Le[8]+1)/Le[0],Z=ke*$,fe=ke*N,I=Ce/(-$+N),se=I*-$;if(ce.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(se),Y.translateZ(I),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Fe[10]===-1)Y.projectionMatrix.copy(ce.projectionMatrix),Y.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const ne=ke+I,xe=P+I,K=Z-se,_e=fe+(Ce-se),R=O*P/xe*ne,M=q*P/xe*ne;Y.projectionMatrix.makePerspective(K,_e,R,M,ne,xe),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ve(Y,ce){ce===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ce.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let ce=Y.near,ue=Y.far;_.texture!==null&&(_.depthNear>0&&(ce=_.depthNear),_.depthFar>0&&(ue=_.depthFar)),L.near=A.near=E.near=ce,L.far=A.far=E.far=ue,(H!==L.near||z!==L.far)&&(r.updateRenderState({depthNear:L.near,depthFar:L.far}),H=L.near,z=L.far),L.layers.mask=Y.layers.mask|6,E.layers.mask=L.layers.mask&-5,A.layers.mask=L.layers.mask&-3;const Ce=Y.parent,Fe=L.cameras;ve(L,Ce);for(let Le=0;Le<Fe.length;Le++)ve(Fe[Le],Ce);Fe.length===2?F(L,E,A):L.projectionMatrix.copy(E.projectionMatrix),Te(Y,L,Ce)};function Te(Y,ce,ue){ue===null?Y.matrix.copy(ce.matrixWorld):(Y.matrix.copy(ue.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ce.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ce.projectionMatrix),Y.projectionMatrixInverse.copy(ce.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=mp*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(L)},this.getCameraTexture=function(Y){return g[Y]};let $e=null;function Ge(Y,ce){if(u=ce.getViewerPose(c||o),p=ce,u!==null){const ue=u.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let Ce=!1;ue.length!==L.cameras.length&&(L.cameras.length=0,Ce=!0);for(let P=0;P<ue.length;P++){const O=ue[P];let q=null;if(d!==null)q=d.getViewport(O);else{const N=h.getViewSubImage(f,O);q=N.viewport,P===0&&(e.setRenderTargetTextures(x,N.colorTexture,N.depthStencilTexture),e.setRenderTarget(x))}let $=D[P];$===void 0&&($=new Hi,$.layers.enable(P),$.viewport=new Jt,D[P]=$),$.matrix.fromArray(O.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(O.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(q.x,q.y,q.width,q.height),P===0&&(L.matrix.copy($.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ce===!0&&L.cameras.push($)}const Fe=r.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&m){h=i.getBinding();const P=h.getDepthInformation(ue[0]);P&&P.isValid&&P.texture&&_.init(P,r.renderState)}if(Fe&&Fe.includes("camera-access")&&m){e.state.unbindTexture(),h=i.getBinding();for(let P=0;P<ue.length;P++){const O=ue[P].camera;if(O){let q=g[O];q||(q=new mS,g[O]=q);const $=h.getCameraImage(O);q.sourceTexture=$}}}}for(let ue=0;ue<b.length;ue++){const Ce=T[ue],Fe=b[ue];Ce!==null&&Fe!==void 0&&Fe.update(Ce,ce,c||o)}$e&&$e(Y,ce),ce.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ce}),p=null}const Oe=new xS;Oe.setAnimationLoop(Ge),this.setAnimationLoop=function(Y){$e=Y},this.dispose=function(){}}}const pL=new tn,wS=new tt;wS.set(-1,0,0,0,1,0,0,0,1);function mL(n,e){function t(_,g){_.matrixAutoUpdate===!0&&_.updateMatrix(),g.value.copy(_.matrix)}function i(_,g){g.color.getRGB(_.fogColor.value,_S(n)),g.isFog?(_.fogNear.value=g.near,_.fogFar.value=g.far):g.isFogExp2&&(_.fogDensity.value=g.density)}function r(_,g,y,v,x){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(_,g):g.isMeshLambertMaterial?(s(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(_,g),h(_,g)):g.isMeshPhongMaterial?(s(_,g),u(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(_,g),f(_,g),g.isMeshPhysicalMaterial&&d(_,g,x)):g.isMeshMatcapMaterial?(s(_,g),p(_,g)):g.isMeshDepthMaterial?s(_,g):g.isMeshDistanceMaterial?(s(_,g),m(_,g)):g.isMeshNormalMaterial?s(_,g):g.isLineBasicMaterial?(o(_,g),g.isLineDashedMaterial&&a(_,g)):g.isPointsMaterial?l(_,g,y,v):g.isSpriteMaterial?c(_,g):g.isShadowMaterial?(_.color.value.copy(g.color),_.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(_,g){_.opacity.value=g.opacity,g.color&&_.diffuse.value.copy(g.color),g.emissive&&_.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.bumpMap&&(_.bumpMap.value=g.bumpMap,t(g.bumpMap,_.bumpMapTransform),_.bumpScale.value=g.bumpScale,g.side===fi&&(_.bumpScale.value*=-1)),g.normalMap&&(_.normalMap.value=g.normalMap,t(g.normalMap,_.normalMapTransform),_.normalScale.value.copy(g.normalScale),g.side===fi&&_.normalScale.value.negate()),g.displacementMap&&(_.displacementMap.value=g.displacementMap,t(g.displacementMap,_.displacementMapTransform),_.displacementScale.value=g.displacementScale,_.displacementBias.value=g.displacementBias),g.emissiveMap&&(_.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,_.emissiveMapTransform)),g.specularMap&&(_.specularMap.value=g.specularMap,t(g.specularMap,_.specularMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest);const y=e.get(g),v=y.envMap,x=y.envMapRotation;v&&(_.envMap.value=v,_.envMapRotation.value.setFromMatrix4(pL.makeRotationFromEuler(x)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(wS),_.reflectivity.value=g.reflectivity,_.ior.value=g.ior,_.refractionRatio.value=g.refractionRatio),g.lightMap&&(_.lightMap.value=g.lightMap,_.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,_.lightMapTransform)),g.aoMap&&(_.aoMap.value=g.aoMap,_.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,_.aoMapTransform))}function o(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform))}function a(_,g){_.dashSize.value=g.dashSize,_.totalSize.value=g.dashSize+g.gapSize,_.scale.value=g.scale}function l(_,g,y,v){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.size.value=g.size*y,_.scale.value=v*.5,g.map&&(_.map.value=g.map,t(g.map,_.uvTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function c(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.rotation.value=g.rotation,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function u(_,g){_.specular.value.copy(g.specular),_.shininess.value=Math.max(g.shininess,1e-4)}function h(_,g){g.gradientMap&&(_.gradientMap.value=g.gradientMap)}function f(_,g){_.metalness.value=g.metalness,g.metalnessMap&&(_.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,_.metalnessMapTransform)),_.roughness.value=g.roughness,g.roughnessMap&&(_.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,_.roughnessMapTransform)),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)}function d(_,g,y){_.ior.value=g.ior,g.sheen>0&&(_.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),_.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(_.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,_.sheenColorMapTransform)),g.sheenRoughnessMap&&(_.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,_.sheenRoughnessMapTransform))),g.clearcoat>0&&(_.clearcoat.value=g.clearcoat,_.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(_.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,_.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(_.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===fi&&_.clearcoatNormalScale.value.negate())),g.dispersion>0&&(_.dispersion.value=g.dispersion),g.iridescence>0&&(_.iridescence.value=g.iridescence,_.iridescenceIOR.value=g.iridescenceIOR,_.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(_.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,_.iridescenceMapTransform)),g.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),g.transmission>0&&(_.transmission.value=g.transmission,_.transmissionSamplerMap.value=y.texture,_.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(_.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,_.transmissionMapTransform)),_.thickness.value=g.thickness,g.thicknessMap&&(_.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=g.attenuationDistance,_.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(_.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(_.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=g.specularIntensity,_.specularColor.value.copy(g.specularColor),g.specularColorMap&&(_.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,_.specularColorMapTransform)),g.specularIntensityMap&&(_.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,_.specularIntensityMapTransform))}function p(_,g){g.matcap&&(_.matcap.value=g.matcap)}function m(_,g){const y=e.get(g).light;_.referencePosition.value.setFromMatrixPosition(y.matrixWorld),_.nearDistance.value=y.shadow.camera.near,_.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function _L(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,v){const x=v.program;i.uniformBlockBinding(y,x)}function c(y,v){let x=r[y.id];x===void 0&&(p(y),x=u(y),r[y.id]=x,y.addEventListener("dispose",_));const b=v.program;i.updateUBOMapping(y,b);const T=e.render.frame;s[y.id]!==T&&(f(y),s[y.id]=T)}function u(y){const v=h();y.__bindingPointIndex=v;const x=n.createBuffer(),b=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,b,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,x),x}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return dt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const v=r[y.id],x=y.uniforms,b=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,w=x.length;T<w;T++){const S=Array.isArray(x[T])?x[T]:[x[T]];for(let E=0,A=S.length;E<A;E++){const D=S[E];if(d(D,T,E,b)===!0){const L=D.__offset,H=Array.isArray(D.value)?D.value:[D.value];let z=0;for(let k=0;k<H.length;k++){const B=H[k],U=m(B);typeof B=="number"||typeof B=="boolean"?(D.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,L+z,D.__data)):B.isMatrix3?(D.__data[0]=B.elements[0],D.__data[1]=B.elements[1],D.__data[2]=B.elements[2],D.__data[3]=0,D.__data[4]=B.elements[3],D.__data[5]=B.elements[4],D.__data[6]=B.elements[5],D.__data[7]=0,D.__data[8]=B.elements[6],D.__data[9]=B.elements[7],D.__data[10]=B.elements[8],D.__data[11]=0):ArrayBuffer.isView(B)?D.__data.set(new B.constructor(B.buffer,B.byteOffset,D.__data.length)):(B.toArray(D.__data,z),z+=U.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(y,v,x,b){const T=y.value,w=v+"_"+x;if(b[w]===void 0)return typeof T=="number"||typeof T=="boolean"?b[w]=T:ArrayBuffer.isView(T)?b[w]=T.slice():b[w]=T.clone(),!0;{const S=b[w];if(typeof T=="number"||typeof T=="boolean"){if(S!==T)return b[w]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(S.equals(T)===!1)return S.copy(T),!0}}return!1}function p(y){const v=y.uniforms;let x=0;const b=16;for(let w=0,S=v.length;w<S;w++){const E=Array.isArray(v[w])?v[w]:[v[w]];for(let A=0,D=E.length;A<D;A++){const L=E[A],H=Array.isArray(L.value)?L.value:[L.value];for(let z=0,k=H.length;z<k;z++){const B=H[z],U=m(B),G=x%b,ee=G%U.boundary,F=G+ee;x+=ee,F!==0&&b-F<U.storage&&(x+=b-F),L.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=U.storage}}}const T=x%b;return T>0&&(x+=b-T),y.__size=x,y.__cache={},this}function m(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(v.boundary=16,v.storage=y.byteLength):Je("WebGLRenderer: Unsupported uniform value type.",y),v}function _(y){const v=y.target;v.removeEventListener("dispose",_);const x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function g(){for(const y in r)n.deleteBuffer(r[y]);o=[],r={},s={}}return{bind:l,update:c,dispose:g}}const gL=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let rr=null;function vL(){return rr===null&&(rr=new oC(gL,16,16,To,Jr),rr.name="DFG_LUT",rr.minFilter=_n,rr.magFilter=_n,rr.wrapS=Ki,rr.wrapT=Ki,rr.generateMipmaps=!1,rr.needsUpdate=!0),rr}class xL{constructor(e={}){const{canvas:t=OR(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:d=zi}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const m=d,_=new Set([Pm,Cm,Rm]),g=new Set([zi,Er,Xl,$l,wm,Am]),y=new Uint32Array(4),v=new Int32Array(4),x=new te;let b=null,T=null;const w=[],S=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=vr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const A=this;let D=!1,L=null;this._outputColorSpace=Oi;let H=0,z=0,k=null,B=-1,U=null;const G=new Jt,ee=new Jt;let F=null;const ve=new St(0);let Te=0,$e=t.width,Ge=t.height,Oe=1,Y=null,ce=null;const ue=new Jt(0,0,$e,Ge),Ce=new Jt(0,0,$e,Ge);let Fe=!1;const Le=new dS;let ke=!1,P=!1;const O=new tn,q=new te,$=new Jt,N={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Z=!1;function fe(){return k===null?Oe:1}let I=i;function se(C,X){return t.getContext(C,X)}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Em}`),t.addEventListener("webglcontextlost",ge,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),I===null){const X="webgl2";if(I=se(X,C),I===null)throw se(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw dt("WebGLRenderer: "+C.message),C}let ne,xe,K,_e,R,M,W,J,oe,me,de,re,le,Ee,he,pe,ye,Re,je,Ze,V,Se,ae;function Pe(){ne=new v3(I),ne.init(),V=new cL(I,ne),xe=new u3(I,ne,e,V),K=new aL(I,ne),xe.reversedDepthBuffer&&f&&K.buffers.depth.setReversed(!0),_e=new S3(I),R=new q2,M=new lL(I,ne,K,R,xe,V,_e),W=new g3(A),J=new TC(I),Se=new l3(I,J),oe=new x3(I,J,_e,Se),me=new b3(I,oe,J,Se,_e),Re=new M3(I,xe,M),he=new f3(R),de=new $2(A,W,ne,xe,Se,he),re=new mL(A,R),le=new j2,Ee=new tL(ne),ye=new a3(A,W,K,me,p,l),pe=new oL(A,me,xe),ae=new _L(I,_e,xe,K),je=new c3(I,ne,_e),Ze=new y3(I,ne,_e),_e.programs=de.programs,A.capabilities=xe,A.extensions=ne,A.properties=R,A.renderLists=le,A.shadowMap=pe,A.state=K,A.info=_e}Pe(),m!==zi&&(E=new T3(m,t.width,t.height,r,s));const we=new dL(A,I);this.xr=we,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const C=ne.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ne.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return Oe},this.setPixelRatio=function(C){C!==void 0&&(Oe=C,this.setSize($e,Ge,!1))},this.getSize=function(C){return C.set($e,Ge)},this.setSize=function(C,X,ie=!0){if(we.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}$e=C,Ge=X,t.width=Math.floor(C*Oe),t.height=Math.floor(X*Oe),ie===!0&&(t.style.width=C+"px",t.style.height=X+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,C,X)},this.getDrawingBufferSize=function(C){return C.set($e*Oe,Ge*Oe).floor()},this.setDrawingBufferSize=function(C,X,ie){$e=C,Ge=X,Oe=ie,t.width=Math.floor(C*ie),t.height=Math.floor(X*ie),this.setViewport(0,0,C,X)},this.setEffects=function(C){if(m===zi){dt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let X=0;X<C.length;X++)if(C[X].isOutputPass===!0){Je("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(G)},this.getViewport=function(C){return C.copy(ue)},this.setViewport=function(C,X,ie,j){C.isVector4?ue.set(C.x,C.y,C.z,C.w):ue.set(C,X,ie,j),K.viewport(G.copy(ue).multiplyScalar(Oe).round())},this.getScissor=function(C){return C.copy(Ce)},this.setScissor=function(C,X,ie,j){C.isVector4?Ce.set(C.x,C.y,C.z,C.w):Ce.set(C,X,ie,j),K.scissor(ee.copy(Ce).multiplyScalar(Oe).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(C){K.setScissorTest(Fe=C)},this.setOpaqueSort=function(C){Y=C},this.setTransparentSort=function(C){ce=C},this.getClearColor=function(C){return C.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor(...arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha(...arguments)},this.clear=function(C=!0,X=!0,ie=!0){let j=0;if(C){let Q=!1;if(k!==null){const De=k.texture.format;Q=_.has(De)}if(Q){const De=k.texture.type,Ie=g.has(De),Ue=ye.getClearColor(),Ve=ye.getClearAlpha(),We=Ue.r,nt=Ue.g,st=Ue.b;Ie?(y[0]=We,y[1]=nt,y[2]=st,y[3]=Ve,I.clearBufferuiv(I.COLOR,0,y)):(v[0]=We,v[1]=nt,v[2]=st,v[3]=Ve,I.clearBufferiv(I.COLOR,0,v))}else j|=I.COLOR_BUFFER_BIT}X&&(j|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ie&&(j|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),j!==0&&I.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),L=C},this.dispose=function(){t.removeEventListener("webglcontextlost",ge,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),ye.dispose(),le.dispose(),Ee.dispose(),R.dispose(),W.dispose(),me.dispose(),Se.dispose(),ae.dispose(),de.dispose(),we.dispose(),we.removeEventListener("sessionstart",at),we.removeEventListener("sessionend",Ht),zt.stop()};function ge(C){C.preventDefault(),wg("WebGLRenderer: Context Lost."),D=!0}function be(){wg("WebGLRenderer: Context Restored."),D=!1;const C=_e.autoReset,X=pe.enabled,ie=pe.autoUpdate,j=pe.needsUpdate,Q=pe.type;Pe(),_e.autoReset=C,pe.enabled=X,pe.autoUpdate=ie,pe.needsUpdate=j,pe.type=Q}function Ae(C){dt("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function qe(C){const X=C.target;X.removeEventListener("dispose",qe),Me(X)}function Me(C){Ye(C),R.remove(C)}function Ye(C){const X=R.get(C).programs;X!==void 0&&(X.forEach(function(ie){de.releaseProgram(ie)}),C.isShaderMaterial&&de.releaseShaderCache(C))}this.renderBufferDirect=function(C,X,ie,j,Q,De){X===null&&(X=N);const Ie=Q.isMesh&&Q.matrixWorld.determinant()<0,Ue=yn(C,X,ie,j,Q);K.setMaterial(j,Ie);let Ve=ie.index,We=1;if(j.wireframe===!0){if(Ve=oe.getWireframeAttribute(ie),Ve===void 0)return;We=2}const nt=ie.drawRange,st=ie.attributes.position;let Xe=nt.start*We,Rt=(nt.start+nt.count)*We;De!==null&&(Xe=Math.max(Xe,De.start*We),Rt=Math.min(Rt,(De.start+De.count)*We)),Ve!==null?(Xe=Math.max(Xe,0),Rt=Math.min(Rt,Ve.count)):st!=null&&(Xe=Math.max(Xe,0),Rt=Math.min(Rt,st.count));const jt=Rt-Xe;if(jt<0||jt===1/0)return;Se.setup(Q,j,Ue,ie,Ve);let $t,Pt=je;if(Ve!==null&&($t=J.get(Ve),Pt=Ze,Pt.setIndex($t)),Q.isMesh)j.wireframe===!0?(K.setLineWidth(j.wireframeLinewidth*fe()),Pt.setMode(I.LINES)):Pt.setMode(I.TRIANGLES);else if(Q.isLine){let In=j.linewidth;In===void 0&&(In=1),K.setLineWidth(In*fe()),Q.isLineSegments?Pt.setMode(I.LINES):Q.isLineLoop?Pt.setMode(I.LINE_LOOP):Pt.setMode(I.LINE_STRIP)}else Q.isPoints?Pt.setMode(I.POINTS):Q.isSprite&&Pt.setMode(I.TRIANGLES);if(Q.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))Pt.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{const In=Q._multiDrawStarts,Be=Q._multiDrawCounts,mi=Q._multiDrawCount,mt=Ve?J.get(Ve).bytesPerElement:1,Ii=R.get(j).currentProgram.getUniforms();for(let nr=0;nr<mi;nr++)Ii.setValue(I,"_gl_DrawID",nr),Pt.render(In[nr]/mt,Be[nr])}else if(Q.isInstancedMesh)Pt.renderInstances(Xe,jt,Q.count);else if(ie.isInstancedBufferGeometry){const In=ie._maxInstanceCount!==void 0?ie._maxInstanceCount:1/0,Be=Math.min(ie.instanceCount,In);Pt.renderInstances(Xe,jt,Be)}else Pt.render(Xe,jt)};function ze(C,X,ie){C.transparent===!0&&C.side===kr&&C.forceSinglePass===!1?(C.side=fi,C.needsUpdate=!0,xn(C,X,ie),C.side=Fs,C.needsUpdate=!0,xn(C,X,ie),C.side=kr):xn(C,X,ie)}this.compile=function(C,X,ie=null){ie===null&&(ie=C),T=Ee.get(ie),T.init(X),S.push(T),ie.traverseVisible(function(Q){Q.isLight&&Q.layers.test(X.layers)&&(T.pushLight(Q),Q.castShadow&&T.pushShadow(Q))}),C!==ie&&C.traverseVisible(function(Q){Q.isLight&&Q.layers.test(X.layers)&&(T.pushLight(Q),Q.castShadow&&T.pushShadow(Q))}),T.setupLights();const j=new Set;return C.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;const De=Q.material;if(De)if(Array.isArray(De))for(let Ie=0;Ie<De.length;Ie++){const Ue=De[Ie];ze(Ue,ie,Q),j.add(Ue)}else ze(De,ie,Q),j.add(De)}),T=S.pop(),j},this.compileAsync=function(C,X,ie=null){const j=this.compile(C,X,ie);return new Promise(Q=>{function De(){if(j.forEach(function(Ie){R.get(Ie).currentProgram.isReady()&&j.delete(Ie)}),j.size===0){Q(C);return}setTimeout(De,10)}ne.get("KHR_parallel_shader_compile")!==null?De():setTimeout(De,10)})};let Qe=null;function nn(C){Qe&&Qe(C)}function at(){zt.stop()}function Ht(){zt.start()}const zt=new xS;zt.setAnimationLoop(nn),typeof self<"u"&&zt.setContext(self),this.setAnimationLoop=function(C){Qe=C,we.setAnimationLoop(C),C===null?zt.stop():zt.start()},we.addEventListener("sessionstart",at),we.addEventListener("sessionend",Ht),this.render=function(C,X){if(X!==void 0&&X.isCamera!==!0){dt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;L!==null&&L.renderStart(C,X);const ie=we.enabled===!0&&we.isPresenting===!0,j=E!==null&&(k===null||ie)&&E.begin(A,k);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(we.cameraAutoUpdate===!0&&we.updateCamera(X),X=we.getCamera()),C.isScene===!0&&C.onBeforeRender(A,C,X,k),T=Ee.get(C,S.length),T.init(X),T.state.textureUnits=M.getTextureUnits(),S.push(T),O.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),Le.setFromProjectionMatrix(O,mr,X.reversedDepth),P=this.localClippingEnabled,ke=he.init(this.clippingPlanes,P),b=le.get(C,w.length),b.init(),w.push(b),we.enabled===!0&&we.isPresenting===!0){const Ie=A.xr.getDepthSensingMesh();Ie!==null&&Ut(Ie,X,-1/0,A.sortObjects)}Ut(C,X,0,A.sortObjects),b.finish(),A.sortObjects===!0&&b.sort(Y,ce),Z=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,Z&&ye.addToRenderList(b,C),this.info.render.frame++,ke===!0&&he.beginShadows();const Q=T.state.shadowsArray;if(pe.render(Q,C,X),ke===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset(),(j&&E.hasRenderPass())===!1){const Ie=b.opaque,Ue=b.transmissive;if(T.setupLights(),X.isArrayCamera){const Ve=X.cameras;if(Ue.length>0)for(let We=0,nt=Ve.length;We<nt;We++){const st=Ve[We];gt(Ie,Ue,C,st)}Z&&ye.render(C);for(let We=0,nt=Ve.length;We<nt;We++){const st=Ve[We];Ct(b,C,st,st.viewport)}}else Ue.length>0&&gt(Ie,Ue,C,X),Z&&ye.render(C),Ct(b,C,X)}k!==null&&z===0&&(M.updateMultisampleRenderTarget(k),M.updateRenderTargetMipmap(k)),j&&E.end(A),C.isScene===!0&&C.onAfterRender(A,C,X),Se.resetDefaultState(),B=-1,U=null,S.pop(),S.length>0?(T=S[S.length-1],M.setTextureUnits(T.state.textureUnits),ke===!0&&he.setGlobalState(A.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?b=w[w.length-1]:b=null,L!==null&&L.renderEnd()};function Ut(C,X,ie,j){if(C.visible===!1)return;if(C.layers.test(X.layers)){if(C.isGroup)ie=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(X);else if(C.isLightProbeGrid)T.pushLightProbeGrid(C);else if(C.isLight)T.pushLight(C),C.castShadow&&T.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Le.intersectsSprite(C)){j&&$.setFromMatrixPosition(C.matrixWorld).applyMatrix4(O);const Ie=me.update(C),Ue=C.material;Ue.visible&&b.push(C,Ie,Ue,ie,$.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Le.intersectsObject(C))){const Ie=me.update(C),Ue=C.material;if(j&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),$.copy(C.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),$.copy(Ie.boundingSphere.center)),$.applyMatrix4(C.matrixWorld).applyMatrix4(O)),Array.isArray(Ue)){const Ve=Ie.groups;for(let We=0,nt=Ve.length;We<nt;We++){const st=Ve[We],Xe=Ue[st.materialIndex];Xe&&Xe.visible&&b.push(C,Ie,Xe,ie,$.z,st)}}else Ue.visible&&b.push(C,Ie,Ue,ie,$.z,null)}}const De=C.children;for(let Ie=0,Ue=De.length;Ie<Ue;Ie++)Ut(De[Ie],X,ie,j)}function Ct(C,X,ie,j){const{opaque:Q,transmissive:De,transparent:Ie}=C;T.setupLightsView(ie),ke===!0&&he.setGlobalState(A.clippingPlanes,ie),j&&K.viewport(G.copy(j)),Q.length>0&&Ln(Q,X,ie),De.length>0&&Ln(De,X,ie),Ie.length>0&&Ln(Ie,X,ie),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function gt(C,X,ie,j){if((ie.isScene===!0?ie.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[j.id]===void 0){const Xe=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[j.id]=new xr(1,1,{generateMipmaps:!0,type:Xe?Jr:zi,minFilter:Es,samples:Math.max(4,xe.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace})}const De=T.state.transmissionRenderTarget[j.id],Ie=j.viewport||G;De.setSize(Ie.z*A.transmissionResolutionScale,Ie.w*A.transmissionResolutionScale);const Ue=A.getRenderTarget(),Ve=A.getActiveCubeFace(),We=A.getActiveMipmapLevel();A.setRenderTarget(De),A.getClearColor(ve),Te=A.getClearAlpha(),Te<1&&A.setClearColor(16777215,.5),A.clear(),Z&&ye.render(ie);const nt=A.toneMapping;A.toneMapping=vr;const st=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),T.setupLightsView(j),ke===!0&&he.setGlobalState(A.clippingPlanes,j),Ln(C,ie,j),M.updateMultisampleRenderTarget(De),M.updateRenderTargetMipmap(De),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let Rt=0,jt=X.length;Rt<jt;Rt++){const $t=X[Rt],{object:Pt,geometry:In,material:Be,group:mi}=$t;if(Be.side===kr&&Pt.layers.test(j.layers)){const mt=Be.side;Be.side=fi,Be.needsUpdate=!0,Ft(Pt,ie,j,In,Be,mi),Be.side=mt,Be.needsUpdate=!0,Xe=!0}}Xe===!0&&(M.updateMultisampleRenderTarget(De),M.updateRenderTargetMipmap(De))}A.setRenderTarget(Ue,Ve,We),A.setClearColor(ve,Te),st!==void 0&&(j.viewport=st),A.toneMapping=nt}function Ln(C,X,ie){const j=X.isScene===!0?X.overrideMaterial:null;for(let Q=0,De=C.length;Q<De;Q++){const Ie=C[Q],{object:Ue,geometry:Ve,group:We}=Ie;let nt=Ie.material;nt.allowOverride===!0&&j!==null&&(nt=j),Ue.layers.test(ie.layers)&&Ft(Ue,X,ie,Ve,nt,We)}}function Ft(C,X,ie,j,Q,De){C.onBeforeRender(A,X,ie,j,Q,De),C.modelViewMatrix.multiplyMatrices(ie.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),Q.onBeforeRender(A,X,ie,j,C,De),Q.transparent===!0&&Q.side===kr&&Q.forceSinglePass===!1?(Q.side=fi,Q.needsUpdate=!0,A.renderBufferDirect(ie,X,j,Q,C,De),Q.side=Fs,Q.needsUpdate=!0,A.renderBufferDirect(ie,X,j,Q,C,De),Q.side=kr):A.renderBufferDirect(ie,X,j,Q,C,De),C.onAfterRender(A,X,ie,j,Q,De)}function xn(C,X,ie){X.isScene!==!0&&(X=N);const j=R.get(C),Q=T.state.lights,De=T.state.shadowsArray,Ie=Q.state.version,Ue=de.getParameters(C,Q.state,De,X,ie,T.state.lightProbeGridArray),Ve=de.getProgramCacheKey(Ue);let We=j.programs;j.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?X.environment:null,j.fog=X.fog;const nt=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;j.envMap=W.get(C.envMap||j.environment,nt),j.envMapRotation=j.environment!==null&&C.envMap===null?X.environmentRotation:C.envMapRotation,We===void 0&&(C.addEventListener("dispose",qe),We=new Map,j.programs=We);let st=We.get(Ve);if(st!==void 0){if(j.currentProgram===st&&j.lightsStateVersion===Ie)return rn(C,Ue),st}else Ue.uniforms=de.getUniforms(C),L!==null&&C.isNodeMaterial&&L.build(C,ie,Ue),C.onBeforeCompile(Ue,A),st=de.acquireProgram(Ue,Ve),We.set(Ve,st),j.uniforms=Ue.uniforms;const Xe=j.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Xe.clippingPlanes=he.uniform),rn(C,Ue),j.needsLights=Co(C),j.lightsStateVersion=Ie,j.needsLights&&(Xe.ambientLightColor.value=Q.state.ambient,Xe.lightProbe.value=Q.state.probe,Xe.directionalLights.value=Q.state.directional,Xe.directionalLightShadows.value=Q.state.directionalShadow,Xe.spotLights.value=Q.state.spot,Xe.spotLightShadows.value=Q.state.spotShadow,Xe.rectAreaLights.value=Q.state.rectArea,Xe.ltc_1.value=Q.state.rectAreaLTC1,Xe.ltc_2.value=Q.state.rectAreaLTC2,Xe.pointLights.value=Q.state.point,Xe.pointLightShadows.value=Q.state.pointShadow,Xe.hemisphereLights.value=Q.state.hemi,Xe.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Xe.spotLightMatrix.value=Q.state.spotLightMatrix,Xe.spotLightMap.value=Q.state.spotLightMap,Xe.pointShadowMatrix.value=Q.state.pointShadowMatrix),j.lightProbeGrid=T.state.lightProbeGridArray.length>0,j.currentProgram=st,j.uniformsList=null,st}function pi(C){if(C.uniformsList===null){const X=C.currentProgram.getUniforms();C.uniformsList=hu.seqWithValue(X.seq,C.uniforms)}return C.uniformsList}function rn(C,X){const ie=R.get(C);ie.outputColorSpace=X.outputColorSpace,ie.batching=X.batching,ie.batchingColor=X.batchingColor,ie.instancing=X.instancing,ie.instancingColor=X.instancingColor,ie.instancingMorph=X.instancingMorph,ie.skinning=X.skinning,ie.morphTargets=X.morphTargets,ie.morphNormals=X.morphNormals,ie.morphColors=X.morphColors,ie.morphTargetsCount=X.morphTargetsCount,ie.numClippingPlanes=X.numClippingPlanes,ie.numIntersection=X.numClipIntersection,ie.vertexAlphas=X.vertexAlphas,ie.vertexTangents=X.vertexTangents,ie.toneMapping=X.toneMapping}function fn(C,X){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;x.setFromMatrixPosition(X.matrixWorld);for(let ie=0,j=C.length;ie<j;ie++){const Q=C[ie];if(Q.texture!==null&&Q.boundingBox.containsPoint(x))return Q}return null}function yn(C,X,ie,j,Q){X.isScene!==!0&&(X=N),M.resetTextureUnits();const De=X.fog,Ie=j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial?X.environment:null,Ue=k===null?A.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:ut.workingColorSpace,Ve=j.isMeshStandardMaterial||j.isMeshLambertMaterial&&!j.envMap||j.isMeshPhongMaterial&&!j.envMap,We=W.get(j.envMap||Ie,Ve),nt=j.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,st=!!ie.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Xe=!!ie.morphAttributes.position,Rt=!!ie.morphAttributes.normal,jt=!!ie.morphAttributes.color;let $t=vr;j.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&($t=A.toneMapping);const Pt=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,In=Pt!==void 0?Pt.length:0,Be=R.get(j),mi=T.state.lights;if(ke===!0&&(P===!0||C!==U)){const Ot=C===U&&j.id===B;he.setState(j,C,Ot)}let mt=!1;j.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==mi.state.version||Be.outputColorSpace!==Ue||Q.isBatchedMesh&&Be.batching===!1||!Q.isBatchedMesh&&Be.batching===!0||Q.isBatchedMesh&&Be.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&Be.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&Be.instancing===!1||!Q.isInstancedMesh&&Be.instancing===!0||Q.isSkinnedMesh&&Be.skinning===!1||!Q.isSkinnedMesh&&Be.skinning===!0||Q.isInstancedMesh&&Be.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Be.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&Be.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&Be.instancingMorph===!1&&Q.morphTexture!==null||Be.envMap!==We||j.fog===!0&&Be.fog!==De||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==he.numPlanes||Be.numIntersection!==he.numIntersection)||Be.vertexAlphas!==nt||Be.vertexTangents!==st||Be.morphTargets!==Xe||Be.morphNormals!==Rt||Be.morphColors!==jt||Be.toneMapping!==$t||Be.morphTargetsCount!==In||!!Be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Be.__version=j.version);let Ii=Be.currentProgram;mt===!0&&(Ii=xn(j,X,Q),L&&j.isNodeMaterial&&L.onUpdateProgram(j,Ii,Be));let nr=!1,ns=!1,Po=!1;const Dt=Ii.getUniforms(),Kt=Be.uniforms;if(K.useProgram(Ii.program)&&(nr=!0,ns=!0,Po=!0),j.id!==B&&(B=j.id,ns=!0),Be.needsLights){const Ot=fn(T.state.lightProbeGridArray,Q);Be.lightProbeGrid!==Ot&&(Be.lightProbeGrid=Ot,ns=!0)}if(nr||U!==C){K.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Dt.setValue(I,"projectionMatrix",C.projectionMatrix),Dt.setValue(I,"viewMatrix",C.matrixWorldInverse);const rs=Dt.map.cameraPosition;rs!==void 0&&rs.setValue(I,q.setFromMatrixPosition(C.matrixWorld)),xe.logarithmicDepthBuffer&&Dt.setValue(I,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Dt.setValue(I,"isOrthographic",C.isOrthographicCamera===!0),U!==C&&(U=C,ns=!0,Po=!0)}if(Be.needsLights&&(mi.state.directionalShadowMap.length>0&&Dt.setValue(I,"directionalShadowMap",mi.state.directionalShadowMap,M),mi.state.spotShadowMap.length>0&&Dt.setValue(I,"spotShadowMap",mi.state.spotShadowMap,M),mi.state.pointShadowMap.length>0&&Dt.setValue(I,"pointShadowMap",mi.state.pointShadowMap,M)),Q.isSkinnedMesh){Dt.setOptional(I,Q,"bindMatrix"),Dt.setOptional(I,Q,"bindMatrixInverse");const Ot=Q.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Dt.setValue(I,"boneTexture",Ot.boneTexture,M))}Q.isBatchedMesh&&(Dt.setOptional(I,Q,"batchingTexture"),Dt.setValue(I,"batchingTexture",Q._matricesTexture,M),Dt.setOptional(I,Q,"batchingIdTexture"),Dt.setValue(I,"batchingIdTexture",Q._indirectTexture,M),Dt.setOptional(I,Q,"batchingColorTexture"),Q._colorsTexture!==null&&Dt.setValue(I,"batchingColorTexture",Q._colorsTexture,M));const is=ie.morphAttributes;if((is.position!==void 0||is.normal!==void 0||is.color!==void 0)&&Re.update(Q,ie,Ii),(ns||Be.receiveShadow!==Q.receiveShadow)&&(Be.receiveShadow=Q.receiveShadow,Dt.setValue(I,"receiveShadow",Q.receiveShadow)),(j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial)&&j.envMap===null&&X.environment!==null&&(Kt.envMapIntensity.value=X.environmentIntensity),Kt.dfgLUT!==void 0&&(Kt.dfgLUT.value=vL()),ns){if(Dt.setValue(I,"toneMappingExposure",A.toneMappingExposure),Be.needsLights&&wr(Kt,Po),De&&j.fog===!0&&re.refreshFogUniforms(Kt,De),re.refreshMaterialUniforms(Kt,j,Oe,Ge,T.state.transmissionRenderTarget[C.id]),Be.needsLights&&Be.lightProbeGrid){const Ot=Be.lightProbeGrid;Kt.probesSH.value=Ot.texture,Kt.probesMin.value.copy(Ot.boundingBox.min),Kt.probesMax.value.copy(Ot.boundingBox.max),Kt.probesResolution.value.copy(Ot.resolution)}hu.upload(I,pi(Be),Kt,M)}if(j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(hu.upload(I,pi(Be),Kt,M),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Dt.setValue(I,"center",Q.center),Dt.setValue(I,"modelViewMatrix",Q.modelViewMatrix),Dt.setValue(I,"normalMatrix",Q.normalMatrix),Dt.setValue(I,"modelMatrix",Q.matrixWorld),j.uniformsGroups!==void 0){const Ot=j.uniformsGroups;for(let rs=0,Do=Ot.length;rs<Do;rs++){const zm=Ot[rs];ae.update(zm,Ii),ae.bind(zm,Ii)}}return Ii}function wr(C,X){C.ambientLightColor.needsUpdate=X,C.lightProbe.needsUpdate=X,C.directionalLights.needsUpdate=X,C.directionalLightShadows.needsUpdate=X,C.pointLights.needsUpdate=X,C.pointLightShadows.needsUpdate=X,C.spotLights.needsUpdate=X,C.spotLightShadows.needsUpdate=X,C.rectAreaLights.needsUpdate=X,C.hemisphereLights.needsUpdate=X}function Co(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(C,X,ie){const j=R.get(C);j.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),R.get(C.texture).__webglTexture=X,R.get(C.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:ie,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,X){const ie=R.get(C);ie.__webglFramebuffer=X,ie.__useDefaultFramebuffer=X===void 0};const Sn=I.createFramebuffer();this.setRenderTarget=function(C,X=0,ie=0){k=C,H=X,z=ie;let j=null,Q=!1,De=!1;if(C){const Ue=R.get(C);if(Ue.__useDefaultFramebuffer!==void 0){K.bindFramebuffer(I.FRAMEBUFFER,Ue.__webglFramebuffer),G.copy(C.viewport),ee.copy(C.scissor),F=C.scissorTest,K.viewport(G),K.scissor(ee),K.setScissorTest(F),B=-1;return}else if(Ue.__webglFramebuffer===void 0)M.setupRenderTarget(C);else if(Ue.__hasExternalTextures)M.rebindTextures(C,R.get(C.texture).__webglTexture,R.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const nt=C.depthTexture;if(Ue.__boundDepthTexture!==nt){if(nt!==null&&R.has(nt)&&(C.width!==nt.image.width||C.height!==nt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");M.setupDepthRenderbuffer(C)}}const Ve=C.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(De=!0);const We=R.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(We[X])?j=We[X][ie]:j=We[X],Q=!0):C.samples>0&&M.useMultisampledRTT(C)===!1?j=R.get(C).__webglMultisampledFramebuffer:Array.isArray(We)?j=We[ie]:j=We,G.copy(C.viewport),ee.copy(C.scissor),F=C.scissorTest}else G.copy(ue).multiplyScalar(Oe).floor(),ee.copy(Ce).multiplyScalar(Oe).floor(),F=Fe;if(ie!==0&&(j=Sn),K.bindFramebuffer(I.FRAMEBUFFER,j)&&K.drawBuffers(C,j),K.viewport(G),K.scissor(ee),K.setScissorTest(F),Q){const Ue=R.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ue.__webglTexture,ie)}else if(De){const Ue=X;for(let Ve=0;Ve<C.textures.length;Ve++){const We=R.get(C.textures[Ve]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ve,We.__webglTexture,ie,Ue)}}else if(C!==null&&ie!==0){const Ue=R.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ue.__webglTexture,ie)}B=-1},this.readRenderTargetPixels=function(C,X,ie,j,Q,De,Ie,Ue=0){if(!(C&&C.isWebGLRenderTarget)){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ve=R.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ve=Ve[Ie]),Ve){K.bindFramebuffer(I.FRAMEBUFFER,Ve);try{const We=C.textures[Ue],nt=We.format,st=We.type;if(C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ue),!xe.textureFormatReadable(nt)){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xe.textureTypeReadable(st)){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=C.width-j&&ie>=0&&ie<=C.height-Q&&I.readPixels(X,ie,j,Q,V.convert(nt),V.convert(st),De)}finally{const We=k!==null?R.get(k).__webglFramebuffer:null;K.bindFramebuffer(I.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(C,X,ie,j,Q,De,Ie,Ue=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ve=R.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ve=Ve[Ie]),Ve)if(X>=0&&X<=C.width-j&&ie>=0&&ie<=C.height-Q){K.bindFramebuffer(I.FRAMEBUFFER,Ve);const We=C.textures[Ue],nt=We.format,st=We.type;if(C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ue),!xe.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xe.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Xe),I.bufferData(I.PIXEL_PACK_BUFFER,De.byteLength,I.STREAM_READ),I.readPixels(X,ie,j,Q,V.convert(nt),V.convert(st),0);const Rt=k!==null?R.get(k).__webglFramebuffer:null;K.bindFramebuffer(I.FRAMEBUFFER,Rt);const jt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await BR(I,jt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Xe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,De),I.deleteBuffer(Xe),I.deleteSync(jt),De}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,X=null,ie=0){const j=Math.pow(2,-ie),Q=Math.floor(C.image.width*j),De=Math.floor(C.image.height*j),Ie=X!==null?X.x:0,Ue=X!==null?X.y:0;M.setTexture2D(C,0),I.copyTexSubImage2D(I.TEXTURE_2D,ie,0,0,Ie,Ue,Q,De),K.unbindTexture()};const Yt=I.createFramebuffer(),Li=I.createFramebuffer();this.copyTextureToTexture=function(C,X,ie=null,j=null,Q=0,De=0){let Ie,Ue,Ve,We,nt,st,Xe,Rt,jt;const $t=C.isCompressedTexture?C.mipmaps[De]:C.image;if(ie!==null)Ie=ie.max.x-ie.min.x,Ue=ie.max.y-ie.min.y,Ve=ie.isBox3?ie.max.z-ie.min.z:1,We=ie.min.x,nt=ie.min.y,st=ie.isBox3?ie.min.z:0;else{const Kt=Math.pow(2,-Q);Ie=Math.floor($t.width*Kt),Ue=Math.floor($t.height*Kt),C.isDataArrayTexture?Ve=$t.depth:C.isData3DTexture?Ve=Math.floor($t.depth*Kt):Ve=1,We=0,nt=0,st=0}j!==null?(Xe=j.x,Rt=j.y,jt=j.z):(Xe=0,Rt=0,jt=0);const Pt=V.convert(X.format),In=V.convert(X.type);let Be;X.isData3DTexture?(M.setTexture3D(X,0),Be=I.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(M.setTexture2DArray(X,0),Be=I.TEXTURE_2D_ARRAY):(M.setTexture2D(X,0),Be=I.TEXTURE_2D),K.activeTexture(I.TEXTURE0),K.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,X.flipY),K.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),K.pixelStorei(I.UNPACK_ALIGNMENT,X.unpackAlignment);const mi=K.getParameter(I.UNPACK_ROW_LENGTH),mt=K.getParameter(I.UNPACK_IMAGE_HEIGHT),Ii=K.getParameter(I.UNPACK_SKIP_PIXELS),nr=K.getParameter(I.UNPACK_SKIP_ROWS),ns=K.getParameter(I.UNPACK_SKIP_IMAGES);K.pixelStorei(I.UNPACK_ROW_LENGTH,$t.width),K.pixelStorei(I.UNPACK_IMAGE_HEIGHT,$t.height),K.pixelStorei(I.UNPACK_SKIP_PIXELS,We),K.pixelStorei(I.UNPACK_SKIP_ROWS,nt),K.pixelStorei(I.UNPACK_SKIP_IMAGES,st);const Po=C.isDataArrayTexture||C.isData3DTexture,Dt=X.isDataArrayTexture||X.isData3DTexture;if(C.isDepthTexture){const Kt=R.get(C),is=R.get(X),Ot=R.get(Kt.__renderTarget),rs=R.get(is.__renderTarget);K.bindFramebuffer(I.READ_FRAMEBUFFER,Ot.__webglFramebuffer),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,rs.__webglFramebuffer);for(let Do=0;Do<Ve;Do++)Po&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(C).__webglTexture,Q,st+Do),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(X).__webglTexture,De,jt+Do)),I.blitFramebuffer(We,nt,Ie,Ue,Xe,Rt,Ie,Ue,I.DEPTH_BUFFER_BIT,I.NEAREST);K.bindFramebuffer(I.READ_FRAMEBUFFER,null),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(Q!==0||C.isRenderTargetTexture||R.has(C)){const Kt=R.get(C),is=R.get(X);K.bindFramebuffer(I.READ_FRAMEBUFFER,Yt),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,Li);for(let Ot=0;Ot<Ve;Ot++)Po?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Kt.__webglTexture,Q,st+Ot):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Kt.__webglTexture,Q),Dt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,is.__webglTexture,De,jt+Ot):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,is.__webglTexture,De),Q!==0?I.blitFramebuffer(We,nt,Ie,Ue,Xe,Rt,Ie,Ue,I.COLOR_BUFFER_BIT,I.NEAREST):Dt?I.copyTexSubImage3D(Be,De,Xe,Rt,jt+Ot,We,nt,Ie,Ue):I.copyTexSubImage2D(Be,De,Xe,Rt,We,nt,Ie,Ue);K.bindFramebuffer(I.READ_FRAMEBUFFER,null),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Dt?C.isDataTexture||C.isData3DTexture?I.texSubImage3D(Be,De,Xe,Rt,jt,Ie,Ue,Ve,Pt,In,$t.data):X.isCompressedArrayTexture?I.compressedTexSubImage3D(Be,De,Xe,Rt,jt,Ie,Ue,Ve,Pt,$t.data):I.texSubImage3D(Be,De,Xe,Rt,jt,Ie,Ue,Ve,Pt,In,$t):C.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,De,Xe,Rt,Ie,Ue,Pt,In,$t.data):C.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,De,Xe,Rt,$t.width,$t.height,Pt,$t.data):I.texSubImage2D(I.TEXTURE_2D,De,Xe,Rt,Ie,Ue,Pt,In,$t);K.pixelStorei(I.UNPACK_ROW_LENGTH,mi),K.pixelStorei(I.UNPACK_IMAGE_HEIGHT,mt),K.pixelStorei(I.UNPACK_SKIP_PIXELS,Ii),K.pixelStorei(I.UNPACK_SKIP_ROWS,nr),K.pixelStorei(I.UNPACK_SKIP_IMAGES,ns),De===0&&X.generateMipmaps&&I.generateMipmap(Be),K.unbindTexture()},this.initRenderTarget=function(C){R.get(C).__webglFramebuffer===void 0&&M.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?M.setTextureCube(C,0):C.isData3DTexture?M.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?M.setTexture2DArray(C,0):M.setTexture2D(C,0),K.unbindTexture()},this.resetState=function(){H=0,z=0,k=null,K.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}}const AS=""+new URL("face.CkBiYO94.png",import.meta.url).href,yL=Tr({__name:"SymbolPortraitScene",props:KM({src:{type:String,default:AS},chars:{type:Array,default:()=>["M","F","O","A","B","I","7","5"]},color:{type:[String,Array],default:"#88beef"},colorMode:{type:String,default:"tone"},sampleStep:{type:Number,default:6},fitWidth:{type:Number,default:500},fitHeight:{type:Number,default:500},worldScale:{type:Number,default:1},minDensity:{type:Number,default:.8},densityGamma:{type:Number,default:2},darkBoost:{type:Number,default:1.8},sizeMin:{type:Number,default:18},sizeMax:{type:Number,default:36},maxParticles:{type:Number,default:14e3},bgColor:{type:String,default:"#ffffff"},revealDuration:{type:Number,default:3},disperseDuration:{type:Number,default:2.2},disperseSpread:{type:Array,default:()=>[900,520,240]},floatAmp:{type:Number,default:22},floatMicro:{type:Number,default:4},floatSpeed:{type:Number,default:1},holeRadius:{type:Number,default:90},holeSpread:{type:Number,default:140},groupShift:{type:Number,default:11},groupShiftNear:{type:Number,default:120},groupShiftFar:{type:Number,default:380},mouseEase:{type:Number,default:8},autoMouse:{type:Boolean,default:!1},autoMouseSpeed:{type:Number,default:1},phrases:{type:Array,default:()=>["1","2","3","4","5","6"]},gridCols:{type:Number,default:3},gridRows:{type:Number,default:2},phraseColor:{type:String,default:"#ffffff"}},{dispersed:{type:Boolean,default:!1},dispersedModifiers:{}}),emits:["update:dispersed"],setup(n){const e=n,t=At(null),i=At(null),r=At(-1),s=rb(n,"dispersed");let o=null;jc(s,()=>o?.(!0));const a=c=>{const h=Math.ceil(Math.sqrt(c.length)),f=Math.ceil(c.length/h),d=document.createElement("canvas");d.width=h*64,d.height=f*64;const p=d.getContext("2d");p.fillStyle="#fff",p.font=`bold ${64*.78}px "Courier New", monospace`,p.textAlign="center",p.textBaseline="middle",c.forEach((_,g)=>{const y=g%h*64+32,v=Math.floor(g/h)*64+64/2;p.fillText(_,y,v)});const m=new Gg(d);return m.minFilter=Es,m.magFilter=_n,{texture:m,cols:h,rows:f}},l=c=>{const u=Array.isArray(c)?c:[c],h=256,f=document.createElement("canvas");f.width=h,f.height=1;const d=f.getContext("2d");if(u.length===1)d.fillStyle=u[0],d.fillRect(0,0,h,1);else{const m=d.createLinearGradient(0,0,h,0);u.forEach((_,g)=>m.addColorStop(g/(u.length-1),_)),d.fillStyle=m,d.fillRect(0,0,h,1)}const p=new Gg(f);return p.minFilter=_n,p.magFilter=_n,p.wrapS=Ki,p.wrapT=Ki,p};return jr(()=>{const c=t.value;if(!c)return;const u=c.clientWidth,h=c.clientHeight,f=new eC;f.background=new St(e.bgColor);const d=new Hi(50,u/h,.1,2e3);d.position.z=600;const p=new xL({antialias:!0,alpha:!0});p.setPixelRatio(Math.min(window.devicePixelRatio,2)),p.setSize(u,h),c.appendChild(p.domElement);const m=new te(9999,9999,0),_=new te(9999,9999,0);let g=0,y=0;const v=new Mt,x=new MC,b=new ps(new te(0,0,1),0),T=new te,w=ke=>{const P=p.domElement.getBoundingClientRect();v.x=(ke.clientX-P.left)/P.width*2-1,v.y=-((ke.clientY-P.top)/P.height)*2+1,x.setFromCamera(v,d),x.ray.intersectPlane(b,T)&&(m.copy(T),g=1)},S=()=>{g=0};p.domElement.addEventListener("pointermove",w),p.domElement.addEventListener("pointerleave",S);const E=a(e.chars),A=l(e.color);let D=null,L=null,H=!1,z=0,k=0,B=150,U=150;const G=ke=>{const P=ke.naturalWidth,O=ke.naturalHeight,q=document.createElement("canvas");q.width=P,q.height=O;const $=q.getContext("2d");$.drawImage(ke,0,0);const N=$.getImageData(0,0,P,O).data,Z=Math.min(e.fitWidth/P,e.fitHeight/O)*e.worldScale;z=P*Z/2,k=O*Z/2,B=z*.7,U=k*.7;const fe=[],I=[],se=[],ne=e.sampleStep;for(let Ee=0;Ee<O;Ee+=ne)for(let he=0;he<P;he+=ne){let pe=0,ye=0,Re=0;for(let Se=0;Se<ne&&Ee+Se<O;Se++)for(let ae=0;ae<ne&&he+ae<P;ae++){const Pe=((Ee+Se)*P+(he+ae))*4;pe+=(.299*(N[Pe]??0)+.587*(N[Pe+1]??0)+.114*(N[Pe+2]??0))/255,ye+=(N[Pe+3]??0)/255,Re++}const je=ye/Re;if(je<.5)continue;const Ze=Math.min(1,(1-pe/Re)*e.darkBoost),V=(e.minDensity+(1-e.minDensity)*Math.pow(Ze,e.densityGamma))*je;Math.random()>V||(fe.push((he-P/2)*Z,-(Ee-O/2)*Z,(Math.random()-.5)*8),I.push(e.sizeMin+(e.sizeMax-e.sizeMin)*Ze),se.push(Ze))}let xe=fe.length/3;if(xe>e.maxParticles){const Ee=e.maxParticles/xe;let he=0;for(let pe=0;pe<xe;pe++)Math.random()>Ee||(fe[he*3]=fe[pe*3],fe[he*3+1]=fe[pe*3+1],fe[he*3+2]=fe[pe*3+2],I[he]=I[pe],se[he]=se[pe],he++);fe.length=he*3,I.length=he,se.length=he,xe=he}const K=new Float32Array(fe),_e=new Float32Array(xe*3),R=new Float32Array(xe*3),M=new Float32Array(xe),W=new Float32Array(I),J=new Float32Array(xe),oe=new Float32Array(xe),me=e.disperseSpread[0]??900,de=e.disperseSpread[1]??520,re=e.disperseSpread[2]??240;for(let Ee=0;Ee<xe;Ee++){const he=Ee*3,pe=Math.random()*Math.PI*2,ye=80+Math.random()*120;_e[he]=K[he]+Math.cos(pe)*ye,_e[he+1]=K[he+1]+Math.sin(pe)*ye,_e[he+2]=K[he+2],R[he]=(Math.random()-.5)*me,R[he+1]=(Math.random()-.5)*de,R[he+2]=(Math.random()-.5)*re,M[Ee]=Math.random()*.85,J[Ee]=Math.floor(Math.random()*e.chars.length),oe[Ee]=Math.random()}D=new tr,D.setAttribute("position",new pn(_e.slice(),3)),D.setAttribute("aStart",new pn(_e,3)),D.setAttribute("aTarget",new pn(K,3)),D.setAttribute("aFloat",new pn(R,3)),D.setAttribute("aOrder",new pn(M,1)),D.setAttribute("aSize",new pn(W,1)),D.setAttribute("aDark",new pn(new Float32Array(se),1)),D.setAttribute("aGlyph",new pn(J,1)),D.setAttribute("aSeed",new pn(oe,1)),L=new er({transparent:!0,depthWrite:!1,uniforms:{uProgress:{value:0},uTime:{value:0},uDisperse:{value:0},uMouse:{value:new te(9999,9999,0)},uMouseInfluence:{value:0},uPixelRatio:{value:p.getPixelRatio()},uFloatAmp:{value:e.floatAmp},uFloatMicro:{value:e.floatMicro},uFloatSpeed:{value:e.floatSpeed},uHoleRadius:{value:e.holeRadius},uHoleSpread:{value:e.holeSpread},uGroupShift:{value:e.groupShift},uGroupNear:{value:e.groupShiftNear},uGroupFar:{value:e.groupShiftFar},uAtlas:{value:E.texture},uAtlasGrid:{value:new Mt(E.cols,E.rows)},uGlyphCount:{value:e.chars.length},uColorRamp:{value:A},uColorRandom:{value:e.colorMode==="random"?1:0}},vertexShader:`
        attribute vec3 aStart;
        attribute vec3 aTarget;
        attribute vec3 aFloat;
        attribute float aOrder;
        attribute float aSize;
        attribute float aGlyph;
        attribute float aSeed;
        attribute float aDark;
        uniform float uProgress;
        uniform float uTime;
        uniform float uDisperse;
        uniform vec3 uMouse;
        uniform float uMouseInfluence;
        uniform float uPixelRatio;
        uniform float uGlyphCount;
        uniform float uFloatAmp;
        uniform float uFloatMicro;
        uniform float uFloatSpeed;
        uniform float uHoleRadius;
        uniform float uHoleSpread;
        uniform float uGroupShift;
        uniform float uGroupNear;
        uniform float uGroupFar;
        uniform float uColorRandom;
        varying float vAlpha;
        varying float vGlyph;
        varying float vShade;
        varying float vT;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
          float local = smoothstep(aOrder, aOrder + 0.12, uProgress);
          vec3 pos = mix(aStart, aTarget, local);

          // 無互動時的整體漂浮：全粒子同步的低頻隨機遊走（不帶 seed）做出「整片在飄」，
          // 再疊一層每顆微擾（帶 seed）增加 organic 感；散場時淡出交棒給下方 drift
          float idle = local * (1.0 - uDisperse);
          float ts = uTime * uFloatSpeed;
          vec3 sway;
          sway.x = (sin(ts * 0.23) + 0.6 * sin(ts * 0.37 + 1.7)) * uFloatAmp;
          sway.y = (cos(ts * 0.19) + 0.6 * cos(ts * 0.31 + 0.5)) * uFloatAmp;
          sway.z = sin(ts * 0.15) * uFloatAmp * 0.4;
          vec3 micro;
          micro.x = sin(ts * 0.50 + aSeed * 6.2831) * uFloatMicro;
          micro.y = cos(ts * 0.44 + aSeed * 5.0)    * uFloatMicro;
          micro.z = sin(ts * 0.62 + aSeed * 3.1416) * uFloatMicro * 0.5;
          pos += (sway + micro) * idle;

          // 離場：target -> 隨機漂浮位置，並持續緩慢漂移
          vec3 drift = aFloat;
          drift.x += sin(uTime * 0.30 + aSeed * 6.2831) * 28.0;
          drift.y += cos(uTime * 0.22 + aSeed * 12.566) * 22.0;
          drift.z += sin(uTime * 0.18 + aSeed * 3.1416) * 10.0;
          pos = mix(pos, drift, uDisperse);

          // 整體避讓：以游標到群中心(原點)的距離決定整群往反方向(遠離游標)的平移量，
          // uGroupNear 內(重疊)≈0 以保留中心環形真空、到 uGroupFar 達上限即停。
          // uMouseInfluence 由 JS 緩動(進入/離開淡入淡出)；散場後關閉。
          float dCenter = length(uMouse.xy);
          float shiftAmt = uGroupShift * smoothstep(uGroupNear, uGroupFar, dCenter) * uMouseInfluence * (1.0 - uDisperse);
          pos.xy += normalize(-uMouse.xy + 0.0001) * shiftAmt;

          // 滑鼠真空（斥力）：圈內(uHoleRadius)清空、推到邊界；圈外在 uHoleSpread 範圍內
          // 遞減外推，把效果擴散到周圍、柔化邊界（不在邊界硬堆一圈）；散場後關閉
          vec3 fromMouse = pos - uMouse;
          float dm = length(fromMouse.xy) + 0.0001;
          float clear = max(uHoleRadius - dm, 0.0);
          float spread = smoothstep(uHoleRadius + uHoleSpread, uHoleRadius, dm) * uHoleSpread * 0.5;
          float push = (clear + spread) * uMouseInfluence * (1.0 - uDisperse);
          pos.xy += (fromMouse.xy / dm) * push;

          // 隨機換字閃爍：每 1/3 秒抽一次，少數粒子暫時換成別的字元
          float tick = floor(uTime * 3.0);
          float h = hash(aSeed * 127.1 + tick * 311.7);
          vGlyph = h > 0.92 ? mod(aGlyph + floor(h * 91.0), uGlyphCount) : aGlyph;

          float twinkle = 0.82 + 0.18 * sin(uTime * 2.2 + aSeed * 40.0);
          // 亮部稍透明、暗部不透明，再疊一層深淺：對比靠 alpha + 色深 + 大小 + 密度
          vAlpha = local * twinkle * mix(0.55, 1.0, aDark) * mix(1.0, 0.5, uDisperse);
          // 取色位置：tone=依明暗(暗→漸層左端) / random=每顆隨機；色調由漸層主導，vShade 僅輕微明暗+抖動
          vT = mix(1.0 - aDark, hash(aSeed * 53.7), uColorRandom);
          vShade = mix(1.1, 0.7, aDark) * (0.92 + 0.16 * hash(aSeed * 17.7));

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float breath = 1.0 + 0.12 * sin(uTime * 2.0 + aSeed * 9.0);
          float size = aSize * mix(1.0, 0.65, uDisperse);
          gl_PointSize = size * breath * local * uPixelRatio * (300.0 / -mv.z);
        }
      `,fragmentShader:`
        uniform sampler2D uAtlas;
        uniform vec2 uAtlasGrid;
        uniform sampler2D uColorRamp;
        varying float vAlpha;
        varying float vGlyph;
        varying float vShade;
        varying float vT;
        void main() {
          vec2 cell = vec2(mod(vGlyph, uAtlasGrid.x), floor(vGlyph / uAtlasGrid.x));
          vec2 uv = vec2(
            (cell.x + gl_PointCoord.x) / uAtlasGrid.x,
            1.0 - (cell.y + gl_PointCoord.y) / uAtlasGrid.y
          );
          float a = texture2D(uAtlas, uv).a * vAlpha;
          if (a < 0.02) discard;
          vec3 col = texture2D(uColorRamp, vec2(clamp(vT, 0.0, 1.0), 0.5)).rgb;
          gl_FragColor = vec4(col * vShade, a);
        }
      `});const le=new fC(D,L);f.add(le),ve(),o=(Ee=!0)=>{if(!L)return;const he=s.value?1:0;Bn.killTweensOf(L.uniforms.uDisperse),Ee?Bn.to(L.uniforms.uDisperse,{value:he,duration:e.disperseDuration,ease:"power2.inOut"}):L.uniforms.uDisperse.value=he},o(!1)};let ee=!1,F=!1;const ve=()=>{!ee||!L||F||(F=!0,Bn.to(L.uniforms.uProgress,{value:1,duration:e.revealDuration,ease:"power2.inOut"}))},Te=new IntersectionObserver(ke=>{ke.some(P=>P.isIntersecting)&&(ee=!0,ve(),Te.disconnect())},{threshold:.3});Te.observe(c);const $e=new Image;$e.src=e.src,$e.onload=()=>{H||G($e)};const Ge=new bC;let Oe=0,Y=0;const ce=new te;let ue=u,Ce=h;i.value&&(i.value.style.color=e.phraseColor);const Fe=()=>{const ke=Ge.getElapsedTime(),P=Math.min(ke-Y,.1);if(Y=ke,e.autoMouse){const $=ke*e.autoMouseSpeed;m.set(Math.sin($*.7)*B*.6+Math.sin($*.23+1.3)*B*.4,Math.cos($*.53)*U*.6+Math.cos($*.31+.7)*U*.4,0),g=1}const O=1-Math.exp(-e.mouseEase*P);y<.001&&g>0?_.copy(m):_.lerp(m,O),y+=(g-y)*O,L&&(L.uniforms.uTime.value=ke,L.uniforms.uMouse.value.copy(_),L.uniforms.uMouseInfluence.value=y);const q=i.value;if(q&&z>0){let $=-1;if(!s.value&&y>.4&&e.phrases.length){const N=(_.x+z)/(2*z),Z=(k-_.y)/(2*k);if(N>=0&&N<1&&Z>=0&&Z<1){const fe=Math.min(e.gridCols-1,Math.floor(N*e.gridCols)),se=Math.min(e.gridRows-1,Math.floor(Z*e.gridRows))*e.gridCols+fe;se<e.phrases.length&&e.phrases[se]&&($=se)}}if($!==r.value&&(r.value=$),$>=0){ce.copy(_).project(d);const N=(ce.x*.5+.5)*ue,Z=(-ce.y*.5+.5)*Ce,fe=N>ue*.6;q.style.transform=`translate(${N+(fe?-20:20)}px, ${Z}px) translateY(-50%)`+(fe?" translateX(-100%)":""),q.style.opacity=String(Math.min(1,y))}else q.style.opacity="0"}p.render(f,d),Oe=requestAnimationFrame(Fe)};Fe();const Le=()=>{const ke=c.clientWidth,P=c.clientHeight;ue=ke,Ce=P,d.aspect=ke/P,d.updateProjectionMatrix(),p.setSize(ke,P)};window.addEventListener("resize",Le),Bs(()=>{H=!0,Te.disconnect(),cancelAnimationFrame(Oe),window.removeEventListener("resize",Le),p.domElement.removeEventListener("pointermove",w),p.domElement.removeEventListener("pointerleave",S),p.dispose(),D?.dispose(),L?.dispose(),E.texture.dispose(),A.dispose(),c.removeChild(p.domElement)})}),(c,u)=>(wt(),cn("div",{ref_key:"wrapRef",ref:t,class:"stage"},[un("button",{class:"go",onClick:u[0]||(u[0]=h=>s.value=!s.value)},no(s.value?"集合":"分散"),1),un("div",{ref_key:"eggRef",ref:i,class:"egg","aria-hidden":"true"},[cv(c.$slots,"phrase",{index:pt(r),text:pt(r)>=0?n.phrases[pt(r)]:""},()=>[ua(no(pt(r)>=0?n.phrases[pt(r)]:""),1)])],512)],512))}}),SL=Object.assign(Ba(yL,[["__scopeId","data-v-5b911a9d"]]),{__name:"SymbolPortraitScene"}),ML=Tr({__name:"MetaballsReveal",props:{bgColor:{default:"#ffffff"},maxBalls:{default:64},life:{default:1.6},cellSize:{default:14},color:{default:"#9FD6FF"},centerCells:{default:17},peripheryDensity:{default:.5},cornerExp:{default:4},edgeFeather:{default:.5}},setup(n){const e=n,t=At(null),i=At(null);return jr(()=>{const r=t.value,s=i.value;if(!r||!s)return;const o=s.getContext("2d"),a=e.cellSize,l=e.maxBalls,c=e.color,u=[1,2,3,6],h=[];u.forEach((Y,ce)=>{for(let ue=0;ue<Y;ue++)h.push(ce)});const f=h.length,d=(Y,ce)=>{const ue=Math.sin(Y*12.9898+ce*78.233)*43758.5453;return ue-Math.floor(ue)},p=(Y,ce,ue)=>{const Ce=Math.min(Math.max((ue-Y)/(ce-Y),0),1);return Ce*Ce*(3-2*Ce)};let m=-9999,_=-9999,g=0;const y=e.centerCells*a;let v=0,x=0,b=0,T=0,w=[];const S=()=>{v=r.clientWidth,x=r.clientHeight;const Y=Math.min(window.devicePixelRatio,2);s.width=Math.max(v*Y,1),s.height=Math.max(x*Y,1),o.setTransform(Y,0,0,Y,0,0),b=Math.ceil(v/a),T=Math.ceil(x/a),w=new Array(b*T)};S();const E=Array.from({length:l},()=>({x:-9999,y:-9999,r0:0,born:-1/0}));let A=0;const D={x:-9999,y:-9999},L=26,H=()=>performance.now()/1e3,z=(Y,ce,ue,Ce)=>{const Fe=Math.min(v,x),Le=1+(Math.random()<.35?1:0);for(let ke=0;ke<Le;ke++){const P=E[A];A=(A+1)%l;const O=Fe*.05;P.x=Y+(Math.random()-.5)*O*2,P.y=ce+(Math.random()-.5)*O*2,P.r0=Fe*(ue+Math.random()*(Ce-ue)),P.born=H()}},k=(Y,ce)=>{const ue=Y-D.x,Ce=ce-D.y;ue*ue+Ce*Ce<L*L||(D.x=Y,D.y=ce,z(Y,ce,.05,.12))},B=1.2,U=.4;let G=-1/0,ee=-1/0;const F=Y=>{const ce=s.getBoundingClientRect();G=H(),m=Y.clientX-ce.left,_=Y.clientY-ce.top,k(m,_)};r.addEventListener("pointermove",F),r.addEventListener("pointerdown",F);let ve=0,Te=!1;const $e=()=>{if(!Te)return;const Y=H();if(Y-G>B){const $=Math.min(v,x);m=v*.5+(Math.sin(Y*.35)*.6+Math.sin(Y*.13+1.7)*.4)*$*.1,_=x*.5+(Math.cos(Y*.28)*.6+Math.sin(Y*.17+.7)*.4)*$*.1,Y-ee>U&&(ee=Y,z(m,_,.035,.075))}g+=(y-g)*.12;const ce=[];let ue=1/0,Ce=1/0,Fe=-1/0,Le=-1/0;for(let $=0;$<l;$++){const N=E[$],Z=Y-N.born,fe=Math.min(Z/.15,1),I=1-Math.min(Math.max((Z-.3)/(e.life-.3),0),1),se=N.r0*fe*I*I;se<=1||(ce.push({x:N.x,y:N.y,r:se}),ue=Math.min(ue,N.x-se*2.5),Fe=Math.max(Fe,N.x+se*2.5),Ce=Math.min(Ce,N.y-se*2.5),Le=Math.max(Le,N.y+se*2.5))}const ke=Math.max(Math.floor(ue/a),0),P=Math.min(Math.ceil(Fe/a),b),O=Math.max(Math.floor(Ce/a),0),q=Math.min(Math.ceil(Le/a),T);o.clearRect(0,0,v,x);for(let $=0;$<T;$++){const N=$>=O&&$<q;for(let Z=0;Z<b;Z++){const fe=$*b+Z;if(!N||Z<ke||Z>=P||ce.length===0){w[fe]!==void 0&&(w[fe]=void 0);continue}const I=(Z+.5)*a,se=($+.5)*a;let ne=0;for(const K of ce){const _e=I-K.x,R=se-K.y,M=K.r*K.r/(_e*_e+R*R+1)-.16;M>0&&(ne+=M)}let xe=w[fe];if(xe===void 0&&(xe=.6+Math.random(),w[fe]=xe),ne>=xe){const K=Math.abs(I-m),_e=Math.abs(se-_),R=Math.pow(K,e.cornerExp)+Math.pow(_e,e.cornerExp),M=Math.pow(R,1/e.cornerExp)/Math.max(g,1e-4),W=1-p(1-e.edgeFeather,1,M),J=W>0&&d(Z+31.4,$+17.2)<W;let oe=!1;J?oe=(h[(Z%f+f)%f]+$)%2===0:$%2===0&&(oe=d(Z,$)<e.peripheryDensity),oe&&(o.fillStyle=c,o.fillRect(Z*a,$*a,a,a))}}}ve=requestAnimationFrame($e)},Ge=new IntersectionObserver(([Y])=>{const ce=Y?.isIntersecting??!1;ce&&!Te?(Te=!0,$e()):!ce&&Te&&(Te=!1,cancelAnimationFrame(ve))});Ge.observe(r);const Oe=new ResizeObserver(S);Oe.observe(r),Bs(()=>{Te=!1,cancelAnimationFrame(ve),Ge.disconnect(),Oe.disconnect(),r.removeEventListener("pointermove",F),r.removeEventListener("pointerdown",F)})}),(r,s)=>(wt(),cn("section",{ref_key:"wrapRef",ref:t,class:"metaballs",style:jl({background:n.bgColor})},[un("canvas",{ref_key:"canvasRef",ref:i},null,512)],4))}}),bL=Object.assign(Ba(ML,[["__scopeId","data-v-68e3a55d"]]),{__name:"MetaballsReveal"}),EL=["src","alt"],TL=Tr({__name:"GlitchImage",props:{images:{},alt:{default:""},duration:{default:2},pieces:{default:24},bgColor:{default:void 0},bgRatio:{default:.35}},setup(n){const e=n,t=At(null),i=At(null),r=At(null),s=(u,h)=>u+Math.random()*(h-u),o=(u,h)=>Math.floor(s(u,h+1)),a=u=>u[Math.floor(Math.random()*u.length)],l=(u,h=32)=>{const f=document.createElement("canvas");f.width=h,f.height=h;const d=f.getContext("2d");d.drawImage(u,0,0,h,h);const p=d.getImageData(0,0,h,h).data;return(m,_)=>{const g=Math.min(h-1,Math.floor(m/100*h)),v=(Math.min(h-1,Math.floor(_/100*h))*h+g)*4;return`rgb(${p[v]}, ${p[v+1]}, ${p[v+2]})`}},c=u=>Array.from({length:u},()=>{const h=s(10,46),f=s(7,36);return{x:s(0,100-h),y:s(0,100-f),w:h,h:f}});return jr(()=>{const u=t.value,h=i.value,f=r.value;if(!u||!h||!f||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;Bn.set(h,{autoAlpha:0});let d=null;const p=async()=>{try{await h.decode()}catch{Bn.set(h,{autoAlpha:1});return}const _=e.duration,g=e.images.length>1?e.images.slice(1):e.images;let y;try{y=l(h)}catch{y=()=>"rgb(128, 128, 128)"}d=Bn.timeline({onComplete:()=>f.replaceChildren()});const v=.08,x=.42,b=.72,T=.9;for(const{x:w,y:S,w:E,h:A}of c(e.pieces)){const D=document.createElement("div");D.style.position="absolute",D.style.visibility="hidden",D.style.left=`${w}%`,D.style.top=`${S}%`,D.style.width=`${E}%`,D.style.height=`${A}%`,D.style.backgroundRepeat="no-repeat",D.style.backgroundSize=`${1e4/E}% ${1e4/A}%`,D.style.backgroundPosition=`${E>=100?0:w/(100-E)*100}% ${A>=100?0:S/(100-A)*100}%`,f.appendChild(D);const L=y(w+E/2,S+A/2),H=()=>e.bgColor&&Math.random()<e.bgRatio?e.bgColor:L,z=U=>d.set(D,{autoAlpha:0},U+s(.03,.09)*_),k=o(1,3);for(let U=0;U<k;U++){const G=s(v,x-.05)*_;Math.random()<.5?d.set(D,{autoAlpha:1,backgroundImage:`url(${a(g)})`,backgroundColor:"transparent",xPercent:s(-60,60),yPercent:s(-60,60),filter:Math.random()<.4?`brightness(${s(1.3,1.9).toFixed(2)})`:"none"},G):d.set(D,{autoAlpha:1,backgroundImage:"none",backgroundColor:H(),xPercent:0,yPercent:0,filter:"none"},G),z(G)}const B=o(1,3);for(let U=0;U<B;U++){const G=s(x,b-.03)*_;if(Math.random()<.45)d.set(D,{autoAlpha:1,backgroundImage:"none",backgroundColor:H(),xPercent:0,yPercent:0,filter:"none"},G);else{const ee=1-(G/_-x)/(b-x);d.set(D,{autoAlpha:1,backgroundImage:`url(${e.images[0]})`,backgroundColor:"transparent",xPercent:s(-25,25)*ee,yPercent:s(-25,25)*ee,filter:Math.random()<.3?`saturate(${s(1.4,2.2).toFixed(2)})`:"none"},G)}z(G)}d.set(D,{autoAlpha:1,backgroundImage:`url(${e.images[0]})`,backgroundColor:"transparent",xPercent:0,yPercent:0,filter:"none"},s(b,T)*_)}d.set(h,{autoAlpha:1},T*_),d.set(f,{autoAlpha:0},T*_+.02*_),d.set({},{},_)},m=new IntersectionObserver(([_])=>{_?.isIntersecting&&(m.disconnect(),p())},{threshold:.3});m.observe(u),Bs(()=>{m.disconnect(),d?.kill()})}),(u,h)=>(wt(),cn("div",{ref_key:"rootRef",ref:t,class:"glitch-image"},[un("img",{ref_key:"imgRef",ref:i,class:"glitch-image__img",src:n.images[0],alt:n.alt},null,8,EL),un("div",{ref_key:"overlayRef",ref:r,class:"glitch-image__overlay","aria-hidden":"true"},null,512)],512))}}),wL=Object.assign(Ba(TL,[["__scopeId","data-v-a364c531"]]),{__name:"GlitchImage"}),AL=""+new URL("einstein.DLD5Kbgp.png",import.meta.url).href,RS=""+new URL("glitch-01.BAf-_ovH.jpg",import.meta.url).href,CS=""+new URL("glitch-02.D4OjGplp.jpg",import.meta.url).href,PS=""+new URL("glitch-03.BDC7IEEU.jpg",import.meta.url).href,RL={class:"path-def",viewBox:"0 0 1000 1000","aria-hidden":"true"},CL=["src","alt"],PL="M 120,591 Q 240,538 270,506 Q 300,474 330,431 Q 360,388 390,345.5 Q 420,303 460,276.5 Q 500,250 540,276.5 Q 580,303 610,345.5 Q 640,388 670,431 Q 700,474 730,506 Q 760,538 820,564.5 L 880,591",DL=Tr({__name:"ShowcaseGallery",props:{images:{type:Array,default:()=>[AS,AL,RS,CS,PS]},count:{type:Number,default:12},pinDistance:{type:Number,default:2e3},minScale:{type:Number,default:.12},maxScale:{type:Number,default:1.1},cardWidthRatio:{type:Number,default:.22},widthRatio:{type:Number,default:.9},rotateXRange:{type:Number,default:180},scaleYMin:{type:Number,default:.6},scaleYMax:{type:Number,default:1.3}},setup(n){const e=n,t=At(null),i=At(null),r=At(null),s=At(null),o=At([]),a=lf(()=>Array.from({length:e.count},(l,c)=>({src:e.images[c%e.images.length],alt:`showcase ${c+1}`})));return jr(()=>{Bn.registerPlugin(rt);const l=t.value,c=i.value,u=r.value;if(!l||!c||!u)return;const h=u.getTotalLength();let f=1/0,d=-1/0,p=1/0,m=-1/0;for(let H=0;H<=1;H+=.02){const z=u.getPointAtLength(H*h);z.y<f&&(f=z.y),z.y>d&&(d=z.y),z.x<p&&(p=z.x),z.x>m&&(m=z.x)}const _=d-f||1,g=(m-p)/1e3||1;let y=0,v=0;const x=()=>{const H=l.clientWidth;y=Math.min(H,l.clientHeight)*.95,v=e.widthRatio*H/g,c.style.setProperty("--card-w",`${y*e.cardWidthRatio}px`)};x();const b={p:0},T=e.count,w=Math.PI/180,S=[],E=[];for(let H=0;H<T;H++){const z=(Math.random()*2-1)*e.rotateXRange*w;S[H]=Math.cos(z),E[H]=e.scaleYMin+Math.random()*(e.scaleYMax-e.scaleYMin)}const A=()=>{const H=o.value;for(let z=0;z<T;z++){const k=H[z];if(!k)continue;const B=(z/T+b.p)%1,U=u.getPointAtLength(B*h),G=S[z],ee=(U.x-500)/1e3,F=(U.y-500)/1e3*E[z]*G,ve=(d-U.y)/_,Te=e.minScale+(e.maxScale-e.minScale)*ve;k.style.left=`calc(50% + ${ee*v}px)`,k.style.top=`calc(50% + ${F*y}px)`,k.style.transform=`translate(-50%, -50%) scale(${Te})`,k.style.zIndex=String(Math.round(Te*100)),k.style.opacity=String(Math.min(1,ve*2.4))}s.value&&(s.value.textContent=`${Math.round(b.p*100)}%`)},D=Bn.timeline({scrollTrigger:{trigger:l,start:"top top",end:`+=${e.pinDistance}`,pin:!0,scrub:!0,anticipatePin:1,invalidateOnRefresh:!0}});D.to(b,{p:1,ease:"none",onUpdate:A}),A();const L=()=>{x(),A()};rt.addEventListener("refreshInit",L),Bs(()=>{rt.removeEventListener("refreshInit",L),D.scrollTrigger?.kill(),D.kill()})}),(l,c)=>(wt(),cn("section",{ref_key:"sectionRef",ref:t,class:"gallery"},[(wt(),cn("svg",RL,[un("path",{ref_key:"pathRef",ref:r,d:PL,fill:"none"},null,512)])),un("div",{ref_key:"stageRef",ref:i,class:"stage"},[(wt(!0),cn(ln,null,sf(pt(a),(u,h)=>(wt(),cn("img",{key:h,ref_for:!0,ref_key:"cardRefs",ref:o,class:"card",src:u.src,alt:u.alt,draggable:"false"},null,8,CL))),128))],512),un("div",{ref_key:"counterRef",ref:s,class:"counter"},"0%",512)],512))}}),LL=Object.assign(DL,{__name:"ShowcaseGallery"}),IL="專題標題 | 專題 | 聯合報",NL="專題的 SEO 描述文字，請替換為實際內容。",UL="用於社群（X / Facebook）分享的簡短描述，請替換為實際內容。",FL="聯合報,數位專題",OL="meta.jpg",fs={metaTitle:IL,metaDesc:NL,metaXDesc:UL,metaKeywords:FL,metaImage:OL},BL=[{title:"七十五年，與時代同行",titleHead:"七十五年，",titleTail:"與時代同行",body:"（佔位文案）從第一份報紙到數位浪潮，我們持續記錄這座島嶼的每一刻。"},{title:"在變動中尋找秩序",titleHead:"",titleTail:"",body:"（佔位文案）資訊的碎片在眼前閃現、聚合，最終收斂為清晰的觀點。"},{title:"邁向下一個篇章",titleHead:"",titleTail:"",body:"（佔位文案）橘色的能量蔓延成整片視野，承載我們對未來的想像。"}],kL={sections:BL},HL=sw(cw),zL={class:"main-content"},VL={class:"story-section__title"},GL={class:"story-section__body"},WL={class:"glitch-demo"},XL=Tr({__name:"app",setup(n){const e=Ea(),t=e.public.APP_MODE,i=e.public.APP_ASSETS_PATH,r=At(!1),s=["逼真 AI 詐騙究竟如何分辨？","AI 算力是否耗盡電力資源？","AI 可以協助翻轉人口老化外流嗎？","無法被 AI 取代的核心能力是什麼？","AI 讓老後生活更便利還是更孤單？","不學 AI 就會被時代淘汰嗎？"];return T1({title:fs.metaTitle,description:fs.metaDesc,"og:title":fs.metaTitle,"og:description":fs.metaXDesc,"og:image":`${i}/img/${fs.metaImage}`,"twitter:title":fs.metaTitle,"twitter:description":fs.metaXDesc,twitterCard:"summary_large_image",keywords:fs.metaKeywords,robots:t==="production"?"index, follow":"noindex, nofollow"}),(o,a)=>{const l=HL,c=hw,u=iR,h=SL,f=bL,d=wL,p=LL;return wt(),cn("div",null,[Nt(l),un("main",zL,[Nt(c,{duration:3}),Nt(u,null,{default:Dp(()=>[(wt(!0),cn(ln,null,sf(pt(kL).sections,(m,_)=>(wt(),cn("section",{key:_,class:"story-section"},[un("h2",VL,[m.titleHead?(wt(),cn(ln,{key:0},[ua(no(m.titleHead),1),a[1]||(a[1]=un("span",{class:"orange-core-anchor","aria-hidden":"true"},null,-1)),ua(no(m.titleTail),1)],64)):(wt(),cn(ln,{key:1},[ua(no(m.title),1)],64))]),un("p",GL,no(m.body),1)]))),128))]),_:1}),Nt(h,{dispersed:pt(r),"onUpdate:dispersed":a[0]||(a[0]=m=>en(r)?r.value=m:null),phrases:s,"hole-radius":25,"max-particles":16e3,color:["#ffffff","#d1f4ff","#77c6e0","#000000"],"bg-color":"#000","sample-step":4,"size-min":16,"size-max":20,"min-density":.01,"density-gamma":4.2,"dark-boost":1.2},null,8,["dispersed"]),Nt(f),un("section",WL,[Nt(d,{class:"glitch-demo__item",images:[pt(PS),pt(RS),pt(CS)],duration:1.2,pieces:12,"bg-color":"#ffffff",alt:"Glitch 收斂進場示意圖"},null,8,["images"])]),Nt(p)])])}}}),$L=Ba(XL,[["__scopeId","data-v-e744ec8f"]]),qL="modulepreload",YL=function(n,e){return new URL(n,e).href},y0={},S0=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let c=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");r=c(t.map(u=>{if(u=YL(u,i),u in y0)return;y0[u]=!0;const h=u.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(i)for(let p=o.length-1;p>=0;p--){const m=o[p];if(m.href===u&&(!h||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":qL,h||(d.as="script"),d.crossOrigin="",d.href=u,l&&d.setAttribute("nonce",l),document.head.appendChild(d),h)return new Promise((p,m)=>{d.addEventListener("load",p),d.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})},jL={__name:"nuxt-error-page",props:{error:Object},setup(n){const t=n.error,i=Number(t.statusCode||500),r=i===404,s=t.statusMessage??(r?"Page Not Found":"Internal Server Error"),o=t.message||t.toString(),a=void 0,u=r?Zm(()=>S0(()=>import("./1PcQ14Cs.js"),__vite__mapDeps([0,1]),import.meta.url)):Zm(()=>S0(()=>import("./sflnC1py.js"),__vite__mapDeps([2,3]),import.meta.url));return(h,f)=>(wt(),_s(pt(u),zS(Fv({status:pt(i),statusText:pt(s),statusCode:pt(i),statusMessage:pt(s),description:pt(o),stack:pt(a)})),null,16))}},KL={key:0},M0={__name:"nuxt-root",setup(n){const e=()=>null,t=wn(),i=t.deferHydration();if(t.isHydrating){const u=t.hooks.hookOnce("app:error",i),h=yo().beforeEach(()=>{u(),h()})}const r=!1;Q0(ax,Gp()),t.hooks.callHookWith(u=>u.map(h=>h()),"vue:setup",[]);const s=Wp(),o=!1,a=/bot\b|chrome-lighthouse|facebookexternalhit|google\b/i;function l(u,h,f){const d=t.vueApp.config.errorHandler;if(d&&!d.__nuxt_default)try{d(u,h,f)}catch(p){console.error("[nuxt] Error in `app.config.errorHandler`",p)}}sv((u,h,f)=>{if(t.hooks.callHook("vue:error",u,h,f)?.catch(d=>console.error("[nuxt] Error in `vue:error` hook",d)),a.test(navigator.userAgent))return t.hooks.callHook("app:error",u),console.error(`[nuxt] Not rendering error page for bot with user agent \`${navigator.userAgent}\`:`,u),!1;if(BT(u)&&(u.fatal||u.unhandled))return t.runWithContext(()=>FT(u)),l(u,h,f),!1});const c=!1;return(u,h)=>(wt(),_s(Sb,{onResolve:pt(i)},{default:Dp(()=>[pt(o)?(wt(),cn("div",KL)):pt(s)?(wt(),_s(pt(jL),{key:1,error:pt(s)},null,8,["error"])):pt(c)?(wt(),_s(pt(e),{key:2,context:pt(c)},null,8,["context"])):pt(r)?(wt(),_s(YM(pt(r)),{key:3})):(wt(),_s(pt($L),{key:4}))]),_:1},8,["onResolve"]))}};let b0;{let n;b0=async function(){if(n)return n;const t=!!(window.__NUXT__?.serverRendered??document.getElementById("__NUXT_DATA__")?.dataset.ssr==="true"),i=t?fE(M0):uE(M0),r=ST({vueApp:i});async function s(o){await r.callHook("app:error",o),r.payload.error||=Xp(o)}s.__nuxt_default=!0,i.config.errorHandler=s,r.hook("app:suspense:resolve",()=>{i.config.errorHandler===s&&(i.config.errorHandler=void 0)}),!t&&b_.id&&r.hook("app:suspense:resolve",()=>{document.getElementById(b_.id)?.remove()});try{await ET(r,J1)}catch(o){s(o)}try{await r.hooks.callHook("app:created",i),await r.hooks.callHook("app:beforeMount",i),i.mount(vT),await r.hooks.callHook("app:mounted",i),await _u()}catch(o){s(o)}return i},n=b0().catch(e=>{throw console.error("Error while mounting app:",e),e})}export{wn as A,yo as B,Ea as C,Dp as D,Yh as E,qv as F,Ba as _,lf as a,un as b,eI as c,cn as d,ua as e,Nt as f,Tr as g,UT as h,As as i,Oa as j,uf as k,JL as l,jr as m,IT as n,Bs as o,Zp as p,wt as q,kp as r,At as s,N_ as t,ZL as u,NT as v,Pl as w,no as x,pt as y,QL as z};
