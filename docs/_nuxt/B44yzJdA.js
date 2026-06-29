const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ChJevI1W.js","./error-404.CT6FyV69.css","./duKS_qA-.js","./error-500.f4rIJFkZ.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function yp(n){const e=Object.create(null);for(const t of n.split(","))e[t]=1;return t=>t in e}const Mt={},oa=[],gr=()=>{},T0=()=>!1,Kl=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&(n.charCodeAt(2)>122||n.charCodeAt(2)<97),ju=n=>n.startsWith("onUpdate:"),wn=Object.assign,Sp=(n,e)=>{const t=n.indexOf(e);t>-1&&n.splice(t,1)},LS=Object.prototype.hasOwnProperty,St=(n,e)=>LS.call(n,e),Ze=Array.isArray,aa=n=>Zl(n)==="[object Map]",w0=n=>Zl(n)==="[object Set]",Vm=n=>Zl(n)==="[object Date]",et=n=>typeof n=="function",kt=n=>typeof n=="string",Ci=n=>typeof n=="symbol",Tt=n=>n!==null&&typeof n=="object",Mp=n=>(Tt(n)||et(n))&&et(n.then)&&et(n.catch),A0=Object.prototype.toString,Zl=n=>A0.call(n),IS=n=>Zl(n).slice(8,-1),R0=n=>Zl(n)==="[object Object]",Ku=n=>kt(n)&&n!=="NaN"&&n[0]!=="-"&&""+parseInt(n,10)===n,oo=yp(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Zu=n=>{const e=Object.create(null);return(t=>e[t]||(e[t]=n(t)))},NS=/-\w/g,Gn=Zu(n=>n.replace(NS,e=>e.slice(1).toUpperCase())),US=/\B([A-Z])/g,ks=Zu(n=>n.replace(US,"-$1").toLowerCase()),Ju=Zu(n=>n.charAt(0).toUpperCase()+n.slice(1)),Sf=Zu(n=>n?`on${Ju(n)}`:""),kn=(n,e)=>!Object.is(n,e),Mf=(n,...e)=>{for(let t=0;t<n.length;t++)n[t](...e)},C0=(n,e,t,i=!1)=>{Object.defineProperty(n,e,{configurable:!0,enumerable:!1,writable:i,value:t})},FS=n=>{const e=parseFloat(n);return isNaN(e)?n:e},OS=n=>{const e=kt(n)?Number(n):NaN;return isNaN(e)?n:e};let Gm;const Qu=()=>Gm||(Gm=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function yo(n){if(Ze(n)){const e={};for(let t=0;t<n.length;t++){const i=n[t],r=kt(i)?zS(i):yo(i);if(r)for(const s in r)e[s]=r[s]}return e}else if(kt(n)||Tt(n))return n}const BS=/;(?![^(]*\))/g,kS=/:([^]+)/,HS=/\/\*[^]*?\*\//g;function zS(n){const e={};return n.replace(HS,"").split(BS).forEach(t=>{if(t){const i=t.split(kS);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function Jl(n){let e="";if(kt(n))e=n;else if(Ze(n))for(let t=0;t<n.length;t++){const i=Jl(n[t]);i&&(e+=i+" ")}else if(Tt(n))for(const t in n)n[t]&&(e+=t+" ");return e.trim()}function VS(n){if(!n)return null;let{class:e,style:t}=n;return e&&!kt(e)&&(n.class=Jl(e)),t&&(n.style=yo(t)),n}const GS="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",WS=yp(GS);function P0(n){return!!n||n===""}function XS(n,e){if(n.length!==e.length)return!1;let t=!0;for(let i=0;t&&i<n.length;i++)t=bp(n[i],e[i]);return t}function bp(n,e){if(n===e)return!0;let t=Vm(n),i=Vm(e);if(t||i)return t&&i?n.getTime()===e.getTime():!1;if(t=Ci(n),i=Ci(e),t||i)return n===e;if(t=Ze(n),i=Ze(e),t||i)return t&&i?XS(n,e):!1;if(t=Tt(n),i=Tt(e),t||i){if(!t||!i)return!1;const r=Object.keys(n).length,s=Object.keys(e).length;if(r!==s)return!1;for(const o in n){const a=n.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!bp(n[o],e[o]))return!1}}return String(n)===String(e)}const D0=n=>!!(n&&n.__v_isRef===!0),ys=n=>kt(n)?n:n==null?"":Ze(n)||Tt(n)&&(n.toString===A0||!et(n.toString))?D0(n)?ys(n.value):JSON.stringify(n,L0,2):String(n),L0=(n,e)=>D0(e)?L0(n,e.value):aa(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((t,[i,r],s)=>(t[bf(i,s)+" =>"]=r,t),{})}:w0(e)?{[`Set(${e.size})`]:[...e.values()].map(t=>bf(t))}:Ci(e)?bf(e):Tt(e)&&!Ze(e)&&!R0(e)?String(e):e,bf=(n,e="")=>{var t;return Ci(n)?`Symbol(${(t=n.description)!=null?t:e})`:n};let pn;class I0{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&pn&&(pn.active?(this.parent=pn,this.index=(pn.scopes||(pn.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){const t=pn;try{return pn=this,e()}finally{pn=t}}}on(){++this._on===1&&(this.prevScope=pn,pn=this)}off(){if(this._on>0&&--this._on===0){if(pn===this)pn=this.prevScope;else{let e=pn;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,i;for(t=0,i=this.effects.length;t<i;t++)this.effects[t].stop();for(this.effects.length=0,t=0,i=this.cleanups.length;t<i;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,i=this.scopes.length;t<i;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function $S(n){return new I0(n)}function Ep(){return pn}function qS(n,e=!1){pn&&pn.cleanups.push(n)}let Bt;const Ef=new WeakSet;class N0{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,pn&&(pn.active?pn.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ef.has(this)&&(Ef.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||F0(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Wm(this),O0(this);const e=Bt,t=Qi;Bt=this,Qi=!0;try{return this.fn()}finally{B0(this),Bt=e,Qi=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ap(e);this.deps=this.depsTail=void 0,Wm(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ef.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Lh(this)&&this.run()}get dirty(){return Lh(this)}}let U0=0,hl,dl;function F0(n,e=!1){if(n.flags|=8,e){n.next=dl,dl=n;return}n.next=hl,hl=n}function Tp(){U0++}function wp(){if(--U0>0)return;if(dl){let e=dl;for(dl=void 0;e;){const t=e.next;e.next=void 0,e.flags&=-9,e=t}}let n;for(;hl;){let e=hl;for(hl=void 0;e;){const t=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){n||(n=i)}e=t}}if(n)throw n}function O0(n){for(let e=n.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function B0(n){let e,t=n.depsTail,i=t;for(;i;){const r=i.prevDep;i.version===-1?(i===t&&(t=r),Ap(i),YS(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}n.deps=e,n.depsTail=t}function Lh(n){for(let e=n.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(k0(e.dep.computed)||e.dep.version!==e.version))return!0;return!!n._dirty}function k0(n){if(n.flags&4&&!(n.flags&16)||(n.flags&=-17,n.globalVersion===Pl)||(n.globalVersion=Pl,!n.isSSR&&n.flags&128&&(!n.deps&&!n._dirty||!Lh(n))))return;n.flags|=2;const e=n.dep,t=Bt,i=Qi;Bt=n,Qi=!0;try{O0(n);const r=n.fn(n._value);(e.version===0||kn(r,n._value))&&(n.flags|=128,n._value=r,e.version++)}catch(r){throw e.version++,r}finally{Bt=t,Qi=i,B0(n),n.flags&=-3}}function Ap(n,e=!1){const{dep:t,prevSub:i,nextSub:r}=n;if(i&&(i.nextSub=r,n.prevSub=void 0),r&&(r.prevSub=i,n.nextSub=void 0),t.subs===n&&(t.subs=i,!i&&t.computed)){t.computed.flags&=-5;for(let s=t.computed.deps;s;s=s.nextDep)Ap(s,!0)}!e&&!--t.sc&&t.map&&t.map.delete(t.key)}function YS(n){const{prevDep:e,nextDep:t}=n;e&&(e.nextDep=t,n.prevDep=void 0),t&&(t.prevDep=e,n.nextDep=void 0)}let Qi=!0;const H0=[];function Yr(){H0.push(Qi),Qi=!1}function jr(){const n=H0.pop();Qi=n===void 0?!0:n}function Wm(n){const{cleanup:e}=n;if(n.cleanup=void 0,e){const t=Bt;Bt=void 0;try{e()}finally{Bt=t}}}let Pl=0;class jS{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class ef{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Bt||!Qi||Bt===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Bt)t=this.activeLink=new jS(Bt,this),Bt.deps?(t.prevDep=Bt.depsTail,Bt.depsTail.nextDep=t,Bt.depsTail=t):Bt.deps=Bt.depsTail=t,z0(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const i=t.nextDep;i.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=i),t.prevDep=Bt.depsTail,t.nextDep=void 0,Bt.depsTail.nextDep=t,Bt.depsTail=t,Bt.deps===t&&(Bt.deps=i)}return t}trigger(e){this.version++,Pl++,this.notify(e)}notify(e){Tp();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{wp()}}}function z0(n){if(n.dep.sc++,n.sub.flags&4){const e=n.dep.computed;if(e&&!n.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)z0(i)}const t=n.dep.subs;t!==n&&(n.prevSub=t,t&&(t.nextSub=n)),n.dep.subs=n}}const gu=new WeakMap,ao=Symbol(""),Ih=Symbol(""),Dl=Symbol("");function Hn(n,e,t){if(Qi&&Bt){let i=gu.get(n);i||gu.set(n,i=new Map);let r=i.get(t);r||(i.set(t,r=new ef),r.map=i,r.key=t),r.track()}}function Or(n,e,t,i,r,s){const o=gu.get(n);if(!o){Pl++;return}const a=l=>{l&&l.trigger()};if(Tp(),e==="clear")o.forEach(a);else{const l=Ze(n),c=l&&Ku(t);if(l&&t==="length"){const u=Number(i);o.forEach((d,f)=>{(f==="length"||f===Dl||!Ci(f)&&f>=u)&&a(d)})}else switch((t!==void 0||o.has(void 0))&&a(o.get(t)),c&&a(o.get(Dl)),e){case"add":l?c&&a(o.get("length")):(a(o.get(ao)),aa(n)&&a(o.get(Ih)));break;case"delete":l||(a(o.get(ao)),aa(n)&&a(o.get(Ih)));break;case"set":aa(n)&&a(o.get(ao));break}}wp()}function KS(n,e){const t=gu.get(n);return t&&t.get(e)}function Io(n){const e=gt(n);return e===n?e:(Hn(e,"iterate",Dl),Ai(n)?e:e.map(er))}function tf(n){return Hn(n=gt(n),"iterate",Dl),n}function ur(n,e){return Sr(n)?Ma(Rs(n)?er(e):e):er(e)}const ZS={__proto__:null,[Symbol.iterator](){return Tf(this,Symbol.iterator,n=>ur(this,n))},concat(...n){return Io(this).concat(...n.map(e=>Ze(e)?Io(e):e))},entries(){return Tf(this,"entries",n=>(n[1]=ur(this,n[1]),n))},every(n,e){return Ar(this,"every",n,e,void 0,arguments)},filter(n,e){return Ar(this,"filter",n,e,t=>t.map(i=>ur(this,i)),arguments)},find(n,e){return Ar(this,"find",n,e,t=>ur(this,t),arguments)},findIndex(n,e){return Ar(this,"findIndex",n,e,void 0,arguments)},findLast(n,e){return Ar(this,"findLast",n,e,t=>ur(this,t),arguments)},findLastIndex(n,e){return Ar(this,"findLastIndex",n,e,void 0,arguments)},forEach(n,e){return Ar(this,"forEach",n,e,void 0,arguments)},includes(...n){return wf(this,"includes",n)},indexOf(...n){return wf(this,"indexOf",n)},join(n){return Io(this).join(n)},lastIndexOf(...n){return wf(this,"lastIndexOf",n)},map(n,e){return Ar(this,"map",n,e,void 0,arguments)},pop(){return Ga(this,"pop")},push(...n){return Ga(this,"push",n)},reduce(n,...e){return Xm(this,"reduce",n,e)},reduceRight(n,...e){return Xm(this,"reduceRight",n,e)},shift(){return Ga(this,"shift")},some(n,e){return Ar(this,"some",n,e,void 0,arguments)},splice(...n){return Ga(this,"splice",n)},toReversed(){return Io(this).toReversed()},toSorted(n){return Io(this).toSorted(n)},toSpliced(...n){return Io(this).toSpliced(...n)},unshift(...n){return Ga(this,"unshift",n)},values(){return Tf(this,"values",n=>ur(this,n))}};function Tf(n,e,t){const i=tf(n),r=i[e]();return i!==n&&!Ai(n)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=t(s.value)),s}),r}const JS=Array.prototype;function Ar(n,e,t,i,r,s){const o=tf(n),a=o!==n&&!Ai(n),l=o[e];if(l!==JS[e]){const d=l.apply(n,s);return a?er(d):d}let c=t;o!==n&&(a?c=function(d,f){return t.call(this,ur(n,d),f,n)}:t.length>2&&(c=function(d,f){return t.call(this,d,f,n)}));const u=l.call(o,c,i);return a&&r?r(u):u}function Xm(n,e,t,i){const r=tf(n),s=r!==n&&!Ai(n);let o=t,a=!1;r!==n&&(s?(a=i.length===0,o=function(c,u,d){return a&&(a=!1,c=ur(n,c)),t.call(this,c,ur(n,u),d,n)}):t.length>3&&(o=function(c,u,d){return t.call(this,c,u,d,n)}));const l=r[e](o,...i);return a?ur(n,l):l}function wf(n,e,t){const i=gt(n);Hn(i,"iterate",Dl);const r=i[e](...t);return(r===-1||r===!1)&&nf(t[0])?(t[0]=gt(t[0]),i[e](...t)):r}function Ga(n,e,t=[]){Yr(),Tp();const i=gt(n)[e].apply(n,t);return wp(),jr(),i}const QS=yp("__proto__,__v_isRef,__isVue"),V0=new Set(Object.getOwnPropertyNames(Symbol).filter(n=>n!=="arguments"&&n!=="caller").map(n=>Symbol[n]).filter(Ci));function eM(n){Ci(n)||(n=String(n));const e=gt(this);return Hn(e,"has",n),e.hasOwnProperty(n)}class G0{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,i){if(t==="__v_skip")return e.__v_skip;const r=this._isReadonly,s=this._isShallow;if(t==="__v_isReactive")return!r;if(t==="__v_isReadonly")return r;if(t==="__v_isShallow")return s;if(t==="__v_raw")return i===(r?s?uM:q0:s?$0:X0).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=Ze(e);if(!r){let l;if(o&&(l=ZS[t]))return l;if(t==="hasOwnProperty")return eM}const a=Reflect.get(e,t,rn(e)?e:i);if((Ci(t)?V0.has(t):QS(t))||(r||Hn(e,"get",t),s))return a;if(rn(a)){const l=o&&Ku(t)?a:a.value;return r&&Tt(l)?Uh(l):l}return Tt(a)?r?Uh(a):Is(a):a}}class W0 extends G0{constructor(e=!1){super(!1,e)}set(e,t,i,r){let s=e[t];const o=Ze(e)&&Ku(t);if(!this._isShallow){const c=Sr(s);if(!Ai(i)&&!Sr(i)&&(s=gt(s),i=gt(i)),!o&&rn(s)&&!rn(i))return c||(s.value=i),!0}const a=o?Number(t)<e.length:St(e,t),l=Reflect.set(e,t,i,rn(e)?e:r);return e===gt(r)&&(a?kn(i,s)&&Or(e,"set",t,i):Or(e,"add",t,i)),l}deleteProperty(e,t){const i=St(e,t);e[t];const r=Reflect.deleteProperty(e,t);return r&&i&&Or(e,"delete",t,void 0),r}has(e,t){const i=Reflect.has(e,t);return(!Ci(t)||!V0.has(t))&&Hn(e,"has",t),i}ownKeys(e){return Hn(e,"iterate",Ze(e)?"length":ao),Reflect.ownKeys(e)}}class tM extends G0{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}}const nM=new W0,iM=new tM,rM=new W0(!0);const Nh=n=>n,lc=n=>Reflect.getPrototypeOf(n);function sM(n,e,t){return function(...i){const r=this.__v_raw,s=gt(r),o=aa(s),a=n==="entries"||n===Symbol.iterator&&o,l=n==="keys"&&o,c=r[n](...i),u=t?Nh:e?Ma:er;return!e&&Hn(s,"iterate",l?Ih:ao),wn(Object.create(c),{next(){const{value:d,done:f}=c.next();return f?{value:d,done:f}:{value:a?[u(d[0]),u(d[1])]:u(d),done:f}}})}}function cc(n){return function(...e){return n==="delete"?!1:n==="clear"?void 0:this}}function oM(n,e){const t={get(r){const s=this.__v_raw,o=gt(s),a=gt(r);n||(kn(r,a)&&Hn(o,"get",r),Hn(o,"get",a));const{has:l}=lc(o),c=e?Nh:n?Ma:er;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!n&&Hn(gt(r),"iterate",ao),r.size},has(r){const s=this.__v_raw,o=gt(s),a=gt(r);return n||(kn(r,a)&&Hn(o,"has",r),Hn(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=gt(a),c=e?Nh:n?Ma:er;return!n&&Hn(l,"iterate",ao),a.forEach((u,d)=>r.call(s,c(u),c(d),o))}};return wn(t,n?{add:cc("add"),set:cc("set"),delete:cc("delete"),clear:cc("clear")}:{add(r){const s=gt(this),o=lc(s),a=gt(r),l=!e&&!Ai(r)&&!Sr(r)?a:r;return o.has.call(s,l)||kn(r,l)&&o.has.call(s,r)||kn(a,l)&&o.has.call(s,a)||(s.add(l),Or(s,"add",l,l)),this},set(r,s){!e&&!Ai(s)&&!Sr(s)&&(s=gt(s));const o=gt(this),{has:a,get:l}=lc(o);let c=a.call(o,r);c||(r=gt(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?kn(s,u)&&Or(o,"set",r,s):Or(o,"add",r,s),this},delete(r){const s=gt(this),{has:o,get:a}=lc(s);let l=o.call(s,r);l||(r=gt(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&Or(s,"delete",r,void 0),c},clear(){const r=gt(this),s=r.size!==0,o=r.clear();return s&&Or(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{t[r]=sM(r,n,e)}),t}function Rp(n,e){const t=oM(n,e);return(i,r,s)=>r==="__v_isReactive"?!n:r==="__v_isReadonly"?n:r==="__v_raw"?i:Reflect.get(St(t,r)&&r in i?t:i,r,s)}const aM={get:Rp(!1,!1)},lM={get:Rp(!1,!0)},cM={get:Rp(!0,!1)};const X0=new WeakMap,$0=new WeakMap,q0=new WeakMap,uM=new WeakMap;function fM(n){switch(n){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function hM(n){return n.__v_skip||!Object.isExtensible(n)?0:fM(IS(n))}function Is(n){return Sr(n)?n:Cp(n,!1,nM,aM,X0)}function eo(n){return Cp(n,!1,rM,lM,$0)}function Uh(n){return Cp(n,!0,iM,cM,q0)}function Cp(n,e,t,i,r){if(!Tt(n)||n.__v_raw&&!(e&&n.__v_isReactive))return n;const s=hM(n);if(s===0)return n;const o=r.get(n);if(o)return o;const a=new Proxy(n,s===2?i:t);return r.set(n,a),a}function Rs(n){return Sr(n)?Rs(n.__v_raw):!!(n&&n.__v_isReactive)}function Sr(n){return!!(n&&n.__v_isReadonly)}function Ai(n){return!!(n&&n.__v_isShallow)}function nf(n){return n?!!n.__v_raw:!1}function gt(n){const e=n&&n.__v_raw;return e?gt(e):n}function dM(n){return!St(n,"__v_skip")&&Object.isExtensible(n)&&C0(n,"__v_skip",!0),n}const er=n=>Tt(n)?Is(n):n,Ma=n=>Tt(n)?Uh(n):n;function rn(n){return n?n.__v_isRef===!0:!1}function vt(n){return Y0(n,!1)}function Ll(n){return Y0(n,!0)}function Y0(n,e){return rn(n)?n:new pM(n,e)}class pM{constructor(e,t){this.dep=new ef,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:gt(e),this._value=t?e:er(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){const t=this._rawValue,i=this.__v_isShallow||Ai(e)||Sr(e);e=i?e:gt(e),kn(e,t)&&(this._rawValue=e,this._value=i?e:er(e),this.dep.trigger())}}function ut(n){return rn(n)?n.value:n}function mM(n){return et(n)?n():ut(n)}const _M={get:(n,e,t)=>e==="__v_raw"?n:ut(Reflect.get(n,e,t)),set:(n,e,t,i)=>{const r=n[e];return rn(r)&&!rn(t)?(r.value=t,!0):Reflect.set(n,e,t,i)}};function j0(n){return Rs(n)?n:new Proxy(n,_M)}class gM{constructor(e){this.__v_isRef=!0,this._value=void 0;const t=this.dep=new ef,{get:i,set:r}=e(t.track.bind(t),t.trigger.bind(t));this._get=i,this._set=r}get value(){return this._value=this._get()}set value(e){this._set(e)}}function vM(n){return new gM(n)}class xM{constructor(e,t,i){this._object=e,this._defaultValue=i,this.__v_isRef=!0,this._value=void 0,this._key=Ci(t)?t:String(t),this._raw=gt(e);let r=!0,s=e;if(!Ze(e)||Ci(this._key)||!Ku(this._key))do r=!nf(s)||Ai(s);while(r&&(s=s.__v_raw));this._shallow=r}get value(){let e=this._object[this._key];return this._shallow&&(e=ut(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&rn(this._raw[this._key])){const t=this._object[this._key];if(rn(t)){t.value=e;return}}this._object[this._key]=e}get dep(){return KS(this._raw,this._key)}}class yM{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function SM(n,e,t){return rn(n)?n:et(n)?new yM(n):Tt(n)&&arguments.length>1?MM(n,e,t):vt(n)}function MM(n,e,t){return new xM(n,e,t)}class bM{constructor(e,t,i){this.fn=e,this.setter=t,this._value=void 0,this.dep=new ef(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Pl-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&Bt!==this)return F0(this,!0),!0}get value(){const e=this.dep.track();return k0(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function EM(n,e,t=!1){let i,r;return et(n)?i=n:(i=n.get,r=n.set),new bM(i,r,t)}const uc={},vu=new WeakMap;let Ks;function TM(n,e=!1,t=Ks){if(t){let i=vu.get(t);i||vu.set(t,i=[]),i.push(n)}}function wM(n,e,t=Mt){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=t,c=v=>r?v:Ai(v)||r===!1||r===0?gs(v,1):gs(v);let u,d,f,h,p=!1,m=!1;if(rn(n)?(d=()=>n.value,p=Ai(n)):Rs(n)?(d=()=>c(n),p=!0):Ze(n)?(m=!0,p=n.some(v=>Rs(v)||Ai(v)),d=()=>n.map(v=>{if(rn(v))return v.value;if(Rs(v))return c(v);if(et(v))return l?l(v,2):v()})):et(n)?e?d=l?()=>l(n,2):n:d=()=>{if(f){Yr();try{f()}finally{jr()}}const v=Ks;Ks=u;try{return l?l(n,3,[h]):n(h)}finally{Ks=v}}:d=gr,e&&r){const v=d,b=r===!0?1/0:r;d=()=>gs(v(),b)}const _=Ep(),g=()=>{u.stop(),_&&_.active&&Sp(_.effects,u)};if(s&&e){const v=e;e=(...b)=>{v(...b),g()}}let y=m?new Array(n.length).fill(uc):uc;const x=v=>{if(!(!(u.flags&1)||!u.dirty&&!v))if(e){const b=u.run();if(r||p||(m?b.some((T,A)=>kn(T,y[A])):kn(b,y))){f&&f();const T=Ks;Ks=u;try{const A=[b,y===uc?void 0:m&&y[0]===uc?[]:y,h];y=b,l?l(e,3,A):e(...A)}finally{Ks=T}}}else u.run()};return a&&a(x),u=new N0(d),u.scheduler=o?()=>o(x,!1):x,h=v=>TM(v,!1,u),f=u.onStop=()=>{const v=vu.get(u);if(v){if(l)l(v,4);else for(const b of v)b();vu.delete(u)}},e?i?x(!0):y=u.run():o?o(x.bind(null,!0),!0):u.run(),g.pause=u.pause.bind(u),g.resume=u.resume.bind(u),g.stop=g,g}function gs(n,e=1/0,t){if(e<=0||!Tt(n)||n.__v_skip||(t=t||new Map,(t.get(n)||0)>=e))return n;if(t.set(n,e),e--,rn(n))gs(n.value,e,t);else if(Ze(n))for(let i=0;i<n.length;i++)gs(n[i],e,t);else if(w0(n)||aa(n))n.forEach(i=>{gs(i,e,t)});else if(R0(n)){for(const i in n)gs(n[i],e,t);for(const i of Object.getOwnPropertySymbols(n))Object.prototype.propertyIsEnumerable.call(n,i)&&gs(n[i],e,t)}return n}function Ql(n,e,t,i){try{return i?n(...i):n()}catch(r){Oa(r,e,t)}}function Mr(n,e,t,i){if(et(n)){const r=Ql(n,e,t,i);return r&&Mp(r)&&r.catch(s=>{Oa(s,e,t)}),r}if(Ze(n)){const r=[];for(let s=0;s<n.length;s++)r.push(Mr(n[s],e,t,i));return r}}function Oa(n,e,t,i=!0){const r=e?e.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||Mt;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${t}`;for(;a;){const u=a.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](n,l,c)===!1)return}a=a.parent}if(s){Yr(),Ql(s,null,10,[n,l,c]),jr();return}}AM(n,t,r,i,o)}function AM(n,e,t,i=!0,r=!1){if(r)throw n;console.error(n)}const ei=[];let or=-1;const la=[];let ms=null,Qo=0;const K0=Promise.resolve();let xu=null;function Il(n){const e=xu||K0;return n?e.then(this?n.bind(this):n):e}function RM(n){let e=or+1,t=ei.length;for(;e<t;){const i=e+t>>>1,r=ei[i],s=Nl(r);s<n||s===n&&r.flags&2?e=i+1:t=i}return e}function Pp(n){if(!(n.flags&1)){const e=Nl(n),t=ei[ei.length-1];!t||!(n.flags&2)&&e>=Nl(t)?ei.push(n):ei.splice(RM(e),0,n),n.flags|=1,Z0()}}function Z0(){xu||(xu=K0.then(J0))}function Fh(n){Ze(n)?la.push(...n):ms&&n.id===-1?ms.splice(Qo+1,0,n):n.flags&1||(la.push(n),n.flags|=1),Z0()}function $m(n,e,t=or+1){for(;t<ei.length;t++){const i=ei[t];if(i&&i.flags&2){if(n&&i.id!==n.uid)continue;ei.splice(t,1),t--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function yu(n){if(la.length){const e=[...new Set(la)].sort((t,i)=>Nl(t)-Nl(i));if(la.length=0,ms){ms.push(...e);return}for(ms=e,Qo=0;Qo<ms.length;Qo++){const t=ms[Qo];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}ms=null,Qo=0}}const Nl=n=>n.id==null?n.flags&2?-1:1/0:n.id;function J0(n){try{for(or=0;or<ei.length;or++){const e=ei[or];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Ql(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;or<ei.length;or++){const e=ei[or];e&&(e.flags&=-2)}or=-1,ei.length=0,yu(),xu=null,(ei.length||la.length)&&J0()}}let ni=null,Q0=null;function Su(n){const e=ni;return ni=n,Q0=n&&n.type.__scopeId||null,e}function Dp(n,e=ni,t){if(!e||n._n)return n;const i=(...r)=>{i._d&&Tu(-1);const s=Su(e);let o;try{o=n(...r)}finally{Su(s),i._d&&Tu(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function ar(n,e,t,i){const r=n.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(Yr(),Mr(l,t,8,[n.el,a,n,e]),jr())}}function ev(n,e){if(Cn){let t=Cn.provides;const i=Cn.parent&&Cn.parent.provides;i===t&&(t=Cn.provides=Object.create(i)),t[n]=e}}function lo(n,e,t=!1){const i=Ba();if(i||uo){let r=uo?uo._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&n in r)return r[n];if(arguments.length>1)return t&&et(e)?e.call(i&&i.proxy):e}}function rf(){return!!(Ba()||uo)}const CM=Symbol.for("v-scx"),PM=()=>lo(CM);function DM(n,e){return sf(n,null,e)}function LM(n,e){return sf(n,null,{flush:"sync"})}function ca(n,e,t){return sf(n,e,t)}function sf(n,e,t=Mt){const{immediate:i,deep:r,flush:s,once:o}=t,a=wn({},t),l=e&&i||!e&&s!=="post";let c;if(Ta){if(s==="sync"){const h=PM();c=h.__watcherHandles||(h.__watcherHandles=[])}else if(!l){const h=()=>{};return h.stop=gr,h.resume=gr,h.pause=gr,h}}const u=Cn;a.call=(h,p,m)=>Mr(h,u,p,m);let d=!1;s==="post"?a.scheduler=h=>{Kn(h,u&&u.suspense)}:s!=="sync"&&(d=!0,a.scheduler=(h,p)=>{p?h():Pp(h)}),a.augmentJob=h=>{e&&(h.flags|=4),d&&(h.flags|=2,u&&(h.id=u.uid,h.i=u))};const f=wM(n,e,a);return Ta&&(c?c.push(f):l&&f()),f}function IM(n,e,t){const i=this.proxy,r=kt(n)?n.includes(".")?tv(i,n):()=>i[n]:n.bind(i,i);let s;et(e)?s=e:(s=e.handler,t=e);const o=tc(this),a=sf(r,s.bind(i),t);return o(),a}function tv(n,e){const t=e.split(".");return()=>{let i=n;for(let r=0;r<t.length&&i;r++)i=i[t[r]];return i}}const NM=Symbol("_vte"),UM=n=>n.__isTeleport,FM=Symbol("_leaveCb");function Lp(n,e){n.shapeFlag&6&&n.component?(n.transition=e,Lp(n.component.subTree,e)):n.shapeFlag&128?(n.ssContent.transition=e.clone(n.ssContent),n.ssFallback.transition=e.clone(n.ssFallback)):n.transition=e}function Tr(n,e){return et(n)?wn({name:n.name},e,{setup:n}):n}function Ip(n){n.ids=[n.ids[0]+n.ids[2]+++"-",0,0]}function qm(n,e){let t;return!!((t=Object.getOwnPropertyDescriptor(n,e))&&!t.configurable)}const Mu=new WeakMap;function ua(n,e,t,i,r=!1){if(Ze(n)){n.forEach((m,_)=>ua(m,e&&(Ze(e)?e[_]:e),t,i,r));return}if(co(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&ua(n,e,t,i.component.subTree);return}const s=i.shapeFlag&4?Bp(i.component):i.el,o=r?null:s,{i:a,r:l}=n,c=e&&e.r,u=a.refs===Mt?a.refs={}:a.refs,d=a.setupState,f=gt(d),h=d===Mt?T0:m=>qm(u,m)?!1:St(f,m),p=(m,_)=>!(_&&qm(u,_));if(c!=null&&c!==l){if(Ym(e),kt(c))u[c]=null,h(c)&&(d[c]=null);else if(rn(c)){const m=e;p(c,m.k)&&(c.value=null),m.k&&(u[m.k]=null)}}if(et(l))Ql(l,a,12,[o,u]);else{const m=kt(l),_=rn(l);if(m||_){const g=()=>{if(n.f){const y=m?h(l)?d[l]:u[l]:p()||!n.k?l.value:u[n.k];if(r)Ze(y)&&Sp(y,s);else if(Ze(y))y.includes(s)||y.push(s);else if(m)u[l]=[s],h(l)&&(d[l]=u[l]);else{const x=[s];p(l,n.k)&&(l.value=x),n.k&&(u[n.k]=x)}}else m?(u[l]=o,h(l)&&(d[l]=o)):_&&(p(l,n.k)&&(l.value=o),n.k&&(u[n.k]=o))};if(o){const y=()=>{g(),Mu.delete(n)};y.id=-1,Mu.set(n,y),Kn(y,t)}else Ym(n),g()}}}function Ym(n){const e=Mu.get(n);e&&(e.flags|=8,Mu.delete(n))}let jm=!1;const No=()=>{jm||(console.error("Hydration completed but contains mismatches."),jm=!0)},OM=n=>n.namespaceURI.includes("svg")&&n.tagName!=="foreignObject",BM=n=>n.namespaceURI.includes("MathML"),fc=n=>{if(n.nodeType===1){if(OM(n))return"svg";if(BM(n))return"mathml"}},na=n=>n.nodeType===8;function kM(n){const{mt:e,p:t,o:{patchProp:i,createText:r,nextSibling:s,parentNode:o,remove:a,insert:l,createComment:c}}=n,u=(x,v)=>{if(!v.hasChildNodes()){t(null,x,v),yu(),v._vnode=x;return}d(v.firstChild,x,null,null,null),yu(),v._vnode=x},d=(x,v,b,T,A,S=!1)=>{S=S||!!v.dynamicChildren;const E=na(x)&&x.data==="[",R=()=>m(x,v,b,T,A,E),{type:D,ref:N,shapeFlag:V,patchFlag:z}=v;let O=x.nodeType;v.el=x,z===-2&&(S=!1,v.dynamicChildren=null);let F=null;switch(D){case fo:O!==3?v.children===""?(l(v.el=r(""),o(x),x),F=x):F=R():(x.data!==v.children&&(No(),x.data=v.children),F=s(x));break;case Xi:y(x)?(F=s(x),g(v.el=x.content.firstChild,x,b)):O!==8||E?F=R():F=s(x);break;case ml:if(E&&(x=s(x),O=x.nodeType),O===1||O===3){F=x;const k=!v.children.length;for(let H=0;H<v.staticCount;H++)k&&(v.children+=F.nodeType===1?F.outerHTML:F.data),H===v.staticCount-1&&(v.anchor=F),F=s(F);return E?s(F):F}else R();break;case Qt:E?F=p(x,v,b,T,A,S):F=R();break;default:if(V&1)(O!==1||v.type.toLowerCase()!==x.tagName.toLowerCase())&&!y(x)?F=R():F=f(x,v,b,T,A,S);else if(V&6){v.slotScopeIds=A;const k=o(x);if(E?F=_(x):na(x)&&x.data==="teleport start"?F=_(x,x.data,"teleport end"):F=s(x),e(v,k,null,b,T,fc(k),S),co(v)&&!v.type.__asyncResolved){let H;E?(H=Ct(Qt),H.anchor=F?F.previousSibling:k.lastChild):H=x.nodeType===3?ha(""):Ct("div"),H.el=x,v.component.subTree=H}}else V&64?O!==8?F=R():F=v.type.hydrate(x,v,b,T,A,S,n,h):V&128&&(F=v.type.hydrate(x,v,b,T,fc(o(x)),A,S,n,d))}return N!=null&&ua(N,null,T,v),F},f=(x,v,b,T,A,S)=>{S=S||!!v.dynamicChildren;const{type:E,props:R,patchFlag:D,shapeFlag:N,dirs:V,transition:z}=v,O=E==="input"||E==="option";if(O||D!==-1){V&&ar(v,null,b,"created");let F=!1;if(y(x)){F=Av(null,z)&&b&&b.vnode.props&&b.vnode.props.appear;const H=x.content.firstChild;if(F){const X=H.getAttribute("class");X&&(H.$cls=X),z.beforeEnter(H)}g(H,x,b),v.el=x=H}if(N&16&&!(R&&(R.innerHTML||R.textContent))){let H=h(x.firstChild,v,x,b,T,A,S);for(;H;){hc(x,1)||No();const X=H;H=H.nextSibling,a(X)}}else if(N&8){let H=v.children;H[0]===`
`&&(x.tagName==="PRE"||x.tagName==="TEXTAREA")&&(H=H.slice(1));const{textContent:X}=x;X!==H&&X!==H.replace(/\r\n|\r/g,`
`)&&(hc(x,0)||No(),x.textContent=v.children)}if(R){if(O||!S||D&48){const H=x.tagName.includes("-");for(const X in R)(O&&(X.endsWith("value")||X==="indeterminate")||Kl(X)&&!oo(X)||X[0]==="."||H&&!oo(X))&&i(x,X,null,R[X],void 0,b)}else if(R.onClick)i(x,"onClick",null,R.onClick,void 0,b);else if(D&4&&Rs(R.style))for(const H in R.style)R.style[H]}let k;(k=R&&R.onVnodeBeforeMount)&&Ui(k,b,v),V&&ar(v,null,b,"beforeMount"),((k=R&&R.onVnodeMounted)||V||F)&&Iv(()=>{k&&Ui(k,b,v),F&&z.enter(x),V&&ar(v,null,b,"mounted")},T)}return x.nextSibling},h=(x,v,b,T,A,S,E)=>{E=E||!!v.dynamicChildren;const R=v.children,D=R.length;for(let N=0;N<D;N++){const V=E?R[N]:R[N]=Si(R[N]),z=V.type===fo;x?(z&&!E&&N+1<D&&Si(R[N+1]).type===fo&&(l(r(x.data.slice(V.children.length)),b,s(x)),x.data=V.children),x=d(x,V,T,A,S,E)):z&&!V.children?l(V.el=r(""),b):(hc(b,1)||No(),t(null,V,b,null,T,A,fc(b),S))}return x},p=(x,v,b,T,A,S)=>{const{slotScopeIds:E}=v;E&&(A=A?A.concat(E):E);const R=o(x),D=h(s(x),v,R,b,T,A,S);return D&&na(D)&&D.data==="]"?s(v.anchor=D):(No(),l(v.anchor=c("]"),R,D),D)},m=(x,v,b,T,A,S)=>{if(hc(x.parentElement,1)||No(),v.el=null,S){const D=_(x);for(;;){const N=s(x);if(N&&N!==D)a(N);else break}}const E=s(x),R=o(x);return a(x),t(null,v,R,E,b,T,fc(R),A),b&&(b.vnode.el=v.el,lf(b,v.el)),E},_=(x,v="[",b="]")=>{let T=0;for(;x;)if(x=s(x),x&&na(x)&&(x.data===v&&T++,x.data===b)){if(T===0)return s(x);T--}return x},g=(x,v,b)=>{const T=v.parentNode;T&&T.replaceChild(x,v);let A=b;for(;A;)A.vnode.el===v&&(A.vnode.el=A.subTree.el=x),A=A.parent},y=x=>x.nodeType===1&&x.tagName==="TEMPLATE";return[u,d]}const Km="data-allow-mismatch",HM={0:"text",1:"children",2:"class",3:"style",4:"attribute"};function hc(n,e){if(e===0||e===1)for(;n&&!n.hasAttribute(Km);)n=n.parentElement;const t=n&&n.getAttribute(Km);if(t==null)return!1;if(t==="")return!0;{const i=t.split(",");return e===0&&i.includes("children")?!0:i.includes(HM[e])}}Qu().requestIdleCallback;Qu().cancelIdleCallback;function zM(n,e){if(na(n)&&n.data==="["){let t=1,i=n.nextSibling;for(;i;){if(i.nodeType===1){if(e(i)===!1)break}else if(na(i))if(i.data==="]"){if(--t===0)break}else i.data==="["&&t++;i=i.nextSibling}}else e(n)}const co=n=>!!n.type.__asyncLoader;function Zm(n){et(n)&&(n={loader:n});const{loader:e,loadingComponent:t,errorComponent:i,delay:r=200,hydrate:s,timeout:o,suspensible:a=!0,onError:l}=n;let c=null,u,d=0;const f=()=>(d++,c=null,h()),h=()=>{let p;return c||(p=c=e().catch(m=>{if(m=m instanceof Error?m:new Error(String(m)),l)return new Promise((_,g)=>{l(m,()=>_(f()),()=>g(m),d+1)});throw m}).then(m=>p!==c&&c?c:(m&&(m.__esModule||m[Symbol.toStringTag]==="Module")&&(m=m.default),u=m,m)))};return Tr({name:"AsyncComponentWrapper",__asyncLoader:h,__asyncHydrate(p,m,_){let g=!1;(m.bu||(m.bu=[])).push(()=>g=!0);const y=()=>{g||_()},x=s?()=>{const v=s(y,b=>zM(p,b));v&&(m.bum||(m.bum=[])).push(v)}:y;u?x():h().then(()=>!m.isUnmounted&&x())},get __asyncResolved(){return u},setup(){const p=Cn;if(Ip(p),u)return()=>dc(u,p);const m=x=>{c=null,Oa(x,p,13,!i)};if(a&&p.suspense||Ta)return h().then(x=>()=>dc(x,p)).catch(x=>(m(x),()=>i?Ct(i,{error:x}):null));const _=vt(!1),g=vt(),y=vt(!!r);return r&&setTimeout(()=>{y.value=!1},r),o!=null&&setTimeout(()=>{if(!_.value&&!g.value){const x=new Error(`Async component timed out after ${o}ms.`);m(x),g.value=x}},o),h().then(()=>{_.value=!0,p.parent&&Np(p.parent.vnode)&&p.parent.update()}).catch(x=>{m(x),g.value=x}),()=>{if(_.value&&u)return dc(u,p);if(g.value&&i)return Ct(i,{error:g.value});if(t&&!y.value)return dc(t,p)}}})}function dc(n,e){const{ref:t,props:i,children:r,ce:s}=e.vnode,o=Ct(n,i,r);return o.ref=t,o.ce=s,delete e.vnode.ce,o}const Np=n=>n.type.__isKeepAlive;function nv(n,e){rv(n,"a",e)}function iv(n,e){rv(n,"da",e)}function rv(n,e,t=Cn){const i=n.__wdc||(n.__wdc=()=>{let r=t;for(;r;){if(r.isDeactivated)return;r=r.parent}return n()});if(of(e,i,t),t){let r=t.parent;for(;r&&r.parent;)Np(r.parent.vnode)&&VM(i,e,t,r),r=r.parent}}function VM(n,e,t,i){const r=of(e,n,i,!0);sv(()=>{Sp(i[e],r)},t)}function of(n,e,t=Cn,i=!1){if(t){const r=t[n]||(t[n]=[]),s=e.__weh||(e.__weh=(...o)=>{Yr();const a=tc(t),l=Mr(e,t,n,o);return a(),jr(),l});return i?r.unshift(s):r.push(s),s}}const is=n=>(e,t=Cn)=>{(!Ta||n==="sp")&&of(n,(...i)=>e(...i),t)},GM=is("bm"),Kr=is("m"),WM=is("bu"),XM=is("u"),Zr=is("bum"),sv=is("um"),$M=is("sp"),qM=is("rtg"),YM=is("rtc");function ov(n,e=Cn){of("ec",n,e)}const av="components";function tI(n,e){return cv(av,n,!0,e)||n}const lv=Symbol.for("v-ndc");function jM(n){return kt(n)?cv(av,n,!1)||n:n||lv}function cv(n,e,t=!0,i=!1){const r=ni||Cn;if(r){const s=r.type;{const a=kb(s,!1);if(a&&(a===e||a===Gn(e)||a===Ju(Gn(e))))return s}const o=Jm(r[n]||s[n],e)||Jm(r.appContext[n],e);return!o&&i?s:o}}function Jm(n,e){return n&&(n[e]||n[Gn(e)]||n[Ju(Gn(e))])}function ec(n,e,t,i){let r;const s=t,o=Ze(n);if(o||kt(n)){const a=o&&Rs(n);let l=!1,c=!1;a&&(l=!Ai(n),c=Sr(n),n=tf(n)),r=new Array(n.length);for(let u=0,d=n.length;u<d;u++)r[u]=e(l?c?Ma(er(n[u])):er(n[u]):n[u],u,void 0,s)}else if(typeof n=="number"){r=new Array(n);for(let a=0;a<n;a++)r[a]=e(a+1,a,void 0,s)}else if(Tt(n))if(n[Symbol.iterator])r=Array.from(n,(a,l)=>e(a,l,void 0,s));else{const a=Object.keys(n);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=e(n[u],u,l,s)}}else r=[];return r}function uv(n,e,t={},i,r){if(ni.ce||ni.parent&&co(ni.parent)&&ni.parent.ce){const c=Object.keys(t).length>0;return e!=="default"&&(t.name=e),_t(),Br(Qt,null,[Ct("slot",t,i&&i())],c?-2:64)}let s=n[e];s&&s._c&&(s._d=!1),_t();const o=s&&fv(s(t)),a=t.key||o&&o.key,l=Br(Qt,{key:(a&&!Ci(a)?a:`_${e}`)+(!o&&i?"_fb":"")},o||(i?i():[]),o&&n._===1?64:-2);return s&&s._c&&(s._d=!0),l}function fv(n){return n.some(e=>Ea(e)?!(e.type===Xi||e.type===Qt&&!fv(e.children)):!0)?n:null}const Oh=n=>n?Bv(n)?Bp(n):Oh(n.parent):null,pl=wn(Object.create(null),{$:n=>n,$el:n=>n.vnode.el,$data:n=>n.data,$props:n=>n.props,$attrs:n=>n.attrs,$slots:n=>n.slots,$refs:n=>n.refs,$parent:n=>Oh(n.parent),$root:n=>Oh(n.root),$host:n=>n.ce,$emit:n=>n.emit,$options:n=>dv(n),$forceUpdate:n=>n.f||(n.f=()=>{Pp(n.update)}),$nextTick:n=>n.n||(n.n=Il.bind(n.proxy)),$watch:n=>IM.bind(n)}),Af=(n,e)=>n!==Mt&&!n.__isScriptSetup&&St(n,e),KM={get({_:n},e){if(e==="__v_skip")return!0;const{ctx:t,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=n;if(e[0]!=="$"){const f=o[e];if(f!==void 0)switch(f){case 1:return i[e];case 2:return r[e];case 4:return t[e];case 3:return s[e]}else{if(Af(i,e))return o[e]=1,i[e];if(r!==Mt&&St(r,e))return o[e]=2,r[e];if(St(s,e))return o[e]=3,s[e];if(t!==Mt&&St(t,e))return o[e]=4,t[e];Bh&&(o[e]=0)}}const c=pl[e];let u,d;if(c)return e==="$attrs"&&Hn(n.attrs,"get",""),c(n);if((u=a.__cssModules)&&(u=u[e]))return u;if(t!==Mt&&St(t,e))return o[e]=4,t[e];if(d=l.config.globalProperties,St(d,e))return d[e]},set({_:n},e,t){const{data:i,setupState:r,ctx:s}=n;return Af(r,e)?(r[e]=t,!0):i!==Mt&&St(i,e)?(i[e]=t,!0):St(n.props,e)||e[0]==="$"&&e.slice(1)in n?!1:(s[e]=t,!0)},has({_:{data:n,setupState:e,accessCache:t,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(t[a]||n!==Mt&&a[0]!=="$"&&St(n,a)||Af(e,a)||St(s,a)||St(i,a)||St(pl,a)||St(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(n,e,t){return t.get!=null?n._.accessCache[e]=0:St(t,"value")&&this.set(n,e,t.value,null),Reflect.defineProperty(n,e,t)}};function bu(n){return Ze(n)?n.reduce((e,t)=>(e[t]=null,e),{}):n}function ZM(n,e){return!n||!e?n||e:Ze(n)&&Ze(e)?n.concat(e):wn({},bu(n),bu(e))}let Bh=!0;function JM(n){const e=dv(n),t=n.proxy,i=n.ctx;Bh=!1,e.beforeCreate&&Qm(e.beforeCreate,n,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:d,mounted:f,beforeUpdate:h,updated:p,activated:m,deactivated:_,beforeDestroy:g,beforeUnmount:y,destroyed:x,unmounted:v,render:b,renderTracked:T,renderTriggered:A,errorCaptured:S,serverPrefetch:E,expose:R,inheritAttrs:D,components:N,directives:V,filters:z}=e;if(c&&QM(c,i,null),o)for(const k in o){const H=o[k];et(H)&&(i[k]=H.bind(t))}if(r){const k=r.call(t,t);Tt(k)&&(n.data=Is(k))}if(Bh=!0,s)for(const k in s){const H=s[k],X=et(H)?H.bind(t,t):et(H.get)?H.get.bind(t,t):gr,L=!et(H)&&et(H.set)?H.set.bind(t):gr,ue=nc({get:X,set:L});Object.defineProperty(i,k,{enumerable:!0,configurable:!0,get:()=>ue.value,set:de=>ue.value=de})}if(a)for(const k in a)hv(a[k],i,t,k);if(l){const k=et(l)?l.call(t):l;Reflect.ownKeys(k).forEach(H=>{ev(H,k[H])})}u&&Qm(u,n,"c");function F(k,H){Ze(H)?H.forEach(X=>k(X.bind(t))):H&&k(H.bind(t))}if(F(GM,d),F(Kr,f),F(WM,h),F(XM,p),F(nv,m),F(iv,_),F(ov,S),F(YM,T),F(qM,A),F(Zr,y),F(sv,v),F($M,E),Ze(R))if(R.length){const k=n.exposed||(n.exposed={});R.forEach(H=>{Object.defineProperty(k,H,{get:()=>t[H],set:X=>t[H]=X,enumerable:!0})})}else n.exposed||(n.exposed={});b&&n.render===gr&&(n.render=b),D!=null&&(n.inheritAttrs=D),N&&(n.components=N),V&&(n.directives=V),E&&Ip(n)}function QM(n,e,t=gr){Ze(n)&&(n=kh(n));for(const i in n){const r=n[i];let s;Tt(r)?"default"in r?s=lo(r.from||i,r.default,!0):s=lo(r.from||i):s=lo(r),rn(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function Qm(n,e,t){Mr(Ze(n)?n.map(i=>i.bind(e.proxy)):n.bind(e.proxy),e,t)}function hv(n,e,t,i){let r=i.includes(".")?tv(t,i):()=>t[i];if(kt(n)){const s=e[n];et(s)&&ca(r,s)}else if(et(n))ca(r,n.bind(t));else if(Tt(n))if(Ze(n))n.forEach(s=>hv(s,e,t,i));else{const s=et(n.handler)?n.handler.bind(t):e[n.handler];et(s)&&ca(r,s,n)}}function dv(n){const e=n.type,{mixins:t,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=n.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!t&&!i?l=e:(l={},r.length&&r.forEach(c=>Eu(l,c,o,!0)),Eu(l,e,o)),Tt(e)&&s.set(e,l),l}function Eu(n,e,t,i=!1){const{mixins:r,extends:s}=e;s&&Eu(n,s,t,!0),r&&r.forEach(o=>Eu(n,o,t,!0));for(const o in e)if(!(i&&o==="expose")){const a=eb[o]||t&&t[o];n[o]=a?a(n[o],e[o]):e[o]}return n}const eb={data:e_,props:t_,emits:t_,methods:tl,computed:tl,beforeCreate:qn,created:qn,beforeMount:qn,mounted:qn,beforeUpdate:qn,updated:qn,beforeDestroy:qn,beforeUnmount:qn,destroyed:qn,unmounted:qn,activated:qn,deactivated:qn,errorCaptured:qn,serverPrefetch:qn,components:tl,directives:tl,watch:nb,provide:e_,inject:tb};function e_(n,e){return e?n?function(){return wn(et(n)?n.call(this,this):n,et(e)?e.call(this,this):e)}:e:n}function tb(n,e){return tl(kh(n),kh(e))}function kh(n){if(Ze(n)){const e={};for(let t=0;t<n.length;t++)e[n[t]]=n[t];return e}return n}function qn(n,e){return n?[...new Set([].concat(n,e))]:e}function tl(n,e){return n?wn(Object.create(null),n,e):e}function t_(n,e){return n?Ze(n)&&Ze(e)?[...new Set([...n,...e])]:wn(Object.create(null),bu(n),bu(e??{})):e}function nb(n,e){if(!n)return e;if(!e)return n;const t=wn(Object.create(null),n);for(const i in e)t[i]=qn(n[i],e[i]);return t}function pv(){return{app:null,config:{isNativeTag:T0,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let ib=0;function rb(n,e){return function(i,r=null){et(i)||(i=wn({},i)),r!=null&&!Tt(r)&&(r=null);const s=pv(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:ib++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:zb,get config(){return s.config},set config(u){},use(u,...d){return o.has(u)||(u&&et(u.install)?(o.add(u),u.install(c,...d)):et(u)&&(o.add(u),u(c,...d))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,d){return d?(s.components[u]=d,c):s.components[u]},directive(u,d){return d?(s.directives[u]=d,c):s.directives[u]},mount(u,d,f){if(!l){const h=c._ceVNode||Ct(i,r);return h.appContext=s,f===!0?f="svg":f===!1&&(f=void 0),d&&e?e(h,u):n(h,u,f),l=!0,c._container=u,u.__vue_app__=c,Bp(h.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Mr(a,c._instance,16),n(null,c._container),delete c._container.__vue_app__)},provide(u,d){return s.provides[u]=d,c},runWithContext(u){const d=uo;uo=c;try{return u()}finally{uo=d}}};return c}}let uo=null;function sb(n,e,t=Mt){const i=Ba(),r=Gn(e),s=ks(e),o=mv(n,r),a=vM((l,c)=>{let u,d=Mt,f;return LM(()=>{const h=n[r];kn(u,h)&&(u=h,c())}),{get(){return l(),t.get?t.get(u):u},set(h){const p=t.set?t.set(h):h;if(!kn(p,u)&&!(d!==Mt&&kn(h,d)))return;const m=i.vnode.props;m&&(e in m||r in m||s in m)&&(`onUpdate:${e}`in m||`onUpdate:${r}`in m||`onUpdate:${s}`in m)||(u=h,c()),i.emit(`update:${e}`,p),kn(h,p)&&kn(h,d)&&!kn(p,f)&&c(),d=h,f=p}}});return a[Symbol.iterator]=()=>{let l=0;return{next(){return l<2?{value:l++?o||Mt:a,done:!1}:{done:!0}}}},a}const mv=(n,e)=>e==="modelValue"||e==="model-value"?n.modelModifiers:n[`${e}Modifiers`]||n[`${Gn(e)}Modifiers`]||n[`${ks(e)}Modifiers`];function ob(n,e,...t){if(n.isUnmounted)return;const i=n.vnode.props||Mt;let r=t;const s=e.startsWith("update:"),o=s&&mv(i,e.slice(7));o&&(o.trim&&(r=t.map(u=>kt(u)?u.trim():u)),o.number&&(r=t.map(FS)));let a,l=i[a=Sf(e)]||i[a=Sf(Gn(e))];!l&&s&&(l=i[a=Sf(ks(e))]),l&&Mr(l,n,6,r);const c=i[a+"Once"];if(c){if(!n.emitted)n.emitted={};else if(n.emitted[a])return;n.emitted[a]=!0,Mr(c,n,6,r)}}const ab=new WeakMap;function _v(n,e,t=!1){const i=t?ab:e.emitsCache,r=i.get(n);if(r!==void 0)return r;const s=n.emits;let o={},a=!1;if(!et(n)){const l=c=>{const u=_v(c,e,!0);u&&(a=!0,wn(o,u))};!t&&e.mixins.length&&e.mixins.forEach(l),n.extends&&l(n.extends),n.mixins&&n.mixins.forEach(l)}return!s&&!a?(Tt(n)&&i.set(n,null),null):(Ze(s)?s.forEach(l=>o[l]=null):wn(o,s),Tt(n)&&i.set(n,o),o)}function af(n,e){return!n||!Kl(e)?!1:(e=e.slice(2).replace(/Once$/,""),St(n,e[0].toLowerCase()+e.slice(1))||St(n,ks(e))||St(n,e))}function Rf(n){const{type:e,vnode:t,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:d,data:f,setupState:h,ctx:p,inheritAttrs:m}=n,_=Su(n);let g,y;try{if(t.shapeFlag&4){const v=r||i,b=v;g=Si(c.call(b,v,u,d,h,f,p)),y=a}else{const v=e;g=Si(v.length>1?v(d,{attrs:a,slots:o,emit:l}):v(d,null)),y=e.props?a:cb(a)}}catch(v){_l.length=0,Oa(v,n,1),g=Ct(Xi)}let x=g;if(y&&m!==!1){const v=Object.keys(y),{shapeFlag:b}=x;v.length&&b&7&&(s&&v.some(ju)&&(y=ub(y,s)),x=Gr(x,y,!1,!0))}return t.dirs&&(x=Gr(x,null,!1,!0),x.dirs=x.dirs?x.dirs.concat(t.dirs):t.dirs),t.transition&&Lp(x,t.transition),g=x,Su(_),g}function lb(n,e=!0){let t;for(let i=0;i<n.length;i++){const r=n[i];if(Ea(r)){if(r.type!==Xi||r.children==="v-if"){if(t)return;t=r}}else return}return t}const cb=n=>{let e;for(const t in n)(t==="class"||t==="style"||Kl(t))&&((e||(e={}))[t]=n[t]);return e},ub=(n,e)=>{const t={};for(const i in n)(!ju(i)||!(i.slice(9)in e))&&(t[i]=n[i]);return t};function fb(n,e,t){const{props:i,children:r,component:s}=n,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return i?n_(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let d=0;d<u.length;d++){const f=u[d];if(gv(o,i,f)&&!af(c,f))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?n_(i,o,c):!0:!!o;return!1}function n_(n,e,t){const i=Object.keys(e);if(i.length!==Object.keys(n).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(gv(e,n,s)&&!af(t,s))return!0}return!1}function gv(n,e,t){const i=n[t],r=e[t];return t==="style"&&Tt(i)&&Tt(r)?!bp(i,r):i!==r}function lf({vnode:n,parent:e,suspense:t},i){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===n&&(r.suspense.vnode.el=r.el=i,n=r),r===n)(n=e.vnode).el=i,e=e.parent;else break}t&&t.activeBranch===n&&(t.vnode.el=i)}const vv={},xv=()=>Object.create(vv),yv=n=>Object.getPrototypeOf(n)===vv;function hb(n,e,t,i=!1){const r={},s=xv();n.propsDefaults=Object.create(null),Sv(n,e,r,s);for(const o in n.propsOptions[0])o in r||(r[o]=void 0);t?n.props=i?r:eo(r):n.type.props?n.props=r:n.props=s,n.attrs=s}function db(n,e,t,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=n,a=gt(r),[l]=n.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=n.vnode.dynamicProps;for(let d=0;d<u.length;d++){let f=u[d];if(af(n.emitsOptions,f))continue;const h=e[f];if(l)if(St(s,f))h!==s[f]&&(s[f]=h,c=!0);else{const p=Gn(f);r[p]=Hh(l,a,p,h,n,!1)}else h!==s[f]&&(s[f]=h,c=!0)}}}else{Sv(n,e,r,s)&&(c=!0);let u;for(const d in a)(!e||!St(e,d)&&((u=ks(d))===d||!St(e,u)))&&(l?t&&(t[d]!==void 0||t[u]!==void 0)&&(r[d]=Hh(l,a,d,void 0,n,!0)):delete r[d]);if(s!==a)for(const d in s)(!e||!St(e,d))&&(delete s[d],c=!0)}c&&Or(n.attrs,"set","")}function Sv(n,e,t,i){const[r,s]=n.propsOptions;let o=!1,a;if(e)for(let l in e){if(oo(l))continue;const c=e[l];let u;r&&St(r,u=Gn(l))?!s||!s.includes(u)?t[u]=c:(a||(a={}))[u]=c:af(n.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=gt(t),c=a||Mt;for(let u=0;u<s.length;u++){const d=s[u];t[d]=Hh(r,l,d,c[d],n,!St(c,d))}}return o}function Hh(n,e,t,i,r,s){const o=n[t];if(o!=null){const a=St(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&et(l)){const{propsDefaults:c}=r;if(t in c)i=c[t];else{const u=tc(r);i=c[t]=l.call(null,e),u()}}else i=l;r.ce&&r.ce._setProp(t,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===ks(t))&&(i=!0))}return i}const pb=new WeakMap;function Mv(n,e,t=!1){const i=t?pb:e.propsCache,r=i.get(n);if(r)return r;const s=n.props,o={},a=[];let l=!1;if(!et(n)){const u=d=>{l=!0;const[f,h]=Mv(d,e,!0);wn(o,f),h&&a.push(...h)};!t&&e.mixins.length&&e.mixins.forEach(u),n.extends&&u(n.extends),n.mixins&&n.mixins.forEach(u)}if(!s&&!l)return Tt(n)&&i.set(n,oa),oa;if(Ze(s))for(let u=0;u<s.length;u++){const d=Gn(s[u]);i_(d)&&(o[d]=Mt)}else if(s)for(const u in s){const d=Gn(u);if(i_(d)){const f=s[u],h=o[d]=Ze(f)||et(f)?{type:f}:wn({},f),p=h.type;let m=!1,_=!0;if(Ze(p))for(let g=0;g<p.length;++g){const y=p[g],x=et(y)&&y.name;if(x==="Boolean"){m=!0;break}else x==="String"&&(_=!1)}else m=et(p)&&p.name==="Boolean";h[0]=m,h[1]=_,(m||St(h,"default"))&&a.push(d)}}const c=[o,a];return Tt(n)&&i.set(n,c),c}function i_(n){return n[0]!=="$"&&!oo(n)}const Up=n=>n==="_"||n==="_ctx"||n==="$stable",Fp=n=>Ze(n)?n.map(Si):[Si(n)],mb=(n,e,t)=>{if(e._n)return e;const i=Dp((...r)=>Fp(e(...r)),t);return i._c=!1,i},bv=(n,e,t)=>{const i=n._ctx;for(const r in n){if(Up(r))continue;const s=n[r];if(et(s))e[r]=mb(r,s,i);else if(s!=null){const o=Fp(s);e[r]=()=>o}}},Ev=(n,e)=>{const t=Fp(e);n.slots.default=()=>t},Tv=(n,e,t)=>{for(const i in e)(t||!Up(i))&&(n[i]=e[i])},_b=(n,e,t)=>{const i=n.slots=xv();if(n.vnode.shapeFlag&32){const r=e._;r?(Tv(i,e,t),t&&C0(i,"_",r,!0)):bv(e,i)}else e&&Ev(n,e)},gb=(n,e,t)=>{const{vnode:i,slots:r}=n;let s=!0,o=Mt;if(i.shapeFlag&32){const a=e._;a?t&&a===1?s=!1:Tv(r,e,t):(s=!e.$stable,bv(e,r)),o=e}else e&&(Ev(n,e),o={default:1});if(s)for(const a in r)!Up(a)&&o[a]==null&&delete r[a]},Kn=Iv;function vb(n){return wv(n)}function xb(n){return wv(n,kM)}function wv(n,e){const t=Qu();t.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:d,nextSibling:f,setScopeId:h=gr,insertStaticContent:p}=n,m=(P,B,$,Q=null,U=null,oe=null,be=void 0,I=null,K=!!B.dynamicChildren)=>{if(P===B)return;P&&!vs(P,B)&&(Q=xe(P),de(P,U,oe,!0),P=null),B.patchFlag===-2&&(K=!1,B.dynamicChildren=null);const{type:Y,ref:pe,shapeFlag:q}=B;switch(Y){case fo:_(P,B,$,Q);break;case Xi:g(P,B,$,Q);break;case ml:P==null&&y(B,$,Q,be);break;case Qt:N(P,B,$,Q,U,oe,be,I,K);break;default:q&1?b(P,B,$,Q,U,oe,be,I,K):q&6?V(P,B,$,Q,U,oe,be,I,K):(q&64||q&128)&&Y.process(P,B,$,Q,U,oe,be,I,K,we)}pe!=null&&U?ua(pe,P&&P.ref,oe,B||P,!B):pe==null&&P&&P.ref!=null&&ua(P.ref,null,oe,P,!0)},_=(P,B,$,Q)=>{if(P==null)i(B.el=a(B.children),$,Q);else{const U=B.el=P.el;B.children!==P.children&&c(U,B.children)}},g=(P,B,$,Q)=>{P==null?i(B.el=l(B.children||""),$,Q):B.el=P.el},y=(P,B,$,Q)=>{[P.el,P.anchor]=p(P.children,B,$,Q,P.el,P.anchor)},x=({el:P,anchor:B},$,Q)=>{let U;for(;P&&P!==B;)U=f(P),i(P,$,Q),P=U;i(B,$,Q)},v=({el:P,anchor:B})=>{let $;for(;P&&P!==B;)$=f(P),r(P),P=$;r(B)},b=(P,B,$,Q,U,oe,be,I,K)=>{if(B.type==="svg"?be="svg":B.type==="math"&&(be="mathml"),P==null)T(B,$,Q,U,oe,be,I,K);else{const Y=P.el&&P.el._isVueCE?P.el:null;try{Y&&Y._beginPatch(),E(P,B,U,oe,be,I,K)}finally{Y&&Y._endPatch()}}},T=(P,B,$,Q,U,oe,be,I)=>{let K,Y;const{props:pe,shapeFlag:q,transition:he,dirs:w}=P;if(K=P.el=o(P.type,oe,pe&&pe.is,pe),q&8?u(K,P.children):q&16&&S(P.children,K,null,Q,U,Cf(P,oe),be,I),w&&ar(P,null,Q,"created"),A(K,P,P.scopeId,be,Q),pe){for(const G in pe)G!=="value"&&!oo(G)&&s(K,G,null,pe[G],oe,Q);"value"in pe&&s(K,"value",null,pe.value,oe),(Y=pe.onVnodeBeforeMount)&&Ui(Y,Q,P)}w&&ar(P,null,Q,"beforeMount");const M=Av(U,he);M&&he.beforeEnter(K),i(K,B,$),((Y=pe&&pe.onVnodeMounted)||M||w)&&Kn(()=>{Y&&Ui(Y,Q,P),M&&he.enter(K),w&&ar(P,null,Q,"mounted")},U)},A=(P,B,$,Q,U)=>{if($&&h(P,$),Q)for(let oe=0;oe<Q.length;oe++)h(P,Q[oe]);if(U){let oe=U.subTree;if(B===oe||Dv(oe.type)&&(oe.ssContent===B||oe.ssFallback===B)){const be=U.vnode;A(P,be,be.scopeId,be.slotScopeIds,U.parent)}}},S=(P,B,$,Q,U,oe,be,I,K=0)=>{for(let Y=K;Y<P.length;Y++){const pe=P[Y]=I?Ur(P[Y]):Si(P[Y]);m(null,pe,B,$,Q,U,oe,be,I)}},E=(P,B,$,Q,U,oe,be)=>{const I=B.el=P.el;let{patchFlag:K,dynamicChildren:Y,dirs:pe}=B;K|=P.patchFlag&16;const q=P.props||Mt,he=B.props||Mt;let w;if($&&Vs($,!1),(w=he.onVnodeBeforeUpdate)&&Ui(w,$,B,P),pe&&ar(B,P,$,"beforeUpdate"),$&&Vs($,!0),(q.innerHTML&&he.innerHTML==null||q.textContent&&he.textContent==null)&&u(I,""),Y?R(P.dynamicChildren,Y,I,$,Q,Cf(B,U),oe):be||H(P,B,I,null,$,Q,Cf(B,U),oe,!1),K>0){if(K&16)D(I,q,he,$,U);else if(K&2&&q.class!==he.class&&s(I,"class",null,he.class,U),K&4&&s(I,"style",q.style,he.style,U),K&8){const M=B.dynamicProps;for(let G=0;G<M.length;G++){const Z=M[G],ae=q[Z],ce=he[Z];(ce!==ae||Z==="value")&&s(I,Z,ae,ce,U,$)}}K&1&&P.children!==B.children&&u(I,B.children)}else!be&&Y==null&&D(I,q,he,$,U);((w=he.onVnodeUpdated)||pe)&&Kn(()=>{w&&Ui(w,$,B,P),pe&&ar(B,P,$,"updated")},Q)},R=(P,B,$,Q,U,oe,be)=>{for(let I=0;I<B.length;I++){const K=P[I],Y=B[I],pe=K.el&&(K.type===Qt||!vs(K,Y)||K.shapeFlag&198)?d(K.el):$;m(K,Y,pe,null,Q,U,oe,be,!0)}},D=(P,B,$,Q,U)=>{if(B!==$){if(B!==Mt)for(const oe in B)!oo(oe)&&!(oe in $)&&s(P,oe,B[oe],null,U,Q);for(const oe in $){if(oo(oe))continue;const be=$[oe],I=B[oe];be!==I&&oe!=="value"&&s(P,oe,I,be,U,Q)}"value"in $&&s(P,"value",B.value,$.value,U)}},N=(P,B,$,Q,U,oe,be,I,K)=>{const Y=B.el=P?P.el:a(""),pe=B.anchor=P?P.anchor:a("");let{patchFlag:q,dynamicChildren:he,slotScopeIds:w}=B;w&&(I=I?I.concat(w):w),P==null?(i(Y,$,Q),i(pe,$,Q),S(B.children||[],$,pe,U,oe,be,I,K)):q>0&&q&64&&he&&P.dynamicChildren&&P.dynamicChildren.length===he.length?(R(P.dynamicChildren,he,$,U,oe,be,I),(B.key!=null||U&&B===U.subTree)&&Rv(P,B,!0)):H(P,B,$,pe,U,oe,be,I,K)},V=(P,B,$,Q,U,oe,be,I,K)=>{B.slotScopeIds=I,P==null?B.shapeFlag&512?U.ctx.activate(B,$,Q,be,K):z(B,$,Q,U,oe,be,K):O(P,B,K)},z=(P,B,$,Q,U,oe,be)=>{const I=P.component=Nb(P,Q,U);if(Np(P)&&(I.ctx.renderer=we),Ub(I,!1,be),I.asyncDep){if(U&&U.registerDep(I,F,be),!P.el){const K=I.subTree=Ct(Xi);g(null,K,B,$),P.placeholder=K.el}}else F(I,P,B,$,U,oe,be)},O=(P,B,$)=>{const Q=B.component=P.component;if(fb(P,B,$))if(Q.asyncDep&&!Q.asyncResolved){k(Q,B,$);return}else Q.next=B,Q.update();else B.el=P.el,Q.vnode=B},F=(P,B,$,Q,U,oe,be)=>{const I=()=>{if(P.isMounted){let{next:q,bu:he,u:w,parent:M,vnode:G}=P;{const ie=Cv(P);if(ie){q&&(q.el=G.el,k(P,q,be)),ie.asyncDep.then(()=>{Kn(()=>{P.isUnmounted||Y()},U)});return}}let Z=q,ae;Vs(P,!1),q?(q.el=G.el,k(P,q,be)):q=G,he&&Mf(he),(ae=q.props&&q.props.onVnodeBeforeUpdate)&&Ui(ae,M,q,G),Vs(P,!0);const ce=Rf(P),fe=P.subTree;P.subTree=ce,m(fe,ce,d(fe.el),xe(fe),P,U,oe),q.el=ce.el,Z===null&&lf(P,ce.el),w&&Kn(w,U),(ae=q.props&&q.props.onVnodeUpdated)&&Kn(()=>Ui(ae,M,q,G),U)}else{let q;const{el:he,props:w}=B,{bm:M,m:G,parent:Z,root:ae,type:ce}=P,fe=co(B);if(Vs(P,!1),M&&Mf(M),!fe&&(q=w&&w.onVnodeBeforeMount)&&Ui(q,Z,B),Vs(P,!0),he&&Be){const ie=()=>{P.subTree=Rf(P),Be(he,P.subTree,P,U,null)};fe&&ce.__asyncHydrate?ce.__asyncHydrate(he,P,ie):ie()}else{ae.ce&&ae.ce._hasShadowRoot()&&ae.ce._injectChildStyle(ce,P.parent?P.parent.type:void 0);const ie=P.subTree=Rf(P);m(null,ie,$,Q,P,U,oe),B.el=ie.el}if(G&&Kn(G,U),!fe&&(q=w&&w.onVnodeMounted)){const ie=B;Kn(()=>Ui(q,Z,ie),U)}(B.shapeFlag&256||Z&&co(Z.vnode)&&Z.vnode.shapeFlag&256)&&P.a&&Kn(P.a,U),P.isMounted=!0,B=$=Q=null}};P.scope.on();const K=P.effect=new N0(I);P.scope.off();const Y=P.update=K.run.bind(K),pe=P.job=K.runIfDirty.bind(K);pe.i=P,pe.id=P.uid,K.scheduler=()=>Pp(pe),Vs(P,!0),Y()},k=(P,B,$)=>{B.component=P;const Q=P.vnode.props;P.vnode=B,P.next=null,db(P,B.props,Q,$),gb(P,B.children,$),Yr(),$m(P),jr()},H=(P,B,$,Q,U,oe,be,I,K=!1)=>{const Y=P&&P.children,pe=P?P.shapeFlag:0,q=B.children,{patchFlag:he,shapeFlag:w}=B;if(he>0){if(he&128){L(Y,q,$,Q,U,oe,be,I,K);return}else if(he&256){X(Y,q,$,Q,U,oe,be,I,K);return}}w&8?(pe&16&&ne(Y,U,oe),q!==Y&&u($,q)):pe&16?w&16?L(Y,q,$,Q,U,oe,be,I,K):ne(Y,U,oe,!0):(pe&8&&u($,""),w&16&&S(q,$,Q,U,oe,be,I,K))},X=(P,B,$,Q,U,oe,be,I,K)=>{P=P||oa,B=B||oa;const Y=P.length,pe=B.length,q=Math.min(Y,pe);let he;for(he=0;he<q;he++){const w=B[he]=K?Ur(B[he]):Si(B[he]);m(P[he],w,$,null,U,oe,be,I,K)}Y>pe?ne(P,U,oe,!0,!1,q):S(B,$,Q,U,oe,be,I,K,q)},L=(P,B,$,Q,U,oe,be,I,K)=>{let Y=0;const pe=B.length;let q=P.length-1,he=pe-1;for(;Y<=q&&Y<=he;){const w=P[Y],M=B[Y]=K?Ur(B[Y]):Si(B[Y]);if(vs(w,M))m(w,M,$,null,U,oe,be,I,K);else break;Y++}for(;Y<=q&&Y<=he;){const w=P[q],M=B[he]=K?Ur(B[he]):Si(B[he]);if(vs(w,M))m(w,M,$,null,U,oe,be,I,K);else break;q--,he--}if(Y>q){if(Y<=he){const w=he+1,M=w<pe?B[w].el:Q;for(;Y<=he;)m(null,B[Y]=K?Ur(B[Y]):Si(B[Y]),$,M,U,oe,be,I,K),Y++}}else if(Y>he)for(;Y<=q;)de(P[Y],U,oe,!0),Y++;else{const w=Y,M=Y,G=new Map;for(Y=M;Y<=he;Y++){const ge=B[Y]=K?Ur(B[Y]):Si(B[Y]);ge.key!=null&&G.set(ge.key,Y)}let Z,ae=0;const ce=he-M+1;let fe=!1,ie=0;const le=new Array(ce);for(Y=0;Y<ce;Y++)le[Y]=0;for(Y=w;Y<=q;Y++){const ge=P[Y];if(ae>=ce){de(ge,U,oe,!0);continue}let ve;if(ge.key!=null)ve=G.get(ge.key);else for(Z=M;Z<=he;Z++)if(le[Z-M]===0&&vs(ge,B[Z])){ve=Z;break}ve===void 0?de(ge,U,oe,!0):(le[ve-M]=Y+1,ve>=ie?ie=ve:fe=!0,m(ge,B[ve],$,null,U,oe,be,I,K),ae++)}const Ce=fe?yb(le):oa;for(Z=Ce.length-1,Y=ce-1;Y>=0;Y--){const ge=M+Y,ve=B[ge],Me=B[ge+1],Pe=ge+1<pe?Me.el||Pv(Me):Q;le[Y]===0?m(null,ve,$,Pe,U,oe,be,I,K):fe&&(Z<0||Y!==Ce[Z]?ue(ve,$,Pe,2):Z--)}}},ue=(P,B,$,Q,U=null)=>{const{el:oe,type:be,transition:I,children:K,shapeFlag:Y}=P;if(Y&6){ue(P.component.subTree,B,$,Q);return}if(Y&128){P.suspense.move(B,$,Q);return}if(Y&64){be.move(P,B,$,we);return}if(be===Qt){i(oe,B,$);for(let q=0;q<K.length;q++)ue(K[q],B,$,Q);i(P.anchor,B,$);return}if(be===ml){x(P,B,$);return}if(Q!==2&&Y&1&&I)if(Q===0)I.beforeEnter(oe),i(oe,B,$),Kn(()=>I.enter(oe),U);else{const{leave:q,delayLeave:he,afterLeave:w}=I,M=()=>{P.ctx.isUnmounted?r(oe):i(oe,B,$)},G=()=>{oe._isLeaving&&oe[FM](!0),q(oe,()=>{M(),w&&w()})};he?he(oe,M,G):G()}else i(oe,B,$)},de=(P,B,$,Q=!1,U=!1)=>{const{type:oe,props:be,ref:I,children:K,dynamicChildren:Y,shapeFlag:pe,patchFlag:q,dirs:he,cacheIndex:w,memo:M}=P;if(q===-2&&(U=!1),I!=null&&(Yr(),ua(I,null,$,P,!0),jr()),w!=null&&(B.renderCache[w]=void 0),pe&256){B.ctx.deactivate(P);return}const G=pe&1&&he,Z=!co(P);let ae;if(Z&&(ae=be&&be.onVnodeBeforeUnmount)&&Ui(ae,B,P),pe&6)Ne(P.component,$,Q);else{if(pe&128){P.suspense.unmount($,Q);return}G&&ar(P,null,B,"beforeUnmount"),pe&64?P.type.remove(P,B,$,we,Q):Y&&!Y.hasOnce&&(oe!==Qt||q>0&&q&64)?ne(Y,B,$,!1,!0):(oe===Qt&&q&384||!U&&pe&16)&&ne(K,B,$),Q&&ke(P)}const ce=M!=null&&w==null;(Z&&(ae=be&&be.onVnodeUnmounted)||G||ce)&&Kn(()=>{ae&&Ui(ae,B,P),G&&ar(P,null,B,"unmounted"),ce&&(P.el=null)},$)},ke=P=>{const{type:B,el:$,anchor:Q,transition:U}=P;if(B===Qt){ze($,Q);return}if(B===ml){v(P);return}const oe=()=>{r($),U&&!U.persisted&&U.afterLeave&&U.afterLeave()};if(P.shapeFlag&1&&U&&!U.persisted){const{leave:be,delayLeave:I}=U,K=()=>be($,oe);I?I(P.el,oe,K):K()}else oe()},ze=(P,B)=>{let $;for(;P!==B;)$=f(P),r(P),P=$;r(B)},Ne=(P,B,$)=>{const{bum:Q,scope:U,job:oe,subTree:be,um:I,m:K,a:Y}=P;r_(K),r_(Y),Q&&Mf(Q),U.stop(),oe&&(oe.flags|=8,de(be,P,B,$)),I&&Kn(I,B),Kn(()=>{P.isUnmounted=!0},B)},ne=(P,B,$,Q=!1,U=!1,oe=0)=>{for(let be=oe;be<P.length;be++)de(P[be],B,$,Q,U)},xe=P=>{if(P.shapeFlag&6)return xe(P.component.subTree);if(P.shapeFlag&128)return P.suspense.next();const B=f(P.anchor||P.el),$=B&&B[NM];return $?f($):B};let _e=!1;const Le=(P,B,$)=>{let Q;P==null?B._vnode&&(de(B._vnode,null,null,!0),Q=B._vnode.component):m(B._vnode||null,P,B,null,null,null,$),B._vnode=P,_e||(_e=!0,$m(Q),yu(),_e=!1)},we={p:m,um:de,m:ue,r:ke,mt:z,mc:S,pc:H,pbc:R,n:xe,o:n};let Te,Be;return e&&([Te,Be]=e(we)),{render:Le,hydrate:Te,createApp:rb(Le,Te)}}function Cf({type:n,props:e},t){return t==="svg"&&n==="foreignObject"||t==="mathml"&&n==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:t}function Vs({effect:n,job:e},t){t?(n.flags|=32,e.flags|=4):(n.flags&=-33,e.flags&=-5)}function Av(n,e){return(!n||n&&!n.pendingBranch)&&e&&!e.persisted}function Rv(n,e,t=!1){const i=n.children,r=e.children;if(Ze(i)&&Ze(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=Ur(r[s]),a.el=o.el),!t&&a.patchFlag!==-2&&Rv(o,a)),a.type===fo&&(a.patchFlag===-1&&(a=r[s]=Ur(a)),a.el=o.el),a.type===Xi&&!a.el&&(a.el=o.el)}}function yb(n){const e=n.slice(),t=[0];let i,r,s,o,a;const l=n.length;for(i=0;i<l;i++){const c=n[i];if(c!==0){if(r=t[t.length-1],n[r]<c){e[i]=r,t.push(i);continue}for(s=0,o=t.length-1;s<o;)a=s+o>>1,n[t[a]]<c?s=a+1:o=a;c<n[t[s]]&&(s>0&&(e[i]=t[s-1]),t[s]=i)}}for(s=t.length,o=t[s-1];s-- >0;)t[s]=o,o=e[o];return t}function Cv(n){const e=n.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Cv(e)}function r_(n){if(n)for(let e=0;e<n.length;e++)n[e].flags|=8}function Pv(n){if(n.placeholder)return n.placeholder;const e=n.component;return e?Pv(e.subTree):null}const Dv=n=>n.__isSuspense;let zh=0;const Sb={name:"Suspense",__isSuspense:!0,process(n,e,t,i,r,s,o,a,l,c){if(n==null)bb(e,t,i,r,s,o,a,l,c);else{if(s&&s.deps>0&&!n.suspense.isInFallback){e.suspense=n.suspense,e.suspense.vnode=e,e.el=n.el;return}Eb(n,e,t,i,r,o,a,l,c)}},hydrate:Tb,normalize:wb},Mb=Sb;function Ul(n,e){const t=n.props&&n.props[e];et(t)&&t()}function bb(n,e,t,i,r,s,o,a,l){const{p:c,o:{createElement:u}}=l,d=u("div"),f=n.suspense=Lv(n,r,i,e,d,t,s,o,a,l);c(null,f.pendingBranch=n.ssContent,d,null,i,f,s,o),f.deps>0?(Ul(n,"onPending"),Ul(n,"onFallback"),c(null,n.ssFallback,e,t,i,null,s,o),fa(f,n.ssFallback)):f.resolve(!1,!0)}function Eb(n,e,t,i,r,s,o,a,{p:l,um:c,o:{createElement:u}}){const d=e.suspense=n.suspense;d.vnode=e,e.el=n.el;const f=e.ssContent,h=e.ssFallback,{activeBranch:p,pendingBranch:m,isInFallback:_,isHydrating:g}=d;if(m)d.pendingBranch=f,vs(m,f)?(l(m,f,d.hiddenContainer,null,r,d,s,o,a),d.deps<=0?d.resolve():_&&(g||(l(p,h,t,i,r,null,s,o,a),fa(d,h)))):(d.pendingId=zh++,g?(d.isHydrating=!1,d.activeBranch=m):c(m,r,d),d.deps=0,d.effects.length=0,d.hiddenContainer=u("div"),_?(l(null,f,d.hiddenContainer,null,r,d,s,o,a),d.deps<=0?d.resolve():(l(p,h,t,i,r,null,s,o,a),fa(d,h))):p&&vs(p,f)?(l(p,f,t,i,r,d,s,o,a),d.resolve(!0)):(l(null,f,d.hiddenContainer,null,r,d,s,o,a),d.deps<=0&&d.resolve()));else if(p&&vs(p,f))l(p,f,t,i,r,d,s,o,a),fa(d,f);else if(Ul(e,"onPending"),d.pendingBranch=f,f.shapeFlag&512?d.pendingId=f.component.suspenseId:d.pendingId=zh++,l(null,f,d.hiddenContainer,null,r,d,s,o,a),d.deps<=0)d.resolve();else{const{timeout:y,pendingId:x}=d;y>0?setTimeout(()=>{d.pendingId===x&&d.fallback(h)},y):y===0&&d.fallback(h)}}function Lv(n,e,t,i,r,s,o,a,l,c,u=!1){const{p:d,m:f,um:h,n:p,o:{parentNode:m,remove:_}}=c;let g;const y=Ab(n);y&&e&&e.pendingBranch&&(g=e.pendingId,e.deps++);const x=n.props?OS(n.props.timeout):void 0,v=s,b={vnode:n,parent:e,parentComponent:t,namespace:o,container:i,hiddenContainer:r,deps:0,pendingId:zh++,timeout:typeof x=="number"?x:-1,activeBranch:null,isFallbackMountPending:!1,pendingBranch:null,isInFallback:!u,isHydrating:u,isUnmounted:!1,effects:[],resolve(T=!1,A=!1){const{vnode:S,activeBranch:E,pendingBranch:R,pendingId:D,effects:N,parentComponent:V,container:z,isInFallback:O}=b;let F=!1;if(b.isHydrating)b.isHydrating=!1;else if(!T){F=E&&R.transition&&R.transition.mode==="out-in";let X=!1;F&&(E.transition.afterLeave=()=>{D===b.pendingId&&(f(R,z,s===v&&!X?p(E):s,0),Fh(N),O&&S.ssFallback&&(S.ssFallback.el=null))}),E&&!b.isFallbackMountPending&&(m(E.el)===z&&(s=p(E),X=!0),h(E,V,b,!0),!F&&O&&S.ssFallback&&Kn(()=>S.ssFallback.el=null,b)),F||f(R,z,s,0)}b.isFallbackMountPending=!1,fa(b,R),b.pendingBranch=null,b.isInFallback=!1;let k=b.parent,H=!1;for(;k;){if(k.pendingBranch){k.effects.push(...N),H=!0;break}k=k.parent}!H&&!F&&Fh(N),b.effects=[],y&&e&&e.pendingBranch&&g===e.pendingId&&(e.deps--,e.deps===0&&!A&&e.resolve()),Ul(S,"onResolve")},fallback(T){if(!b.pendingBranch)return;const{vnode:A,activeBranch:S,parentComponent:E,container:R,namespace:D}=b;Ul(A,"onFallback");const N=p(S),V=()=>{b.isFallbackMountPending=!1,b.isInFallback&&(d(null,T,R,N,E,null,D,a,l),fa(b,T))},z=T.transition&&T.transition.mode==="out-in";z&&(b.isFallbackMountPending=!0,S.transition.afterLeave=V),b.isInFallback=!0,h(S,E,null,!0),z||V()},move(T,A,S){b.activeBranch&&f(b.activeBranch,T,A,S),b.container=T},next(){return b.activeBranch&&p(b.activeBranch)},registerDep(T,A,S){const E=!!b.pendingBranch;E&&b.deps++;const R=T.vnode.el;T.asyncDep.catch(D=>{Oa(D,T,0)}).then(D=>{if(T.isUnmounted||b.isUnmounted||b.pendingId!==T.suspenseId)return;Gh(),T.asyncResolved=!0;const{vnode:N}=T;Wh(T,D),R&&(N.el=R);const V=!R&&T.subTree.el;A(T,N,m(R||T.subTree.el),R?null:p(T.subTree),b,o,S),V&&(N.placeholder=null,_(V)),lf(T,N.el),E&&--b.deps===0&&b.resolve()})},unmount(T,A){b.isUnmounted=!0,b.activeBranch&&h(b.activeBranch,t,T,A),b.pendingBranch&&h(b.pendingBranch,t,T,A)}};return b}function Tb(n,e,t,i,r,s,o,a,l){const c=e.suspense=Lv(e,i,t,n.parentNode,document.createElement("div"),null,r,s,o,a,!0),u=l(n,c.pendingBranch=e.ssContent,t,c,s,o);return c.deps===0&&c.resolve(!1,!0),u}function wb(n){const{shapeFlag:e,children:t}=n,i=e&32;n.ssContent=s_(i?t.default:t),n.ssFallback=i?s_(t.fallback):Ct(Xi)}function s_(n){let e;if(et(n)){const t=ba&&n._c;t&&(n._d=!1,_t()),n=n(),t&&(n._d=!0,e=oi,Nv())}return Ze(n)&&(n=lb(n)),n=Si(n),e&&!n.dynamicChildren&&(n.dynamicChildren=e.filter(t=>t!==n)),n}function Iv(n,e){e&&e.pendingBranch?Ze(n)?e.effects.push(...n):e.effects.push(n):Fh(n)}function fa(n,e){n.activeBranch=e;const{vnode:t,parentComponent:i}=n;let r=e.el;for(;!r&&e.component;)e=e.component.subTree,r=e.el;t.el=r,i&&i.subTree===t&&(i.vnode.el=r,lf(i,r))}function Ab(n){const e=n.props&&n.props.suspensible;return e!=null&&e!==!1}const Qt=Symbol.for("v-fgt"),fo=Symbol.for("v-txt"),Xi=Symbol.for("v-cmt"),ml=Symbol.for("v-stc"),_l=[];let oi=null;function _t(n=!1){_l.push(oi=n?null:[])}function Nv(){_l.pop(),oi=_l[_l.length-1]||null}let ba=1;function Tu(n,e=!1){ba+=n,n<0&&oi&&e&&(oi.hasOnce=!0)}function Uv(n){return n.dynamicChildren=ba>0?oi||oa:null,Nv(),ba>0&&oi&&oi.push(n),n}function Xt(n,e,t,i,r,s){return Uv(en(n,e,t,i,r,s,!0))}function Br(n,e,t,i,r){return Uv(Ct(n,e,t,i,r,!0))}function Ea(n){return n?n.__v_isVNode===!0:!1}function vs(n,e){return n.type===e.type&&n.key===e.key}const Fv=({key:n})=>n??null,eu=({ref:n,ref_key:e,ref_for:t})=>(typeof n=="number"&&(n=""+n),n!=null?kt(n)||rn(n)||et(n)?{i:ni,r:n,k:e,f:!!t}:n:null);function en(n,e=null,t=null,i=0,r=null,s=n===Qt?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:n,props:e,key:e&&Fv(e),ref:e&&eu(e),scopeId:Q0,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:ni};return a?(Op(l,t),s&128&&n.normalize(l)):t&&(l.shapeFlag|=kt(t)?8:16),ba>0&&!o&&oi&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&oi.push(l),l}const Ct=Rb;function Rb(n,e=null,t=null,i=0,r=null,s=!1){if((!n||n===lv)&&(n=Xi),Ea(n)){const a=Gr(n,e,!0);return t&&Op(a,t),ba>0&&!s&&oi&&(a.shapeFlag&6?oi[oi.indexOf(n)]=a:oi.push(a)),a.patchFlag=-2,a}if(Hb(n)&&(n=n.__vccOpts),e){e=Ov(e);let{class:a,style:l}=e;a&&!kt(a)&&(e.class=Jl(a)),Tt(l)&&(nf(l)&&!Ze(l)&&(l=wn({},l)),e.style=yo(l))}const o=kt(n)?1:Dv(n)?128:UM(n)?64:Tt(n)?4:et(n)?2:0;return en(n,e,t,i,r,o,s,!0)}function Ov(n){return n?nf(n)||yv(n)?wn({},n):n:null}function Gr(n,e,t=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=n,c=e?Db(r||{},e):r,u={__v_isVNode:!0,__v_skip:!0,type:n.type,props:c,key:c&&Fv(c),ref:e&&e.ref?t&&s?Ze(s)?s.concat(eu(e)):[s,eu(e)]:eu(e):s,scopeId:n.scopeId,slotScopeIds:n.slotScopeIds,children:a,target:n.target,targetStart:n.targetStart,targetAnchor:n.targetAnchor,staticCount:n.staticCount,shapeFlag:n.shapeFlag,patchFlag:e&&n.type!==Qt?o===-1?16:o|16:o,dynamicProps:n.dynamicProps,dynamicChildren:n.dynamicChildren,appContext:n.appContext,dirs:n.dirs,transition:l,component:n.component,suspense:n.suspense,ssContent:n.ssContent&&Gr(n.ssContent),ssFallback:n.ssFallback&&Gr(n.ssFallback),placeholder:n.placeholder,el:n.el,anchor:n.anchor,ctx:n.ctx,ce:n.ce};return l&&i&&Lp(u,l.clone(u)),u}function ha(n=" ",e=0){return Ct(fo,null,n,e)}function Cb(n,e){const t=Ct(ml,null,n);return t.staticCount=e,t}function Pb(n="",e=!1){return e?(_t(),Br(Xi,null,n)):Ct(Xi,null,n)}function Si(n){return n==null||typeof n=="boolean"?Ct(Xi):Ze(n)?Ct(Qt,null,n.slice()):Ea(n)?Ur(n):Ct(fo,null,String(n))}function Ur(n){return n.el===null&&n.patchFlag!==-1||n.memo?n:Gr(n)}function Op(n,e){let t=0;const{shapeFlag:i}=n;if(e==null)e=null;else if(Ze(e))t=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),Op(n,r()),r._c&&(r._d=!0));return}else{t=32;const r=e._;!r&&!yv(e)?e._ctx=ni:r===3&&ni&&(ni.slots._===1?e._=1:(e._=2,n.patchFlag|=1024))}else et(e)?(e={default:e,_ctx:ni},t=32):(e=String(e),i&64?(t=16,e=[ha(e)]):t=8);n.children=e,n.shapeFlag|=t}function Db(...n){const e={};for(let t=0;t<n.length;t++){const i=n[t];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=Jl([e.class,i.class]));else if(r==="style")e.style=yo([e.style,i.style]);else if(Kl(r)){const s=e[r],o=i[r];o&&s!==o&&!(Ze(s)&&s.includes(o))?e[r]=s?[].concat(s,o):o:o==null&&s==null&&!ju(r)&&(e[r]=o)}else r!==""&&(e[r]=i[r])}return e}function Ui(n,e,t,i=null){Mr(n,e,7,[t,i])}const Lb=pv();let Ib=0;function Nb(n,e,t){const i=n.type,r=(e?e.appContext:n.appContext)||Lb,s={uid:Ib++,vnode:n,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new I0(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Mv(i,r),emitsOptions:_v(i,r),emit:null,emitted:null,propsDefaults:Mt,inheritAttrs:i.inheritAttrs,ctx:Mt,data:Mt,props:Mt,attrs:Mt,slots:Mt,refs:Mt,setupState:Mt,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=ob.bind(null,s),n.ce&&n.ce(s),s}let Cn=null;const Ba=()=>Cn||ni;let wu,Vh;{const n=Qu(),e=(t,i)=>{let r;return(r=n[t])||(r=n[t]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};wu=e("__VUE_INSTANCE_SETTERS__",t=>Cn=t),Vh=e("__VUE_SSR_SETTERS__",t=>Ta=t)}const tc=n=>{const e=Cn;return wu(n),n.scope.on(),()=>{n.scope.off(),wu(e)}},Gh=()=>{Cn&&Cn.scope.off(),wu(null)};function Bv(n){return n.vnode.shapeFlag&4}let Ta=!1;function Ub(n,e=!1,t=!1){e&&Vh(e);const{props:i,children:r}=n.vnode,s=Bv(n);hb(n,i,s,e),_b(n,r,t||e);const o=s?Fb(n,e):void 0;return e&&Vh(!1),o}function Fb(n,e){const t=n.type;n.accessCache=Object.create(null),n.proxy=new Proxy(n.ctx,KM);const{setup:i}=t;if(i){Yr();const r=n.setupContext=i.length>1?Bb(n):null,s=tc(n),o=Ql(i,n,0,[n.props,r]),a=Mp(o);if(jr(),s(),(a||n.sp)&&!co(n)&&Ip(n),a){if(o.then(Gh,Gh),e)return o.then(l=>{Wh(n,l)}).catch(l=>{Oa(l,n,0)});n.asyncDep=o}else Wh(n,o)}else kv(n)}function Wh(n,e,t){et(e)?n.type.__ssrInlineRender?n.ssrRender=e:n.render=e:Tt(e)&&(n.setupState=j0(e)),kv(n)}function kv(n,e,t){const i=n.type;n.render||(n.render=i.render||gr);{const r=tc(n);Yr();try{JM(n)}finally{jr(),r()}}}const Ob={get(n,e){return Hn(n,"get",""),n[e]}};function Bb(n){const e=t=>{n.exposed=t||{}};return{attrs:new Proxy(n.attrs,Ob),slots:n.slots,emit:n.emit,expose:e}}function Bp(n){return n.exposed?n.exposeProxy||(n.exposeProxy=new Proxy(j0(dM(n.exposed)),{get(e,t){if(t in e)return e[t];if(t in pl)return pl[t](n)},has(e,t){return t in e||t in pl}})):n.proxy}function kb(n,e=!0){return et(n)?n.displayName||n.name:n.name||e&&n.__name}function Hb(n){return et(n)&&"__vccOpts"in n}const nc=(n,e)=>EM(n,e,Ta);function Cs(n,e,t){try{Tu(-1);const i=arguments.length;return i===2?Tt(e)&&!Ze(e)?Ea(e)?Ct(n,null,[e]):Ct(n,e):Ct(n,null,e):(i>3?t=Array.prototype.slice.call(arguments,2):i===3&&Ea(t)&&(t=[t]),Ct(n,e,t))}finally{Tu(1)}}const zb="3.5.34";let Xh;const o_=typeof window<"u"&&window.trustedTypes;if(o_)try{Xh=o_.createPolicy("vue",{createHTML:n=>n})}catch{}const Hv=Xh?n=>Xh.createHTML(n):n=>n,Vb="http://www.w3.org/2000/svg",Gb="http://www.w3.org/1998/Math/MathML",Ir=typeof document<"u"?document:null,a_=Ir&&Ir.createElement("template"),Wb={insert:(n,e,t)=>{e.insertBefore(n,t||null)},remove:n=>{const e=n.parentNode;e&&e.removeChild(n)},createElement:(n,e,t,i)=>{const r=e==="svg"?Ir.createElementNS(Vb,n):e==="mathml"?Ir.createElementNS(Gb,n):t?Ir.createElement(n,{is:t}):Ir.createElement(n);return n==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:n=>Ir.createTextNode(n),createComment:n=>Ir.createComment(n),setText:(n,e)=>{n.nodeValue=e},setElementText:(n,e)=>{n.textContent=e},parentNode:n=>n.parentNode,nextSibling:n=>n.nextSibling,querySelector:n=>Ir.querySelector(n),setScopeId(n,e){n.setAttribute(e,"")},insertStaticContent(n,e,t,i,r,s){const o=t?t.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),t),!(r===s||!(r=r.nextSibling)););else{a_.innerHTML=Hv(i==="svg"?`<svg>${n}</svg>`:i==="mathml"?`<math>${n}</math>`:n);const a=a_.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,t)}return[o?o.nextSibling:e.firstChild,t?t.previousSibling:e.lastChild]}},Xb=Symbol("_vtc");function $b(n,e,t){const i=n[Xb];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?n.removeAttribute("class"):t?n.setAttribute("class",e):n.className=e}const l_=Symbol("_vod"),qb=Symbol("_vsh"),Yb=Symbol(""),jb=/(?:^|;)\s*display\s*:/;function Kb(n,e,t){const i=n.style,r=kt(t);let s=!1;if(t&&!r){if(e)if(kt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();t[a]==null&&nl(i,a,"")}else for(const o in e)t[o]==null&&nl(i,o,"");for(const o in t){o==="display"&&(s=!0);const a=t[o];a!=null?Jb(n,o,!kt(e)&&e?e[o]:void 0,a)||nl(i,o,a):nl(i,o,"")}}else if(r){if(e!==t){const o=i[Yb];o&&(t+=";"+o),i.cssText=t,s=jb.test(t)}}else e&&n.removeAttribute("style");l_ in n&&(n[l_]=s?i.display:"",n[qb]&&(i.display="none"))}const c_=/\s*!important$/;function nl(n,e,t){if(Ze(t))t.forEach(i=>nl(n,e,i));else if(t==null&&(t=""),e.startsWith("--"))n.setProperty(e,t);else{const i=Zb(n,e);c_.test(t)?n.setProperty(ks(i),t.replace(c_,""),"important"):n[i]=t}}const u_=["Webkit","Moz","ms"],Pf={};function Zb(n,e){const t=Pf[e];if(t)return t;let i=Gn(e);if(i!=="filter"&&i in n)return Pf[e]=i;i=Ju(i);for(let r=0;r<u_.length;r++){const s=u_[r]+i;if(s in n)return Pf[e]=s}return e}function Jb(n,e,t,i){return n.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&kt(i)&&t===i}const f_="http://www.w3.org/1999/xlink";function h_(n,e,t,i,r,s=WS(e)){i&&e.startsWith("xlink:")?t==null?n.removeAttributeNS(f_,e.slice(6,e.length)):n.setAttributeNS(f_,e,t):t==null||s&&!P0(t)?n.removeAttribute(e):n.setAttribute(e,s?"":Ci(t)?String(t):t)}function d_(n,e,t,i,r){if(e==="innerHTML"||e==="textContent"){t!=null&&(n[e]=e==="innerHTML"?Hv(t):t);return}const s=n.tagName;if(e==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?n.getAttribute("value")||"":n.value,l=t==null?n.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in n))&&(n.value=l),t==null&&n.removeAttribute(e),n._value=t;return}let o=!1;if(t===""||t==null){const a=typeof n[e];a==="boolean"?t=P0(t):t==null&&a==="string"?(t="",o=!0):a==="number"&&(t=0,o=!0)}try{n[e]=t}catch{}o&&n.removeAttribute(r||e)}function Qb(n,e,t,i){n.addEventListener(e,t,i)}function eE(n,e,t,i){n.removeEventListener(e,t,i)}const p_=Symbol("_vei");function tE(n,e,t,i,r=null){const s=n[p_]||(n[p_]={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=nE(e);if(i){const c=s[e]=sE(i,r);Qb(n,a,c,l)}else o&&(eE(n,a,o,l),s[e]=void 0)}}const m_=/(?:Once|Passive|Capture)$/;function nE(n){let e;if(m_.test(n)){e={};let i;for(;i=n.match(m_);)n=n.slice(0,n.length-i[0].length),e[i[0].toLowerCase()]=!0}return[n[2]===":"?n.slice(3):ks(n.slice(2)),e]}let Df=0;const iE=Promise.resolve(),rE=()=>Df||(iE.then(()=>Df=0),Df=Date.now());function sE(n,e){const t=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=t.attached)return;Mr(oE(i,t.value),e,5,[i])};return t.value=n,t.attached=rE(),t}function oE(n,e){if(Ze(e)){const t=n.stopImmediatePropagation;return n.stopImmediatePropagation=()=>{t.call(n),n._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const __=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&n.charCodeAt(2)>96&&n.charCodeAt(2)<123,aE=(n,e,t,i,r,s)=>{const o=r==="svg";e==="class"?$b(n,i,o):e==="style"?Kb(n,t,i):Kl(e)?ju(e)||tE(n,e,t,i,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):lE(n,e,i,o))?(d_(n,e,i),!n.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&h_(n,e,i,o,s,e!=="value")):n._isVueCE&&(cE(n,e)||n._def.__asyncLoader&&(/[A-Z]/.test(e)||!kt(i)))?d_(n,Gn(e),i,s,e):(e==="true-value"?n._trueValue=i:e==="false-value"&&(n._falseValue=i),h_(n,e,i,o))};function lE(n,e,t,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in n&&__(e)&&et(t));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&n.tagName==="IFRAME"||e==="form"||e==="list"&&n.tagName==="INPUT"||e==="type"&&n.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=n.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return __(e)&&kt(t)?!1:e in n}function cE(n,e){const t=n._def.props;if(!t)return!1;const i=Gn(e);return Array.isArray(t)?t.some(r=>Gn(r)===i):Object.keys(t).some(r=>Gn(r)===i)}const zv=wn({patchProp:aE},Wb);let gl,g_=!1;function uE(){return gl||(gl=vb(zv))}function fE(){return gl=g_?gl:xb(zv),g_=!0,gl}const hE=((...n)=>{const e=uE().createApp(...n),{mount:t}=e;return e.mount=i=>{const r=Gv(i);if(!r)return;const s=e._component;!et(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=t(r,!1,Vv(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e}),dE=((...n)=>{const e=fE().createApp(...n),{mount:t}=e;return e.mount=i=>{const r=Gv(i);if(r)return t(r,!0,Vv(r))},e});function Vv(n){if(n instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&n instanceof MathMLElement)return"mathml"}function Gv(n){return kt(n)?document.querySelector(n):n}const pE=/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,mE=/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,_E=/^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;function gE(n,e){if(n==="__proto__"||n==="constructor"&&e&&typeof e=="object"&&"prototype"in e){vE(n);return}return e}function vE(n){console.warn(`[destr] Dropping "${n}" key to prevent prototype pollution.`)}function xE(n,e={}){if(typeof n!="string")return n;if(n[0]==='"'&&n[n.length-1]==='"'&&n.indexOf("\\")===-1)return n.slice(1,-1);const t=n.trim();if(t.length<=9)switch(t.toLowerCase()){case"true":return!0;case"false":return!1;case"undefined":return;case"null":return null;case"nan":return Number.NaN;case"infinity":return Number.POSITIVE_INFINITY;case"-infinity":return Number.NEGATIVE_INFINITY}if(!_E.test(n)){if(e.strict)throw new SyntaxError("[destr] Invalid JSON");return n}try{if(pE.test(n)||mE.test(n)){if(e.strict)throw new Error("[destr] Possible prototype pollution");return JSON.parse(n,gE)}return JSON.parse(n)}catch(i){if(e.strict)throw i;return n}}const Wv=/#/g,Xv=/&/g,yE=/\//g,SE=/=/g,ME=/\?/g,cf=/\+/g,bE=/%5e/gi,EE=/%60/gi,TE=/%7c/gi,wE=/%20/gi,AE=/%2f/gi,RE=/%252f/gi;function $v(n){return encodeURI(""+n).replace(TE,"|")}function $h(n){return $v(typeof n=="string"?n:JSON.stringify(n)).replace(cf,"%2B").replace(wE,"+").replace(Wv,"%23").replace(Xv,"%26").replace(EE,"`").replace(bE,"^").replace(yE,"%2F")}function Lf(n){return $h(n).replace(SE,"%3D")}function CE(n){return $v(n).replace(Wv,"%23").replace(ME,"%3F").replace(RE,"%2F").replace(Xv,"%26").replace(cf,"%2B")}function Fl(n=""){try{return decodeURIComponent(""+n)}catch{return""+n}}function PE(n){return Fl(n.replace(AE,"%252F"))}function DE(n){return Fl(n.replace(cf," "))}function LE(n){return Fl(n.replace(cf," "))}function kp(n=""){const e=Object.create(null);n[0]==="?"&&(n=n.slice(1));for(const t of n.split("&")){const i=t.match(/([^=]+)=?(.*)/)||[];if(i.length<2)continue;const r=DE(i[1]);if(r==="__proto__"||r==="constructor")continue;const s=LE(i[2]||"");e[r]===void 0?e[r]=s:Array.isArray(e[r])?e[r].push(s):e[r]=[e[r],s]}return e}function IE(n,e){return(typeof e=="number"||typeof e=="boolean")&&(e=String(e)),e?Array.isArray(e)?e.map(t=>`${Lf(n)}=${$h(t)}`).join("&"):`${Lf(n)}=${$h(e)}`:Lf(n)}function qv(n){return Object.keys(n).filter(e=>n[e]!==void 0).map(e=>IE(e,n[e])).filter(Boolean).join("&")}const NE=/^[\s\w\0+.-]{2,}:([/\\]{1,2})/,UE=/^[\s\w\0+.-]{2,}:([/\\]{2})?/,FE=/^([/\\]\s*){2,}[^/\\]/,OE=/^[\s\0]*(blob|data|javascript|vbscript):$/i,BE=/\/$|\/\?|\/#/,kE=/^\.?\//;function ka(n,e={}){return typeof e=="boolean"&&(e={acceptRelative:e}),e.strict?NE.test(n):UE.test(n)||(e.acceptRelative?FE.test(n):!1)}function HE(n){return!!n&&OE.test(n)}function qh(n="",e){return e?BE.test(n):n.endsWith("/")}function Yv(n="",e){if(!e)return(qh(n)?n.slice(0,-1):n)||"/";if(!qh(n,!0))return n||"/";let t=n,i="";const r=n.indexOf("#");r!==-1&&(t=n.slice(0,r),i=n.slice(r));const[s,...o]=t.split("?");return((s.endsWith("/")?s.slice(0,-1):s)||"/")+(o.length>0?`?${o.join("?")}`:"")+i}function Yh(n="",e){if(!e)return n.endsWith("/")?n:n+"/";if(qh(n,!0))return n||"/";let t=n,i="";const r=n.indexOf("#");if(r!==-1&&(t=n.slice(0,r),i=n.slice(r),!t))return i;const[s,...o]=t.split("?");return s+"/"+(o.length>0?`?${o.join("?")}`:"")+i}function zE(n=""){return n.startsWith("/")}function v_(n=""){return zE(n)?n:"/"+n}function VE(n,e){if(Kv(e)||ka(n))return n;const t=Yv(e);if(n.startsWith(t)){const i=n[t.length];if(!i||i==="/"||i==="?")return n}return uf(t,n)}function GE(n,e){if(Kv(e))return n;const t=Yv(e);if(!n.startsWith(t))return n;const i=n[t.length];return i&&i!=="/"&&i!=="?"?n:"/"+n.slice(t.length).replace(/^\/+/,"")}function jv(n,e){const t=Hp(n),i={...kp(t.search),...e};return t.search=qv(i),Qv(t)}function Kv(n){return!n||n==="/"}function WE(n){return n&&n!=="/"}function uf(n,...e){let t=n||"";for(const i of e.filter(r=>WE(r)))if(t){const r=i.replace(kE,"");t=Yh(t)+r}else t=i;return t}function Zv(...n){const e=/\/(?!\/)/,t=n.filter(Boolean),i=[];let r=0;for(const o of t)if(!(!o||o==="/")){for(const[a,l]of o.split(e).entries())if(!(!l||l===".")){if(l===".."){if(i.length===1&&ka(i[0]))continue;i.pop(),r--;continue}if(a===1&&i[i.length-1]?.endsWith(":/")){i[i.length-1]+="/"+l;continue}i.push(l),r++}}let s=i.join("/");return r>=0?t[0]?.startsWith("/")&&!s.startsWith("/")?s="/"+s:t[0]?.startsWith("./")&&!s.startsWith("./")&&(s="./"+s):s="../".repeat(-1*r)+s,t[t.length-1]?.endsWith("/")&&!s.endsWith("/")&&(s+="/"),s}function XE(n,e,t={}){return t.trailingSlash||(n=Yh(n),e=Yh(e)),t.leadingSlash||(n=v_(n),e=v_(e)),t.encoding||(n=Fl(n),e=Fl(e)),n===e}const Jv=Symbol.for("ufo:protocolRelative");function Hp(n="",e){const t=n.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);if(t){const[,d,f=""]=t;return{protocol:d.toLowerCase(),pathname:f,href:d+f,auth:"",host:"",search:"",hash:""}}if(!ka(n,{acceptRelative:!0}))return x_(n);const[,i="",r,s=""]=n.replace(/\\/g,"/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/)||[];let[,o="",a=""]=s.match(/([^#/?]*)(.*)?/)||[];i==="file:"&&(a=a.replace(/\/(?=[A-Za-z]:)/,""));const{pathname:l,search:c,hash:u}=x_(a);return{protocol:i.toLowerCase(),auth:r?r.slice(0,Math.max(0,r.length-1)):"",host:o,pathname:l,search:c,hash:u,[Jv]:!i}}function x_(n=""){const[e="",t="",i=""]=(n.match(/([^#?]*)(\?[^#]*)?(#.*)?/)||[]).splice(1);return{pathname:e,search:t,hash:i}}function Qv(n){const e=n.pathname||"",t=n.search?(n.search.startsWith("?")?"":"?")+n.search:"",i=n.hash||"",r=n.auth?n.auth+"@":"",s=n.host||"";return(n.protocol||n[Jv]?(n.protocol||"")+"//":"")+r+s+e+t+i}class $E extends Error{constructor(e,t){super(e,t),this.name="FetchError",t?.cause&&!this.cause&&(this.cause=t.cause)}}function qE(n){const e=n.error?.message||n.error?.toString()||"",t=n.request?.method||n.options?.method||"GET",i=n.request?.url||String(n.request)||"/",r=`[${t}] ${JSON.stringify(i)}`,s=n.response?`${n.response.status} ${n.response.statusText}`:"<no response>",o=`${r}: ${s}${e?` ${e}`:""}`,a=new $E(o,n.error?{cause:n.error}:void 0);for(const l of["request","options","response"])Object.defineProperty(a,l,{get(){return n[l]}});for(const[l,c]of[["data","_data"],["status","status"],["statusCode","status"],["statusText","statusText"],["statusMessage","statusText"]])Object.defineProperty(a,l,{get(){return n.response&&n.response[c]}});return a}const YE=new Set(Object.freeze(["PATCH","POST","PUT","DELETE"]));function y_(n="GET"){return YE.has(n.toUpperCase())}function jE(n){if(n===void 0)return!1;const e=typeof n;return e==="string"||e==="number"||e==="boolean"||e===null?!0:e!=="object"?!1:Array.isArray(n)?!0:n.buffer||n instanceof FormData||n instanceof URLSearchParams?!1:n.constructor&&n.constructor.name==="Object"||typeof n.toJSON=="function"}const KE=new Set(["image/svg","application/xml","application/xhtml","application/html"]),ZE=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function JE(n=""){if(!n)return"json";const e=n.split(";").shift()||"";return ZE.test(e)?"json":e==="text/event-stream"?"stream":KE.has(e)||e.startsWith("text/")?"text":"blob"}function QE(n,e,t,i){const r=eT(e?.headers??n?.headers,t?.headers,i);let s;return(t?.query||t?.params||e?.params||e?.query)&&(s={...t?.params,...t?.query,...e?.params,...e?.query}),{...t,...e,query:s,params:s,headers:r}}function eT(n,e,t){if(!e)return new t(n);const i=new t(e);if(n)for(const[r,s]of Symbol.iterator in n||Array.isArray(n)?n:new t(n))i.set(r,s);return i}async function pc(n,e){if(e)if(Array.isArray(e))for(const t of e)await t(n);else await e(n)}const tT=new Set([408,409,425,429,500,502,503,504]),nT=new Set([101,204,205,304]);function ex(n={}){const{fetch:e=globalThis.fetch,Headers:t=globalThis.Headers,AbortController:i=globalThis.AbortController}=n;async function r(a){const l=a.error&&a.error.name==="AbortError"&&!a.options.timeout||!1;if(a.options.retry!==!1&&!l){let u;typeof a.options.retry=="number"?u=a.options.retry:u=y_(a.options.method)?0:1;const d=a.response&&a.response.status||500;if(u>0&&(Array.isArray(a.options.retryStatusCodes)?a.options.retryStatusCodes.includes(d):tT.has(d))){const f=typeof a.options.retryDelay=="function"?a.options.retryDelay(a):a.options.retryDelay||0;return f>0&&await new Promise(h=>setTimeout(h,f)),s(a.request,{...a.options,retry:u-1})}}const c=qE(a);throw Error.captureStackTrace&&Error.captureStackTrace(c,s),c}const s=async function(l,c={}){const u={request:l,options:QE(l,c,n.defaults,t),response:void 0,error:void 0};if(u.options.method&&(u.options.method=u.options.method.toUpperCase()),u.options.onRequest&&(await pc(u,u.options.onRequest),u.options.headers instanceof t||(u.options.headers=new t(u.options.headers||{}))),typeof u.request=="string"&&(u.options.baseURL&&(u.request=VE(u.request,u.options.baseURL)),u.options.query&&(u.request=jv(u.request,u.options.query),delete u.options.query),"query"in u.options&&delete u.options.query,"params"in u.options&&delete u.options.params),u.options.body&&y_(u.options.method))if(jE(u.options.body)){const h=u.options.headers.get("content-type");typeof u.options.body!="string"&&(u.options.body=h==="application/x-www-form-urlencoded"?new URLSearchParams(u.options.body).toString():JSON.stringify(u.options.body)),h||u.options.headers.set("content-type","application/json"),u.options.headers.has("accept")||u.options.headers.set("accept","application/json")}else("pipeTo"in u.options.body&&typeof u.options.body.pipeTo=="function"||typeof u.options.body.pipe=="function")&&("duplex"in u.options||(u.options.duplex="half"));let d;if(!u.options.signal&&u.options.timeout){const h=new i;d=setTimeout(()=>{const p=new Error("[TimeoutError]: The operation was aborted due to timeout");p.name="TimeoutError",p.code=23,h.abort(p)},u.options.timeout),u.options.signal=h.signal}try{u.response=await e(u.request,u.options)}catch(h){return u.error=h,u.options.onRequestError&&await pc(u,u.options.onRequestError),await r(u)}finally{d&&clearTimeout(d)}if((u.response.body||u.response._bodyInit)&&!nT.has(u.response.status)&&u.options.method!=="HEAD"){const h=(u.options.parseResponse?"json":u.options.responseType)||JE(u.response.headers.get("content-type")||"");switch(h){case"json":{const p=await u.response.text(),m=u.options.parseResponse||xE;u.response._data=m(p);break}case"stream":{u.response._data=u.response.body||u.response._bodyInit;break}default:u.response._data=await u.response[h]()}}return u.options.onResponse&&await pc(u,u.options.onResponse),!u.options.ignoreResponseError&&u.response.status>=400&&u.response.status<600?(u.options.onResponseError&&await pc(u,u.options.onResponseError),await r(u)):u.response},o=async function(l,c){return(await s(l,c))._data};return o.raw=s,o.native=(...a)=>e(...a),o.create=(a={},l={})=>ex({...n,...l,defaults:{...n.defaults,...l.defaults,...a}}),o}const Au=(function(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")})(),iT=Au.fetch?(...n)=>Au.fetch(...n):()=>Promise.reject(new Error("[ofetch] global.fetch is not supported!")),rT=Au.Headers,sT=Au.AbortController,oT=ex({fetch:iT,Headers:rT,AbortController:sT}),aT=oT,lT=()=>window?.__NUXT__?.config||window?.useNuxtApp?.().payload?.config,zp=()=>lT().app,cT=()=>zp().baseURL,uT=()=>zp().buildAssetsDir,Vp=(...n)=>Zv(tx(),uT(),...n),tx=(...n)=>{const e=zp(),t=e.cdnURL||e.baseURL;return n.length?Zv(t,...n):t};globalThis.__buildAssetsURL=Vp,globalThis.__publicAssetsURL=tx;globalThis.$fetch||(globalThis.$fetch=aT.create({baseURL:cT()}));"global"in globalThis||(globalThis.global=globalThis);function jh(n,e={},t){for(const i in n){const r=n[i],s=t?`${t}:${i}`:i;typeof r=="object"&&r!==null?jh(r,e,s):typeof r=="function"&&(e[s]=r)}return e}const nx=(()=>{if(console.createTask)return console.createTask;const n={run:e=>e()};return()=>n})();function ix(n,e,t,i){for(let r=t;r<n.length;r+=1)try{const s=i?i.run(()=>n[r](...e)):n[r](...e);if(s&&typeof s.then=="function")return Promise.resolve(s).then(()=>ix(n,e,r+1,i))}catch(s){return Promise.reject(s)}}function fT(n,e,t){if(n.length>0)return ix(n,e,0,nx(t))}function hT(n,e,t){if(n.length>0){const i=nx(t);return Promise.all(n.map(r=>i.run(()=>r(...e))))}}function If(n,e){for(const t of[...n])t(e)}var dT=class{_hooks;_before;_after;_deprecatedHooks;_deprecatedMessages;constructor(){this._hooks={},this._before=void 0,this._after=void 0,this._deprecatedMessages=void 0,this._deprecatedHooks={},this.hook=this.hook.bind(this),this.callHook=this.callHook.bind(this),this.callHookWith=this.callHookWith.bind(this)}hook(n,e,t={}){if(!n||typeof e!="function")return()=>{};const i=n;let r;for(;this._deprecatedHooks[n];)r=this._deprecatedHooks[n],n=r.to;if(r&&!t.allowDeprecated){let s=r.message;s||(s=`${i} hook has been deprecated`+(r.to?`, please use ${r.to}`:"")),this._deprecatedMessages||(this._deprecatedMessages=new Set),this._deprecatedMessages.has(s)||(console.warn(s),this._deprecatedMessages.add(s))}if(!e.name)try{Object.defineProperty(e,"name",{get:()=>"_"+n.replace(/\W+/g,"_")+"_hook_cb",configurable:!0})}catch{}return this._hooks[n]=this._hooks[n]||[],this._hooks[n].push(e),()=>{e&&(this.removeHook(n,e),e=void 0)}}hookOnce(n,e){let t,i=(...r)=>(typeof t=="function"&&t(),t=void 0,i=void 0,e(...r));return t=this.hook(n,i),t}removeHook(n,e){const t=this._hooks[n];if(t){const i=t.indexOf(e);i!==-1&&t.splice(i,1),t.length===0&&(this._hooks[n]=void 0)}}clearHook(n){this._hooks[n]=void 0}deprecateHook(n,e){this._deprecatedHooks[n]=typeof e=="string"?{to:e}:e;const t=this._hooks[n]||[];this._hooks[n]=void 0;for(const i of t)this.hook(n,i)}deprecateHooks(n){for(const e in n)this.deprecateHook(e,n[e])}addHooks(n){const e=jh(n),t=Object.keys(e).map(i=>this.hook(i,e[i]));return()=>{for(const i of t)i();t.length=0}}removeHooks(n){const e=jh(n);for(const t in e)this.removeHook(t,e[t])}removeAllHooks(){this._hooks={}}callHook(n,...e){return this.callHookWith(fT,n,e)}callHookParallel(n,...e){return this.callHookWith(hT,n,e)}callHookWith(n,e,t){const i=this._before||this._after?{name:e,args:t,context:{}}:void 0;this._before&&If(this._before,i);const r=n(this._hooks[e]?[...this._hooks[e]]:[],t,e);return r instanceof Promise?r.finally(()=>{this._after&&i&&If(this._after,i)}):(this._after&&i&&If(this._after,i),r)}beforeEach(n){return this._before=this._before||[],this._before.push(n),()=>{if(this._before!==void 0){const e=this._before.indexOf(n);e!==-1&&this._before.splice(e,1)}}}afterEach(n){return this._after=this._after||[],this._after.push(n),()=>{if(this._after!==void 0){const e=this._after.indexOf(n);e!==-1&&this._after.splice(e,1)}}}};function rx(){return new dT}function pT(n={}){let e,t=!1;const i=o=>{if(e&&e!==o)throw new Error("Context conflict")};let r;if(n.asyncContext){const o=n.AsyncLocalStorage||globalThis.AsyncLocalStorage;o?r=new o:console.warn("[unctx] `AsyncLocalStorage` is not provided.")}const s=()=>{if(r){const o=r.getStore();if(o!==void 0)return o}return e};return{use:()=>{const o=s();if(o===void 0)throw new Error("Context is not available");return o},tryUse:()=>s(),set:(o,a)=>{a||i(o),e=o,t=!0},unset:()=>{e=void 0,t=!1},call:(o,a)=>{i(o),e=o;try{return r?r.run(o,a):a()}finally{t||(e=void 0)}},async callAsync(o,a){e=o;const l=()=>{e=o},c=()=>e===o?l:void 0;Kh.add(c);try{const u=r?r.run(o,a):a();return t||(e=void 0),await u}finally{Kh.delete(c)}}}}function mT(n={}){const e={};return{get(t,i={}){return e[t]||(e[t]=pT({...n,...i})),e[t]}}}const Ru=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof global<"u"?global:typeof window<"u"?window:{},S_="__unctx__",_T=Ru[S_]||(Ru[S_]=mT()),gT=(n,e={})=>_T.get(n,e),M_="__unctx_async_handlers__",Kh=Ru[M_]||(Ru[M_]=new Set);function vT(n){const e=[];for(const r of Kh){const s=r();s&&e.push(s)}const t=()=>{for(const r of e)r()};let i=n();return i&&typeof i=="object"&&"catch"in i&&(i=i.catch(r=>{throw t(),r})),[i,t]}const b_={id:"__nuxt-loader"},xT=!0,nI={componentName:"NuxtLink",prefetch:!0,prefetchOn:{visibility:!0}},yT="#__nuxt",sx="nuxt-app",E_=36e5,ST="vite:preloadError";function ox(n=sx){return gT(n,{asyncContext:!1})}const MT="__nuxt_plugin";function bT(n){let e=0;const t={_id:n.id||sx||"nuxt-app",_scope:$S(),provide:void 0,versions:{get nuxt(){return"4.4.5"},get vue(){return t.vueApp.version}},payload:eo({...n.ssrContext?.payload||{},data:eo({}),state:Is({}),once:new Set,_errors:eo({})}),static:{data:{}},runWithContext(r){return t._scope.active&&!Ep()?t._scope.run(()=>T_(t,r)):T_(t,r)},isHydrating:!0,deferHydration(){if(!t.isHydrating)return()=>{};e++;let r=!1;return()=>{if(!r&&(r=!0,e--,e===0))return t.isHydrating=!1,t.callHook("app:suspense:resolve")}},_asyncDataPromises:{},_asyncData:eo({}),_state:eo({}),_payloadRevivers:{},...n};{const r=window.__NUXT__;if(r)for(const s in r)switch(s){case"data":case"state":case"_errors":Object.assign(t.payload[s],r[s]);break;default:t.payload[s]=r[s]}}t.hooks=rx(),t.hook=t.hooks.hook;{const r=t.hooks.callHook;t.hooks.callHook=(s,...o)=>Promise.resolve().then(()=>r(s,...o))}t.callHook=t.hooks.callHook,t.provide=(r,s)=>{const o="$"+r;mc(t,o,s),mc(t.vueApp.config.globalProperties,o,s)},mc(t.vueApp,"$nuxt",t),mc(t.vueApp.config.globalProperties,"$nuxt",t);{window.addEventListener(ST,s=>{t.callHook("app:chunkError",{error:s.payload}),s.payload.message.includes("Unable to preload CSS")&&s.preventDefault()}),window.useNuxtApp||=An;const r=t.hook("app:error",(...s)=>{console.error("[nuxt] error caught during app initialization",...s)});t.hook("app:mounted",r)}const i=t.payload.config;return t.provide("config",i),t}function ET(n,e){e.hooks&&n.hooks.addHooks(e.hooks)}async function TT(n,e){if(typeof e=="function"){const{provide:t}=await n.runWithContext(()=>e(n))||{};if(t&&typeof t=="object")for(const i in t)n.provide(i,t[i])}}async function wT(n,e){const t=new Set,i=[],r=[];let s,o=0;async function a(l){const c=l.dependsOn?.filter(u=>e.some(d=>d._name===u)&&!t.has(u))??[];if(c.length>0)i.push([new Set(c),l]);else{const u=TT(n,l).then(async()=>{l._name&&(t.add(l._name),await Promise.all(i.map(async([d,f])=>{d.has(l._name)&&(d.delete(l._name),d.size===0&&(o++,await a(f)))})))}).catch(d=>{if(!l.parallel&&!n.payload.error)throw d;s||=d});l.parallel?r.push(u):await u}}for(const l of e)ET(n,l);for(const l of e)await a(l);if(await Promise.all(r),o)for(let l=0;l<o;l++)await Promise.all(r);if(s)throw n.payload.error||s}function Hs(n){if(typeof n=="function")return n;const e=n._name||n.name;return delete n.name,Object.assign(n.setup||(()=>{}),n,{[MT]:!0,_name:e})}function T_(n,e,t){const i=()=>e();return ox(n._id).set(n),n.vueApp.runWithContext(i)}function AT(n){let e;return rf()&&(e=Ba()?.appContext.app.$nuxt),e||=ox(n).tryUse(),e||null}function An(n){const e=AT(n);if(!e)throw new Error("[nuxt] instance unavailable");return e}function wa(n){return An().$config}function mc(n,e,t){Object.defineProperty(n,e,{get:()=>t})}function Nf(n){if(n===null||typeof n!="object")return!1;const e=Object.getPrototypeOf(n);return e!==null&&e!==Object.prototype&&Object.getPrototypeOf(e)!==null||Symbol.iterator in n?!1:Symbol.toStringTag in n?Object.prototype.toString.call(n)==="[object Module]":!0}function Zh(n,e,t=".",i){if(!Nf(e))return Zh(n,{},t,i);const r={...e};for(const s of Object.keys(n)){if(s==="__proto__"||s==="constructor")continue;const o=n[s];o!=null&&(i&&i(r,s,o,t)||(Array.isArray(o)&&Array.isArray(r[s])?r[s]=[...o,...r[s]]:Nf(o)&&Nf(r[s])?r[s]=Zh(o,r[s],(t?`${t}.`:"")+s.toString(),i):r[s]=o))}return r}function RT(n){return(...e)=>e.reduce((t,i)=>Zh(t,i,"",n),{})}const CT=RT();function PT(n,e){try{return e in n}catch{return!1}}class w_ extends Error{static __h3_error__=!0;statusCode=500;fatal=!1;unhandled=!1;statusMessage;data;cause;constructor(e,t={}){super(e,t),t.cause&&!this.cause&&(this.cause=t.cause)}toJSON(){const e={message:this.message,statusCode:Jh(this.statusCode,500)};return this.statusMessage&&(e.statusMessage=ax(this.statusMessage)),this.data!==void 0&&(e.data=this.data),e}}function DT(n){if(typeof n=="string")return new w_(n);if(LT(n))return n;const e=new w_(n.message??n.statusMessage??"",{cause:n.cause||n});if(PT(n,"stack"))try{Object.defineProperty(e,"stack",{get(){return n.stack}})}catch{try{e.stack=n.stack}catch{}}if(n.data&&(e.data=n.data),n.statusCode?e.statusCode=Jh(n.statusCode,e.statusCode):n.status&&(e.statusCode=Jh(n.status,e.statusCode)),n.statusMessage?e.statusMessage=n.statusMessage:n.statusText&&(e.statusMessage=n.statusText),e.statusMessage){const t=e.statusMessage;ax(e.statusMessage)!==t&&console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.")}return n.fatal!==void 0&&(e.fatal=n.fatal),n.unhandled!==void 0&&(e.unhandled=n.unhandled),e}function LT(n){return n?.constructor?.__h3_error__===!0}const IT=/[^\u0009\u0020-\u007E]/g;function ax(n=""){return n.replace(IT,"")}function Jh(n,e=200){return!n||(typeof n=="string"&&(n=Number.parseInt(n,10)),n<100||n>999)?e:n}const lx=Symbol("route");import.meta.url.replace(/\/app\/.*$/,"/");const So=()=>An()?.$router,Gp=()=>rf()?lo(lx,An()._route):An()._route;const NT=()=>{try{if(An()._processingMiddleware)return!0}catch{return!1}return!1},UT=(n,e)=>{n||="/";const t=typeof n=="string"?n:"path"in n?FT(n):So().resolve(n).href;if(e?.open){const{target:c="_blank",windowFeatures:u={}}=e.open,d=[];for(const[f,h]of Object.entries(u))h!==void 0&&d.push(`${f.toLowerCase()}=${h}`);return open(t,c,d.join(", ")),Promise.resolve()}const i=ka(t,{acceptRelative:!0}),r=e?.external||i;if(r){if(!e?.external)throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");const{protocol:c}=new URL(t,window.location.href);if(c&&HE(c))throw new Error(`Cannot navigate to a URL with '${c}' protocol.`)}const s=NT();if(!r&&s){if(e?.replace){if(typeof n=="string"){const{pathname:c,search:u,hash:d}=Hp(n);return{path:c,...u&&{query:kp(u)},...d&&{hash:d},replace:!0}}return{...n,replace:!0}}return n}const o=So(),a=An();if(r)return a._scope.stop(),e?.replace?location.replace(t):location.href=t,s?a.isHydrating?new Promise(()=>{}):!1:Promise.resolve();const l=typeof n=="string"?OT(n):n;return e?.replace?o.replace(l):o.push(l)};function FT(n){return jv(n.path||"",n.query||{})+(n.hash||"")}function OT(n){const e=Hp(n);return CE(PE(e.pathname))+e.search+e.hash}const cx="__nuxt_error",Wp=()=>SM(An().payload,"error"),BT=n=>{const e=Xp(n);try{const t=Wp();An().hooks.callHook("app:error",e),t.value||=e}catch{throw e}return e},kT=async(n={})=>{const e=An(),t=Wp();e.callHook("app:error:cleared",n),n.redirect&&await So().replace(n.redirect),t.value=void 0},HT=n=>!!n&&typeof n=="object"&&cx in n,Xp=n=>{typeof n!="string"&&n.statusText&&(n.message??=n.statusText);const e=DT(n);return Object.defineProperty(e,cx,{value:!0,configurable:!1,writable:!1}),Object.defineProperty(e,"status",{get:()=>e.statusCode,configurable:!0}),Object.defineProperty(e,"statusText",{get:()=>e.statusMessage,configurable:!0}),e},zT=-1,VT=-2,GT=-3,WT=-4,XT=-5,$T=-6,qT=-7,ux=2**32-1,Qh=ux-1;function YT(n){return!(!Number.isInteger(n)||n<0||n>Qh)}function jT(n){return!(!Number.isInteger(n)||n<0||n>ux)}function KT(n){return Uint8Array.fromBase64(n).buffer}function ZT(n){return Uint8Array.from(Buffer.from(n,"base64")).buffer}function JT(n){const e=atob(n),t=e.length,i=new Uint8Array(t);for(let r=0;r<t;r++)i[r]=e.charCodeAt(r);return i.buffer}const QT=typeof Uint8Array.fromBase64=="function",e1=typeof process=="object"&&process.versions?.node!==void 0,t1=QT?KT:e1?ZT:JT;function n1(n,e){return i1(JSON.parse(n),e)}function i1(n,e){if(typeof n=="number")return s(n,!0);if(!Array.isArray(n)||n.length===0)throw new Error("Invalid input");const t=n,i=Array(t.length);let r=null;function s(o,a=!1){if(o===zT)return;if(o===GT)return NaN;if(o===WT)return 1/0;if(o===XT)return-1/0;if(o===$T)return-0;if(a||typeof o!="number")throw new Error("Invalid input");if(o in i)return i[o];const l=t[o];if(!l||typeof l!="object")i[o]=l;else if(Array.isArray(l))if(typeof l[0]=="string"){const c=l[0],u=e&&Object.hasOwn(e,c)?e[c]:void 0;if(u){let d=l[1];if(typeof d!="number"&&(d=t.push(l[1])-1),r??=new Set,r.has(d))throw new Error("Invalid circular reference");return r.add(d),i[o]=u(s(d)),r.delete(d),i[o]}switch(c){case"Date":i[o]=new Date(l[1]);break;case"Set":const d=new Set;i[o]=d;for(let p=1;p<l.length;p+=1)d.add(s(l[p]));break;case"Map":const f=new Map;i[o]=f;for(let p=1;p<l.length;p+=2)f.set(s(l[p]),s(l[p+1]));break;case"RegExp":i[o]=new RegExp(l[1],l[2]);break;case"Object":{const p=l[1];if(typeof t[p]=="object"&&t[p][0]!=="BigInt")throw new Error("Invalid input");i[o]=Object(s(p));break}case"BigInt":i[o]=BigInt(l[1]);break;case"null":const h=Object.create(null);i[o]=h;for(let p=1;p<l.length;p+=2){if(l[p]==="__proto__")throw new Error("Cannot parse an object with a `__proto__` property");h[l[p]]=s(l[p+1])}break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Float16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":case"DataView":{if(t[l[1]][0]!=="ArrayBuffer")throw new Error("Invalid data");const p=globalThis[c],m=s(l[1]);i[o]=l[2]!==void 0?new p(m,l[2],l[3]):new p(m);break}case"ArrayBuffer":{const p=l[1];if(typeof p!="string")throw new Error("Invalid ArrayBuffer encoding");const m=t1(p);i[o]=m;break}case"Temporal.Duration":case"Temporal.Instant":case"Temporal.PlainDate":case"Temporal.PlainTime":case"Temporal.PlainDateTime":case"Temporal.PlainMonthDay":case"Temporal.PlainYearMonth":case"Temporal.ZonedDateTime":{const p=c.slice(9);i[o]=Temporal[p].from(l[1]);break}case"URL":{const p=new URL(l[1]);i[o]=p;break}case"URLSearchParams":{const p=new URLSearchParams(l[1]);i[o]=p;break}default:throw new Error(`Unknown type ${c}`)}}else if(l[0]===qT){const c=l[1];if(!jT(c))throw new Error("Invalid input");const u=[];i[o]=u,u[Qh]=void 0,delete u[Qh];for(let d=2;d<l.length;d+=2){const f=l[d];if(!YT(f)||f>=c)throw new Error("Invalid input");u[f]=s(l[d+1])}u.length=c}else{const c=new Array(l.length);i[o]=c;for(let u=0;u<l.length;u+=1){const d=l[u];d!==VT&&(c[u]=s(d))}}else{const c={};i[o]=c;for(const u of Object.keys(l)){if(u==="__proto__")throw new Error("Cannot parse an object with a `__proto__` property");const d=l[u];c[u]=s(d)}}return i[o]}return s(0)}const r1=new Set(["link","style","script","noscript"]),s1=new Set(["title","titleTemplate","script","style","noscript"]),ed=new Set(["base","meta","link","style","script","noscript"]),o1=new Set(["title","base","htmlAttrs","bodyAttrs","meta","link","style","script","noscript"]),a1=new Set(["base","title","titleTemplate","bodyAttrs","htmlAttrs","templateParams"]),l1=new Set(["key","tagPosition","tagPriority","tagDuplicateStrategy","innerHTML","textContent","processTemplateParams"]),c1=new Set(["templateParams","htmlAttrs","bodyAttrs"]),$p=new Set(["theme-color","google-site-verification","og","article","book","profile","twitter","author"]),Ol={META:new Set(["twitter"]),OG:new Set(["og","book","article","profile","fb"]),MEDIA:new Set(["ogImage","ogVideo","ogAudio","twitterImage"]),HTTP_EQUIV:new Set(["contentType","defaultStyle","xUaCompatible"])},u1={articleExpirationTime:"article:expiration_time",articleModifiedTime:"article:modified_time",articlePublishedTime:"article:published_time",bookReleaseDate:"book:release_date",fbAppId:"fb:app_id",ogAudioSecureUrl:"og:audio:secure_url",ogAudioUrl:"og:audio",ogImageSecureUrl:"og:image:secure_url",ogImageUrl:"og:image",ogSiteName:"og:site_name",ogVideoSecureUrl:"og:video:secure_url",ogVideoUrl:"og:video",profileFirstName:"profile:first_name",profileLastName:"profile:last_name",profileUsername:"profile:username",msapplicationConfig:"msapplication-Config",msapplicationTileColor:"msapplication-TileColor",msapplicationTileImage:"msapplication-TileImage"},fx={appleItunesApp:{unpack:{entrySeparator:", ",resolve:({key:n,value:e})=>`${zr(n)}=${e}`}},refresh:{metaKey:"http-equiv",unpack:{entrySeparator:";",resolve:({key:n,value:e})=>n==="seconds"?`${e}`:void 0}},robots:{unpack:{entrySeparator:", ",resolve:({key:n,value:e})=>typeof e=="boolean"?zr(n):`${zr(n)}:${e}`}},contentSecurityPolicy:{metaKey:"http-equiv",unpack:{entrySeparator:"; ",resolve:({key:n,value:e})=>`${zr(n)} ${e}`}},charset:{}};function zr(n){const e=n.replace(/([A-Z])/g,"-$1").toLowerCase(),t=e.indexOf("-");return t===-1?e:Ol.META.has(e.slice(0,t))||Ol.OG.has(e.slice(0,t))?n.replace(/([A-Z])/g,":$1").toLowerCase():e}function hx(n){return Object.fromEntries(Object.entries(n).filter(([e,t])=>String(t)!=="false"&&e))}function td(n){return Array.isArray(n)?n.map(td):!n||typeof n!="object"?n:Object.fromEntries(Object.entries(n).map(([e,t])=>[zr(e),td(t)]))}function dx(n,e={}){const{entrySeparator:t="",keyValueSeparator:i="",wrapValue:r,resolve:s}=e;return Object.entries(n).map(([o,a])=>{if(s){const c=s({key:o,value:a});if(c!==void 0)return c}const l=typeof a=="object"?dx(a,e):typeof a=="number"?a.toString():typeof a=="string"&&r?`${r}${a.replace(new RegExp(r,"g"),`\\${r}`)}${r}`:a;return`${o}${i}${l}`}).join(t)}function A_(n,e){const t=hx(e),i=zr(n),r=px(i);if(!$p.has(i))return[{[r]:i,...t}];const s=Object.fromEntries(Object.entries(t).map(([o,a])=>[`${n}${o==="url"?"":`${o[0].toUpperCase()}${o.slice(1)}`}`,a]));return Cu(s||{}).sort((o,a)=>(o[r]?.length||0)-(a[r]?.length||0))}function px(n){if(fx[n]?.metaKey==="http-equiv"||Ol.HTTP_EQUIV.has(n))return"http-equiv";const e=zr(n),t=e.indexOf(":");return t===-1?"name":Ol.OG.has(e.slice(0,t))?"property":"name"}function f1(n){return u1[n]||zr(n)}function h1(n,e){return e==="refresh"?`${n.seconds};url=${n.url}`:dx(td(n),{keyValueSeparator:"=",entrySeparator:", ",resolve:({value:t,key:i})=>t===null?"":typeof t=="boolean"?i:void 0,...fx[e]?.unpack})}function Cu(n){const e=[],t={};for(const[r,s]of Object.entries(n)){if(Array.isArray(s)){if(r==="themeColor"){s.forEach(o=>{typeof o=="object"&&o!==null&&e.push({name:"theme-color",...o})});continue}for(const o of s)if(typeof o=="object"&&o!==null){const a=[],l=[];for(const[c,u]of Object.entries(o)){const d=`${r}${c==="url"?"":`:${c}`}`,f=Cu({[d]:u});(c==="url"?a:l).push(...f)}e.push(...a,...l)}else e.push(...typeof o=="string"?Cu({[r]:o}):A_(r,o));continue}if(typeof s=="object"&&s)if(Ol.MEDIA.has(r)){const o=r.startsWith("twitter")?"twitter":"og",a=r.replace(/^(og|twitter)/,"").toLowerCase(),l=o==="twitter"?"name":"property";s.url&&e.push({[l]:`${o}:${a}`,content:s.url}),s.secureUrl&&e.push({[l]:`${o}:${a}:secure_url`,content:s.secureUrl});for(const[c,u]of Object.entries(s))c!=="url"&&c!=="secureUrl"&&e.push({[l]:`${o}:${a}:${c}`,content:u})}else $p.has(zr(r))?e.push(...A_(r,s)):t[r]=hx(s);else t[r]=s}const i=Object.entries(t).map(([r,s])=>{if(r==="charset")return{charset:s===null?"_null":s};const o=px(r),a=f1(r),l=s===null?"_null":typeof s=="object"?h1(s,r):typeof s=="number"?s.toString():s;return o==="http-equiv"?{"http-equiv":a,content:l}:{[o]:a,content:l}});return[...e,...i].map(r=>"content"in r&&r.content==="_null"?{...r,content:null}:r)}const d1={key:"flatMeta",hooks:{"entries:normalize":n=>{const e=[];n.tags=n.tags.map(t=>t.tag!=="_flatMeta"?t:(e.push(Cu(t.props).map(i=>({...t,tag:"meta",props:i}))),!1)).filter(Boolean).concat(...e)}}},p1=["name","property","http-equiv"],m1=new Set(["viewport","description","keywords","robots"]);function mx(n){const e=n.split(":");return e.length?$p.has(e[1]):!1}function nd(n){const{props:e,tag:t}=n;if(a1.has(t))return t;if(t==="link"&&e.rel==="canonical")return"canonical";if(t==="link"&&e.rel==="alternate"){if(e.hreflang)return`alternate:${e.hreflang}`;if(e.type)return`alternate:${e.type}:${e.href||""}`}if(e.charset)return"charset";if(n.tag==="meta"){for(const i of p1)if(e[i]!==void 0){const r=e[i],s=r&&typeof r=="string"&&r.includes(":"),o=r&&m1.has(r),l=!(s||o)&&n.key?`:key:${n.key}`:"";return`${t}:${r}${l}`}}if(n.key)return`${t}:key:${n.key}`;if(e.id)return`${t}:id:${e.id}`;if(t==="link"&&e.rel==="alternate")return`alternate:${e.href||""}`;if(s1.has(t)){const i=n.textContent||n.innerHTML;if(i)return`${t}:content:${i}`}}function _x(n){const e=n._h||n._d;if(e)return e;const t=n.textContent||n.innerHTML;return t||`${n.tag}:${Object.entries(n.props).map(([i,r])=>`${i}:${String(r)}`).join(",")}`}function Pu(n,e,t){typeof n==="function"&&(!t||t!=="titleTemplate"&&!(t[0]==="o"&&t[1]==="n"))&&(n=n());const r=e?e(t,n):n;if(Array.isArray(r))return r.map(s=>Pu(s,e));if(r?.constructor===Object){const s={};for(const o of Object.keys(r))s[o]=Pu(r[o],e,o);return s}return r}function _1(n,e){const t=n==="style"?new Map:new Set;function i(r){if(r==null||r===void 0)return;const s=String(r).trim();if(s)if(n==="style"){const[o,...a]=s.split(":").map(l=>l?l.trim():"");o&&a.length&&t.set(o,a.join(":"))}else s.split(" ").filter(Boolean).forEach(o=>t.add(o))}return typeof e=="string"?n==="style"?e.split(";").forEach(i):i(e):Array.isArray(e)?e.forEach(r=>i(r)):e&&typeof e=="object"&&Object.entries(e).forEach(([r,s])=>{s&&s!=="false"&&(n==="style"?t.set(String(r).trim(),String(s)):i(r))}),t}function gx(n,e){if(n.props=n.props||{},!e)return n;if(n.tag==="templateParams")return n.props=e,n;const t=ed.has(n.tag)||n.tag==="htmlAttrs"||n.tag==="bodyAttrs";return Object.entries(e).forEach(([i,r])=>{if(i==="__proto__"||i==="constructor"||i==="prototype")return;if(r===null){n.props[i]=null;return}if(i==="class"||i==="style"){n.props[i]=_1(i,r);return}if(l1.has(i)){if((i==="textContent"||i==="innerHTML")&&typeof r=="object"){let c=e.type;if(e.type||(c="application/json"),!c?.endsWith("json")&&c!=="speculationrules")return;e.type=c,n.props.type=c,n[i]=JSON.stringify(r)}else n[i]=r;return}const s=i.startsWith("data-"),o=t&&!s?i.toLowerCase():i,a=String(r),l=n.tag==="meta"&&o==="content";a==="true"||a===""?n.props[o]=s||l?a:!0:!r&&s&&a==="false"?n.props[o]="false":r!==void 0&&(n.props[o]=r)}),n}function g1(n,e){const t=typeof e=="object"&&typeof e!="function"?e:{[n==="script"||n==="noscript"||n==="style"?"innerHTML":"textContent"]:e},i=gx({tag:n,props:{}},t);return i.key&&r1.has(i.tag)&&(i.props["data-hid"]=i._h=i.key),i.tag==="script"&&typeof i.innerHTML=="object"&&(i.innerHTML=JSON.stringify(i.innerHTML),i.props.type=i.props.type||"application/json"),Array.isArray(i.props.content)?i.props.content.map(r=>({...i,props:{...i.props,content:r}})):i}function v1(n,e){if(!n)return[];typeof n=="function"&&(n=n());const t=(r,s)=>{for(let o=0;o<e.length;o++)s=e[o](r,s);return s};n=t(void 0,n);const i=[];return n=Pu(n,t),Object.entries(n||{}).forEach(([r,s])=>{if(s!==void 0)for(const o of Array.isArray(s)?s:[s])i.push(g1(r,o))}),i.flat()}const R_=(n,e)=>n._w===e._w?n._p-e._p:n._w-e._w,C_={base:-10,title:10},x1={critical:-8,high:-1,low:2},P_={meta:{"content-security-policy":-30,charset:-20,viewport:-15},link:{preconnect:20,stylesheet:60,preload:70,modulepreload:70,prefetch:90,"dns-prefetch":90,prerender:90},script:{async:30,defer:80,sync:50},style:{imported:40,sync:60}},y1=/@import/,Wa=n=>n===""||n===!0;function S1(n,e){if(typeof e.tagPriority=="number")return e.tagPriority;let t=100;const i=x1[e.tagPriority]||0,r=n.resolvedOptions.disableCapoSorting?{link:{},script:{},style:{}}:P_;if(e.tag in C_)t=C_[e.tag];else if(e.tag==="meta"){const s=e.props["http-equiv"]==="content-security-policy"?"content-security-policy":e.props.charset?"charset":e.props.name==="viewport"?"viewport":null;s&&(t=P_.meta[s])}else if(e.tag==="link"&&e.props.rel)t=r.link[e.props.rel];else if(e.tag==="script"){const s=String(e.props.type);Wa(e.props.async)?t=r.script.async:e.props.src&&!Wa(e.props.defer)&&!Wa(e.props.async)&&s!=="module"&&!s.endsWith("json")||e.innerHTML&&!s.endsWith("json")?t=r.script.sync:(Wa(e.props.defer)&&e.props.src&&!Wa(e.props.async)||s==="module")&&(t=r.script.defer)}else e.tag==="style"&&(t=e.innerHTML&&y1.test(e.innerHTML)?r.style.imported:r.style.sync);return(t||100)+i}function D_(n,e){const t=typeof e=="function"?e(n):e,i=t.key||String(n.plugins.size+1);n.plugins.get(i)||(n.plugins.set(i,t),n.hooks.addHooks(t.hooks||{}))}function M1(n={}){const e=rx();e.addHooks(n.hooks||{});const t=!n.document,i=new Map,r=new Map,s=new Set,o={_entryCount:1,plugins:r,dirty:!1,resolvedOptions:n,hooks:e,ssr:t,entries:i,headEntries(){return[...i.values()]},use:a=>D_(o,a),push(a,l){const c={...l||{}};delete c.head;const u=c._index??o._entryCount++,d={_i:u,input:a,options:c},f={_poll(h=!1){o.dirty=!0,!h&&s.add(u),e.callHook("entries:updated",o)},dispose(){i.delete(u)&&o.invalidate()},patch(h){(!c.mode||c.mode==="server"&&t||c.mode==="client"&&!t)&&(d.input=h,i.set(u,d),f._poll())}};return f.patch(a),f},async resolveTags(){const a={tagMap:new Map,tags:[],entries:[...o.entries.values()]};for(await e.callHook("entries:resolve",a);s.size;){const f=s.values().next().value;s.delete(f);const h=i.get(f);if(h){const p={tags:v1(h.input,n.propResolvers||[]).map(m=>Object.assign(m,h.options)),entry:h};await e.callHook("entries:normalize",p),h._tags=p.tags.map((m,_)=>(m._w=S1(o,m),m._p=(h._i<<10)+_,m._d=nd(m),m._d||(m._h=_x(m)),m))}}let l=!1;a.entries.flatMap(f=>(f._tags||[]).map(h=>({...h,props:{...h.props}}))).sort(R_).reduce((f,h)=>{const p=h._d||h._h;if(!f.has(p))return f.set(p,h);const m=f.get(p);if((h?.tagDuplicateStrategy||(c1.has(h.tag)?"merge":null)||(h.key&&h.key===m.key?"merge":null))==="merge"){const g={...m.props};Object.entries(h.props).forEach(([y,x])=>g[y]=y==="style"?new Map([...m.props.style||new Map,...x]):y==="class"?new Set([...m.props.class||new Set,...x]):x),f.set(p,{...h,props:g})}else h._p>>10===m._p>>10&&h.tag==="meta"&&mx(p)?(f.set(p,Object.assign([...Array.isArray(m)?m:[m],h],h)),l=!0):(h._w===m._w?h._p>m._p:h?._w<m?._w)&&f.set(p,h);return f},a.tagMap);const c=a.tagMap.get("title"),u=a.tagMap.get("titleTemplate");if(o._title=c?.textContent,u){const f=u?.textContent;if(o._titleTemplate=f,f){let h=typeof f=="function"?f(c?.textContent):f;typeof h=="string"&&!o.plugins.has("template-params")&&(h=h.replace("%s",c?.textContent||"")),c?h===null?a.tagMap.delete("title"):a.tagMap.set("title",{...c,textContent:h}):(u.tag="title",u.textContent=h)}}a.tags=Array.from(a.tagMap.values()),l&&(a.tags=a.tags.flat().sort(R_)),await e.callHook("tags:beforeResolve",a),await e.callHook("tags:resolve",a),await e.callHook("tags:afterResolve",a);const d=[];for(const f of a.tags){const{innerHTML:h,tag:p,props:m}=f;if(o1.has(p)&&!(Object.keys(m).length===0&&!f.innerHTML&&!f.textContent)&&!(p==="meta"&&!m.content&&!m["http-equiv"]&&!m.charset)){if(p==="script"&&h){if(String(m.type).endsWith("json")){const _=typeof h=="string"?h:JSON.stringify(h);f.innerHTML=_.replace(/</g,"\\u003C")}else typeof h=="string"&&(f.innerHTML=h.replace(new RegExp(`</${p}`,"g"),`<\\/${p}`));f._d=nd(f)}d.push(f)}}return d},invalidate(){for(const a of i.values())s.add(a._i);o.dirty=!0,e.callHook("entries:updated",o)}};return(n?.plugins||[]).forEach(a=>D_(o,a)),o.hooks.callHook("init",o),n.init?.forEach(a=>a&&o.push(a)),o}const b1=(n,e)=>rn(e)?mM(e):e,qp="usehead";function E1(n){return{install(t){t.config.globalProperties.$unhead=n,t.config.globalProperties.$head=n,t.provide(qp,n)}}.install}function vx(){if(rf()){const n=lo(qp);if(n)return n}throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.")}function xx(n,e={}){const t=e.head||vx();return t.ssr?t.push(n||{},e):T1(t,n,e)}function T1(n,e,t={}){const i=vt(!1);let r;return DM(()=>{const o=i.value?{}:Pu(e,b1);r?r.patch(o):r=n.push(o,t)}),Ba()&&(Zr(()=>{r.dispose()}),iv(()=>{i.value=!0}),nv(()=>{i.value=!1})),r}function w1(n={},e={}){(e.head||vx()).use(d1);const{title:i,titleTemplate:r,...s}=n;return xx({title:i,titleTemplate:r,_flatMeta:s},e)}function Yp(n){const e=n||An();return e.ssrContext?.head||e.runWithContext(()=>{if(rf()){const t=lo(qp);if(!t)throw new Error("[nuxt] [unhead] Missing Unhead instance.");return t}})}function iI(n,e={}){const t=e.head||Yp(e.nuxt);return xx(n,{head:t,...e})}function A1(n,e={}){const t=e.head||Yp(e.nuxt);return w1(n,{head:t,...e})}const R1=(n,e)=>[],C1=n=>CT({},...R1().map(e=>e.data).reverse()),P1=C1;let tu;function D1(){let n;return n=$fetch(Vp(`builds/meta/${wa().app.buildId}.json`),{responseType:"json"}),tu=n,n.catch(e=>{tu===n&&(tu=void 0),console.error("[nuxt] Error fetching app manifest.",e)}),n}function jp(){return tu||D1()}function ff(n){const e=typeof n=="string"?n:n.path;try{return P1(e)}catch(t){return console.error("[nuxt] Error matching route rules.",t),{}}}async function L_(n,e={}){if(await N1(n)){const t=await I1(n,e);return await yx(t)||null}return null}const L1="_payload.json";async function I1(n,e={}){const t=new URL(n,"http://localhost");if(t.host!=="localhost"||ka(t.pathname,{acceptRelative:!0}))throw new Error("Payload URL must not include hostname: "+n);const i=wa(),r=e.hash||(e.fresh?Date.now():i.app.buildId),s=i.app.cdnURL,o=s&&await U1(n)?s:i.app.baseURL;return uf(o,t.pathname,L1+(r?`?${r}`:""))}async function yx(n){try{if(xT){const e=await fetch(n,{cache:"force-cache"});return e.ok?await bx(await e.text()):null}}catch(e){console.warn("[nuxt] Cannot load payload ",n,e)}return null}function Sx(n){if(n.redirect)return!1;if(n.prerender)return!0}async function Mx(n){return n=n==="/"?n:n.replace(/\/$/,""),(await jp()).prerendered.includes(n)}async function N1(n=Gp().path){const e=ff({path:n});if(e.ssr===!1)return!1;const t=Sx(e);return t!==void 0?t:e.payload?!0:await Mx(n)}async function U1(n=Gp().path){const e=Sx(ff({path:n}));return e!==void 0?e:await Mx(n)}let Gs=null;async function F1(){if(Gs)return Gs;const n=document.getElementById("__NUXT_DATA__");if(!n)return{};const e=await bx(n.textContent||""),t=n.dataset.src?await yx(n.dataset.src):void 0;return Gs={...e,...t,...window.__NUXT__},Gs.config?.public&&(Gs.config.public=Is(Gs.config.public)),Gs}async function bx(n){return await n1(n,An()._payloadRevivers)}function O1(n,e){An()._payloadRevivers[n]=e}function I_(n){try{return JSON.parse(n)}catch{return n}}const B1=[["NuxtError",n=>Xp(n)],["EmptyShallowRef",n=>Ll(n==="_"?void 0:n==="0n"?BigInt(0):I_(n))],["EmptyRef",n=>vt(n==="_"?void 0:n==="0n"?BigInt(0):I_(n))],["ShallowRef",n=>Ll(n)],["ShallowReactive",n=>eo(n)],["Ref",n=>vt(n)],["Reactive",n=>Is(n)]],k1=Hs({name:"nuxt:revive-payload:client",order:-30,async setup(n){let e,t;for(const[i,r]of B1)O1(i,r);Object.assign(n.payload,([e,t]=vT(()=>n.runWithContext(F1)),e=await e,t(),e)),delete window.__NUXT__}});async function Kp(n,e={}){const t=e.document||n.resolvedOptions.document;if(!t||!n.dirty)return;const i={shouldRender:!0,tags:[]};if(await n.hooks.callHook("dom:beforeRender",i),!!i.shouldRender)return n._domUpdatePromise||(n._domUpdatePromise=new Promise(async r=>{const s=new Map,o=new Promise(h=>{n.resolveTags().then(p=>{h(p.map(m=>{const _=s.get(m._d)||0,g={tag:m,id:(_?`${m._d}:${_}`:m._d)||m._h,shouldRender:!0};return m._d&&mx(m._d)&&s.set(m._d,_+1),g}))})});let a=n._dom;if(!a){a={title:t.title,elMap:new Map().set("htmlAttrs",t.documentElement).set("bodyAttrs",t.body)};for(const h of["body","head"]){const p=t[h]?.children;for(const m of p){const _=m.tagName.toLowerCase();if(!ed.has(_))continue;const g=gx({tag:_,props:{}},{innerHTML:m.innerHTML,...m.getAttributeNames().reduce((y,x)=>(y[x]=m.getAttribute(x),y),{})||{}});if(g.key=m.getAttribute("data-hid")||void 0,g._d=nd(g)||_x(g),a.elMap.has(g._d)){let y=1,x=g._d;for(;a.elMap.has(x);)x=`${g._d}:${y++}`;a.elMap.set(x,m)}else a.elMap.set(g._d,m)}}}a.pendingSideEffects={...a.sideEffects},a.sideEffects={};function l(h,p,m){const _=`${h}:${p}`;a.sideEffects[_]=m,delete a.pendingSideEffects[_]}function c({id:h,$el:p,tag:m}){const _=m.tag.endsWith("Attrs");a.elMap.set(h,p),_||(m.textContent&&m.textContent!==p.textContent&&(p.textContent=m.textContent),m.innerHTML&&m.innerHTML!==p.innerHTML&&(p.innerHTML=m.innerHTML),l(h,"el",()=>{p?.remove(),a.elMap.delete(h)}));for(const g in m.props){if(!Object.prototype.hasOwnProperty.call(m.props,g))continue;const y=m.props[g];if(g.startsWith("on")&&typeof y=="function"){const v=p?.dataset;if(v&&v[`${g}fired`]){const b=g.slice(0,-5);y.call(p,new Event(b.substring(2)))}p.getAttribute(`data-${g}`)!==""&&((m.tag==="bodyAttrs"?t.defaultView:p).addEventListener(g.substring(2),y.bind(p)),p.setAttribute(`data-${g}`,""));continue}const x=`attr:${g}`;if(g==="class"){if(!y)continue;for(const v of y)_&&l(h,`${x}:${v}`,()=>p.classList.remove(v)),!p.classList.contains(v)&&p.classList.add(v)}else if(g==="style"){if(!y)continue;for(const[v,b]of y)l(h,`${x}:${v}`,()=>{p.style.removeProperty(v)}),p.style.setProperty(v,b)}else y!==!1&&y!==null&&(p.getAttribute(g)!==y&&p.setAttribute(g,y===!0?"":String(y)),_&&l(h,x,()=>p.removeAttribute(g)))}}const u=[],d={bodyClose:void 0,bodyOpen:void 0,head:void 0},f=await o;for(const h of f){const{tag:p,shouldRender:m,id:_}=h;if(m){if(p.tag==="title"){t.title=p.textContent,l("title","",()=>t.title=a.title);continue}h.$el=h.$el||a.elMap.get(_),h.$el?c(h):ed.has(p.tag)&&u.push(h)}}for(const h of u){const p=h.tag.tagPosition||"head";h.$el=t.createElement(h.tag.tag),c(h),d[p]=d[p]||t.createDocumentFragment(),d[p].appendChild(h.$el)}for(const h of f)await n.hooks.callHook("dom:renderTag",h,t,l);d.head&&t.head.appendChild(d.head),d.bodyOpen&&t.body.insertBefore(d.bodyOpen,t.body.firstChild),d.bodyClose&&t.body.appendChild(d.bodyClose);for(const h in a.pendingSideEffects)a.pendingSideEffects[h]();n._dom=a,await n.hooks.callHook("dom:rendered",{renders:f}),r()}).finally(()=>{n._domUpdatePromise=void 0,n.dirty=!1})),n._domUpdatePromise}function H1(n={}){const e=n.domOptions?.render||Kp;n.document=n.document||(typeof window<"u"?document:void 0);const t=n.document?.head.querySelector('script[id="unhead:payload"]')?.innerHTML||!1;return M1({...n,plugins:[...n.plugins||[],{key:"client",hooks:{"entries:updated":e}}],init:[t?JSON.parse(t):!1,...n.init||[]]})}function z1(n,e){let t=0;return()=>{const i=++t;e(()=>{t===i&&n()})}}function V1(n={}){const e=H1({domOptions:{render:z1(()=>Kp(e),t=>setTimeout(t,0))},...n});return e.install=E1(e),e}const G1={disableDefaults:!0},W1=Hs({name:"nuxt:head",enforce:"pre",setup(n){const e=V1(G1);n.vueApp.use(e);{let t=!0;const i=async()=>{t=!1,await Kp(e)};e.hooks.hook("dom:beforeRender",s=>{s.shouldRender=!t}),n.hooks.hook("page:start",()=>{t=!0}),n.hooks.hook("page:finish",()=>{n.isHydrating||i()}),n.hooks.hook("app:error",i),n.hooks.hook("app:suspense:resolve",i);const r=e.push.bind(e);e.push=((s,o)=>{const a=r(s,o),l=a.dispose.bind(a);return a.dispose=()=>{const c=n["~transitionPromise"];c?c.then(l):l()},a})}}}),X1=n=>{const e=ff({path:n.path});if(e.redirect){const t=e.redirect.includes("#")?e.redirect:e.redirect+n.hash;return ka(t,{acceptRelative:!0})?(window.location.href=t,!1):t}},$1=[X1];function Uf(n){const e=n&&typeof n=="object"?n:{};typeof n=="object"&&(n=Qv({pathname:n.path||"",search:qv(n.query||{}),hash:n.hash||""}));const t=new URL(n.toString(),window.location.href);return{path:t.pathname,fullPath:n,query:kp(t.search),hash:t.hash,params:e.params||{},name:void 0,matched:e.matched||[],redirectedFrom:void 0,meta:e.meta||{},href:n}}const q1=Hs({name:"nuxt:router",enforce:"pre",setup(n){const e=GE(window.location.pathname,wa().app.baseURL)+window.location.search+window.location.hash,t=[],i={"navigate:before":[],"resolve:before":[],"navigate:after":[],error:[]},r=(f,h)=>(i[f].push(h),()=>i[f].splice(i[f].indexOf(h),1)),s=wa().app.baseURL,o=Is(Uf(e));async function a(f,h){try{const p=Uf(f);for(const m of i["navigate:before"]){const _=await m(p,o);if(_===!1||_ instanceof Error)return;if(typeof _=="string"&&_.length)return await a(_,!0)}for(const m of i["resolve:before"])await m(p,o);Object.assign(o,p),window.history[h?"replaceState":"pushState"]({},"",uf(s,p.fullPath)),n.isHydrating||await n.runWithContext(kT);for(const m of i["navigate:after"])await m(p,o)}catch(p){for(const m of i.error)await m(p)}}const c={currentRoute:nc(()=>o),isReady:()=>Promise.resolve(),options:{},install:()=>Promise.resolve(),push:f=>a(f,!1),replace:f=>a(f,!0),back:()=>window.history.go(-1),go:f=>window.history.go(f),forward:()=>window.history.go(1),beforeResolve:f=>r("resolve:before",f),beforeEach:f=>r("navigate:before",f),afterEach:f=>r("navigate:after",f),onError:f=>r("error",f),resolve:Uf,addRoute:(f,h)=>{t.push(h)},getRoutes:()=>t,hasRoute:f=>t.some(h=>h.name===f),removeRoute:f=>{const h=t.findIndex(p=>p.name===f);h!==-1&&t.splice(h,1)}};n.vueApp.component("RouterLink",Tr({functional:!0,props:{to:{type:String,required:!0},custom:Boolean,replace:Boolean,activeClass:String,exactActiveClass:String,ariaCurrentValue:String},setup:(f,{slots:h})=>{const p=()=>a(f.to,f.replace);return()=>{const m=c.resolve(f.to);return f.custom?h.default?.({href:f.to,navigate:p,route:m}):Cs("a",{href:f.to,onClick:_=>(_.preventDefault(),p())},h)}}})),window.addEventListener("popstate",f=>{const h=f.target.location;c.replace(h.href.replace(h.origin,""))}),n._route=o,n._middleware||={global:[],named:{}};const u=n.payload.state._layout,d=n.payload.state._layoutProps;return n.hooks.hookOnce("app:created",async()=>{c.beforeEach(async(f,h)=>{f.meta=Is(f.meta||{}),n.isHydrating&&u&&!Sr(f.meta.layout)&&(f.meta.layout=u,f.meta.layoutProps=d),n._processingMiddleware=!0;{const p=new Set([...$1,...n._middleware.global]),m=ff({path:f.path});if(m.appMiddleware)for(const _ in m.appMiddleware){const g=n._middleware.named[_];g&&(m.appMiddleware[_]?p.add(g):p.delete(g))}for(const _ of p){const g=await n.runWithContext(()=>_(f,h));if(g!==!0&&(g||g===!1))return g}}}),c.afterEach(()=>{delete n._processingMiddleware}),await c.replace(e),XE(o.fullPath,e)||await n.runWithContext(()=>UT(o.fullPath))}),{provide:{route:o,router:c}}}}),N_=globalThis.requestIdleCallback||(n=>{const e=Date.now(),t={didTimeout:!1,timeRemaining:()=>Math.max(0,50-(Date.now()-e))};return setTimeout(()=>{n(t)},1)}),rI=globalThis.cancelIdleCallback||(n=>{clearTimeout(n)}),Zp=n=>{const e=An();e.isHydrating?e.hooks.hookOnce("app:suspense:resolve",()=>{N_(()=>n())}):N_(()=>n())},Y1=Hs({name:"nuxt:payload",setup(n){const e=new Set;So().beforeResolve(async(t,i)=>{if(t.path===i.path)return;const r=await L_(t.path);if(r){for(const s of e)delete n.static.data[s];for(const s in r.data)s in n.static.data||e.add(s),n.static.data[s]=r.data[s]}}),Zp(()=>{n.hooks.hook("link:prefetch",async t=>{const{hostname:i}=new URL(t,window.location.href);i===window.location.hostname&&await L_(t).catch(()=>{console.warn("[nuxt] Error preloading payload for",t)})}),navigator.connection?.effectiveType!=="slow-2g"&&setTimeout(jp,1e3)})}}),j1=Hs(()=>{const n=So();Zp(()=>{n.beforeResolve(async()=>{await new Promise(e=>{setTimeout(e,100),requestAnimationFrame(()=>{setTimeout(e,0)})})})})}),K1=Hs(n=>{let e;async function t(){let i;try{i=await jp()}catch(r){const s=r;if(!("status"in s&&(s.status===404||s.status===403)))throw s}e&&clearTimeout(e),e=setTimeout(t,E_);try{const r=await $fetch(Vp("builds/latest.json")+`?${Date.now()}`);r.id!==i?.id&&(n.hooks.callHook("app:manifest:update",r),e&&clearTimeout(e))}catch{}}Zp(()=>{e=setTimeout(t,E_)})});function Z1(n={}){const e=n.path||window.location.pathname;let t={};try{t=JSON.parse(sessionStorage.getItem("nuxt:reload")||"{}")}catch{}if(n.force||t?.path!==e||t?.expires<Date.now()){try{sessionStorage.setItem("nuxt:reload",JSON.stringify({path:e,expires:Date.now()+(n.ttl??1e4)}))}catch{}if(n.persistState)try{sessionStorage.setItem("nuxt:reload:state",JSON.stringify({state:An().payload.state}))}catch{}window.location.pathname!==e?window.location.href=e:window.location.reload()}}const J1=Hs({name:"nuxt:chunk-reload",setup(n){const e=So(),t=wa(),i=new Set;e.beforeEach(()=>{i.clear()}),n.hook("app:chunkError",({error:s})=>{i.add(s)});function r(s){const o=uf(t.app.baseURL,s.fullPath);Z1({path:o,persistState:!0})}n.hook("app:manifest:update",()=>{e.beforeResolve(r)}),e.onError((s,o)=>{i.has(s)&&r(o)})}}),Q1=Hs({name:"nuxt:global-components"}),ew=[k1,W1,q1,Y1,j1,K1,J1,Q1];function tw(n,e=!1){if(n){if(n.nodeName==="#comment"&&n.nodeValue==="[")return Ex(n,[],e);if(e){const t=n.cloneNode(!0);return t.querySelectorAll("[data-island-slot]").forEach(i=>{i.innerHTML=""}),[t.outerHTML]}return[n.outerHTML]}}function Ex(n,e=[],t=!1){if(n&&n.nodeName){if(rw(n))return e;if(!iw(n)){const i=n.cloneNode(!0);t&&i.querySelectorAll?.("[data-island-slot]").forEach(r=>{r.innerHTML=""}),e.push(i.outerHTML)}Ex(n.nextSibling,e,t)}return e}function nw(n,e){const t=n?tw(n):[e];return t?Cb(t.join(""),t.length):Cs("div")}function iw(n){return n.nodeName==="#comment"&&n.nodeValue==="["}function rw(n){return n.nodeName==="#comment"&&n.nodeValue==="]"}const sw="<div></div>";function ow(n){return n.nodeName==="#comment"&&n.nodeValue==="placeholder"}function Ff(n){return n&&!ow(n)?nw(n,sw):Cs("div")}const Of=new WeakMap;function aw(n){if(Of.has(n))return Of.get(n);const e={...n};if(e.render)e.render=(t,i,r,s,o,a)=>{if(s.mounted$??t.mounted$){const l=n.render?.bind(t)(t,i,r,s,o,a);return l.children===null||typeof l.children=="string"?Gr(l):Cs(l)}return Ff(t._.vnode.el)};else{const t="<div></div>";e.template&&=`
      <template v-if="mounted$">${n.template}</template>
      <template v-else>${t}</template>
    `}return e.setup=(t,i)=>{const r=An(),s=Ll(r.isHydrating===!1),o=Ba();if(r.isHydrating){const l={...o.attrs},c=lw(o);for(const u in l)delete o.attrs[u];Kr(()=>{Object.assign(o.attrs,l),o.vnode.dirs=c})}Kr(()=>{s.value=!0});const a=n.setup?.(t,i)||{};return Mp(a)?Promise.resolve(a).then(l=>typeof l!="function"?(l||={},l.mounted$=s,l):(...c)=>{if(s.value||!r.isHydrating){const u=l(...c);return u.children===null||typeof u.children=="string"?Gr(u):Cs(u)}return Ff(o?.vnode.el)}):typeof a=="function"?(...l)=>{if(s.value){const c=a(...l),u=e.inheritAttrs!==!1?i.attrs:void 0;return c.children===null||typeof c.children=="string"?Gr(c,u):Cs(c,u)}return Ff(o?.vnode.el)}:Object.assign(a,{mounted$:s})},Of.set(n,e),e}function lw(n){if(!n||!n.vnode.dirs)return null;const e=n.vnode.dirs;return n.vnode.dirs=null,e}function cw(n={}){const e=Ll(""),t=Ll(n.politeness||"polite"),i=Yp();function r(c="",u="polite"){e.value=c,t.value=u}function s(c){r(c,"polite")}function o(c){r(c,"assertive")}function a(){r(document?.title?.trim(),t.value)}function l(){i?.hooks?.removeHook("dom:rendered",a)}return a(),i?.hooks?.hook("dom:rendered",a),{_cleanup:l,message:e,politeness:t,set:r,polite:s,assertive:o}}function uw(n={}){const e=An(),t=e._routeAnnouncer||=cw(n);return n.politeness&&n.politeness!==t.politeness.value&&(t.politeness.value=n.politeness),Ep()&&(e._routeAnnouncerDeps||=0,e._routeAnnouncerDeps++,qS(()=>{e._routeAnnouncerDeps--,e._routeAnnouncerDeps===0&&(t._cleanup(),delete e._routeAnnouncer)})),t}const fw=Tr({name:"NuxtRouteAnnouncer",props:{atomic:{type:Boolean,default:!1},politeness:{type:String,default:"polite"}},setup(n,{slots:e,expose:t}){const{set:i,polite:r,assertive:s,message:o,politeness:a}=uw({politeness:n.politeness}),l=nc(()=>{if(a.value==="assertive")return"alert";if(a.value!=="off")return"status"});return t({set:i,polite:r,assertive:s,message:o,politeness:a}),()=>Cs("span",{class:"nuxt-route-announcer",style:{position:"absolute"}},Cs("span",{role:l.value,"aria-live":a.value,"aria-atomic":n.atomic,style:{border:"0",clip:"rect(0 0 0 0)","clip-path":"inset(50%)",height:"1px",width:"1px",overflow:"hidden",position:"absolute","white-space":"nowrap","word-wrap":"normal",margin:"-1px",padding:"0"}},e.default?e.default({message:o.value}):o.value))}}),hw={class:"grid"},dw=Tr({__name:"LoadingHero",props:{duration:{type:Number,default:3.2},tileSize:{type:Number,default:92},orangeRatio:{type:Number,default:.04},blue:{type:String,default:"#9FD6FF"},orange:{type:String,default:"#FF7F00"},white:{type:String,default:"#ffffff"},textColor:{type:String,default:"#686868"},counterFontSize:{type:String,default:"clamp(28px, 6vmin, 56px)"},startDelay:{type:Number,default:.2},centerOrangeAt:{type:Number,default:.8}},emits:["done"],setup(n,{emit:e}){const t=n,i=e,r=vt(null),s=vt(null),o=vt([]),a=vt(0),l=vt(0);let c=0,u=[],d=[],f=0,h=-1,p=0,m=!1;const _=E=>E<.5?2*E*E:1-(-2*E+2)**2/2,g=(E,R)=>{let D=Math.ceil(E/R);return D%2===0&&(D+=1),Math.max(3,D)},y=()=>{const E=r.value?.clientWidth||window.innerWidth,R=r.value?.clientHeight||window.innerHeight,D=t.tileSize,N=g(E,D),V=g(R,D);a.value=N,l.value=N*V,c=Math.floor(V/2)*N+Math.floor(N/2),r.value&&(r.value.style.setProperty("--cols",String(N)),r.value.style.setProperty("--tile",`${D}px`))},x=E=>{const R=Array.from({length:E},(N,V)=>V);for(let N=E-1;N>0;N--){const V=Math.floor(Math.random()*(N+1));[R[N],R[V]]=[R[V],R[N]]}const D=R.indexOf(c);[R[0],R[D]]=[R[D],R[0]],u=new Array(E);for(let N=0;N<E;N++)u[R[N]]=N;d=new Array(E).fill(-1)},v=(E,R)=>{const D=o.value[E];!D||d[E]===R||(d[E]=R,D.style.backgroundColor=R===2?t.white:R===1?t.orange:t.blue)},b=()=>{m=!0;const E=l.value;for(let R=0;R<E;R++)v(R,R===c?1:2);s.value&&(s.value.style.opacity="0"),i("done")},T=E=>{h<0&&(h=E);const R=Math.min((E-h)/1e3,.05);h=E,p+=R;const D=l.value,N=Math.max(1,Math.round(D*t.orangeRatio)),V=p-t.startDelay;if(V<=0){f=requestAnimationFrame(T);return}const z=Math.min(V/t.duration,1),O=_(z),F=Math.floor(O*D),k=O>=t.centerOrangeAt;for(let H=0;H<D;H++){const X=u[H];let L=X<F?2:X<F+N?1:0;H===c&&k&&(L=1),v(H,L)}if(s.value&&(s.value.textContent=`${Math.round(O*100)}%`),z>=1){m||b();return}f=requestAnimationFrame(T)},A=()=>{x(l.value),h=-1,p=0,m=!1,s.value&&(s.value.style.opacity="1"),cancelAnimationFrame(f),f=requestAnimationFrame(T)},S=()=>{m||(y(),Il(()=>A()))};return Kr(()=>{s.value&&(s.value.style.color=t.textColor,s.value.style.fontSize=t.counterFontSize),y(),Il(()=>A()),window.addEventListener("resize",S)}),Zr(()=>{cancelAnimationFrame(f),window.removeEventListener("resize",S)}),(E,R)=>(_t(),Xt("div",{ref_key:"rootRef",ref:r,class:"loader","aria-label":"載入中",role:"img"},[en("div",hw,[(_t(!0),Xt(Qt,null,ec(ut(l),D=>(_t(),Xt("div",{key:D,ref_for:!0,ref_key:"tileRefs",ref:o,class:"tile"}))),128))]),en("div",{ref_key:"counterRef",ref:s,class:"counter"},"0%",512)],512))}}),Ha=(n,e)=>{const t=n.__vccOpts||n;for(const[i,r]of e)t[i]=r;return t},pw=Object.assign(Ha(dw,[["__scopeId","data-v-1e303ace"]]),{__name:"LoadingHero"});function Nr(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function Tx(n,e){n.prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e}var Ri={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Bl={duration:.5,overwrite:!1,delay:0},Jp,Ln,Vt,Vi=1e8,Nt=1/Vi,id=Math.PI*2,mw=id/4,_w=0,wx=Math.sqrt,gw=Math.cos,vw=Math.sin,Rn=function(e){return typeof e=="string"},Yt=function(e){return typeof e=="function"},Jr=function(e){return typeof e=="number"},Qp=function(e){return typeof e>"u"},br=function(e){return typeof e=="object"},ai=function(e){return e!==!1},em=function(){return typeof window<"u"},_c=function(e){return Yt(e)||Rn(e)},Ax=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Wn=Array.isArray,xw=/random\([^)]+\)/g,yw=/,\s*/g,U_=/(?:-?\.?\d|\.)+/gi,Rx=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,ia=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Bf=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Cx=/[+-]=-?[.\d]+/,Sw=/[^,'"\[\]\s]+/gi,Mw=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Wt,lr,rd,tm,Pi={},Du={},Px,Dx=function(e){return(Du=Aa(e,Pi))&&di},nm=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},kl=function(e,t){return!t&&console.warn(e)},Lx=function(e,t){return e&&(Pi[e]=t)&&Du&&(Du[e]=t)||Pi},Hl=function(){return 0},bw={suppressEvents:!0,isStart:!0,kill:!1},nu={suppressEvents:!0,kill:!1},Ew={suppressEvents:!0},im={},Ps=[],sd={},Ix,yi={},kf={},F_=30,iu=[],rm="",sm=function(e){var t=e[0],i,r;if(br(t)||Yt(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(r=iu.length;r--&&!iu[r].targetTest(t););i=iu[r]}for(r=e.length;r--;)e[r]&&(e[r]._gsap||(e[r]._gsap=new ty(e[r],i)))||e.splice(r,1);return e},ho=function(e){return e._gsap||sm(Gi(e))[0]._gsap},Nx=function(e,t,i){return(i=e[t])&&Yt(i)?e[t]():Qp(i)&&e.getAttribute&&e.getAttribute(t)||i},li=function(e,t){return(e=e.split(",")).forEach(t)||e},Jt=function(e){return Math.round(e*1e5)/1e5||0},Gt=function(e){return Math.round(e*1e7)/1e7||0},da=function(e,t){var i=t.charAt(0),r=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+r:i==="-"?e-r:i==="*"?e*r:e/r},Tw=function(e,t){for(var i=t.length,r=0;e.indexOf(t[r])<0&&++r<i;);return r<i},Lu=function(){var e=Ps.length,t=Ps.slice(0),i,r;for(sd={},Ps.length=0,i=0;i<e;i++)r=t[i],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},om=function(e){return!!(e._initted||e._startAt||e.add)},Ux=function(e,t,i,r){Ps.length&&!Ln&&Lu(),e.render(t,i,!!(Ln&&t<0&&om(e))),Ps.length&&!Ln&&Lu()},Fx=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(Sw).length<2?t:Rn(e)?e.trim():e},Ox=function(e){return e},Di=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},ww=function(e){return function(t,i){for(var r in i)r in t||r==="duration"&&e||r==="ease"||(t[r]=i[r])}},Aa=function(e,t){for(var i in t)e[i]=t[i];return e},O_=function n(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=br(t[i])?n(e[i]||(e[i]={}),t[i]):t[i]);return e},Iu=function(e,t){var i={},r;for(r in e)r in t||(i[r]=e[r]);return i},vl=function(e){var t=e.parent||Wt,i=e.keyframes?ww(Wn(e.keyframes)):Di;if(ai(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},Aw=function(e,t){for(var i=e.length,r=i===t.length;r&&i--&&e[i]===t[i];);return i<0},Bx=function(e,t,i,r,s){var o=e[r],a;if(s)for(a=t[s];o&&o[s]>a;)o=o._prev;return o?(t._next=o._next,o._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[r]=t,t._prev=o,t.parent=t._dp=e,t},hf=function(e,t,i,r){i===void 0&&(i="_first"),r===void 0&&(r="_last");var s=t._prev,o=t._next;s?s._next=o:e[i]===t&&(e[i]=o),o?o._prev=s:e[r]===t&&(e[r]=s),t._next=t._prev=t.parent=null},Ns=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},po=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},Rw=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},od=function(e,t,i,r){return e._startAt&&(Ln?e._startAt.revert(nu):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,r))},Cw=function n(e){return!e||e._ts&&n(e.parent)},B_=function(e){return e._repeat?Ra(e._tTime,e=e.duration()+e._rDelay)*e:0},Ra=function(e,t){var i=Math.floor(e=Gt(e/t));return e&&i===e?i-1:i},Nu=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},df=function(e){return e._end=Gt(e._start+(e._tDur/Math.abs(e._ts||e._rts||Nt)||0))},pf=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=Gt(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),df(e),i._dirty||po(i,e)),e},kx=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=Nu(e.rawTime(),t),(!t._dur||ic(0,t.totalDuration(),i)-t._tTime>Nt)&&t.render(i,!0)),po(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-Nt}},hr=function(e,t,i,r){return t.parent&&Ns(t),t._start=Gt((Jr(i)?i:i||e!==Wt?Fi(e,i,t):e._time)+t._delay),t._end=Gt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Bx(e,t,"_first","_last",e._sort?"_start":0),ad(t)||(e._recent=t),r||kx(e,t),e._ts<0&&pf(e,e._tTime),e},Hx=function(e,t){return(Pi.ScrollTrigger||nm("scrollTrigger",t))&&Pi.ScrollTrigger.create(t,e)},zx=function(e,t,i,r,s){if(lm(e,t,s),!e._initted)return 1;if(!i&&e._pt&&!Ln&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Ix!==bi.frame)return Ps.push(e),e._lazy=[s,r],1},Pw=function n(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||n(t))},ad=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Dw=function(e,t,i,r){var s=e.ratio,o=t<0||!t&&(!e._start&&Pw(e)&&!(!e._initted&&ad(e))||(e._ts<0||e._dp._ts<0)&&!ad(e))?0:1,a=e._rDelay,l=0,c,u,d;if(a&&e._repeat&&(l=ic(0,e._tDur,t),u=Ra(l,a),e._yoyo&&u&1&&(o=1-o),u!==Ra(e._tTime,a)&&(s=1-o,e.vars.repeatRefresh&&e._initted&&e.invalidate())),o!==s||Ln||r||e._zTime===Nt||!t&&e._zTime){if(!e._initted&&zx(e,t,r,i,l))return;for(d=e._zTime,e._zTime=t||(i?Nt:0),i||(i=t&&!d),e.ratio=o,e._from&&(o=1-o),e._time=0,e._tTime=l,c=e._pt;c;)c.r(o,c.d),c=c._next;t<0&&od(e,t,i,!0),e._onUpdate&&!i&&Ti(e,"onUpdate"),l&&e._repeat&&!i&&e.parent&&Ti(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===o&&(o&&Ns(e,1),!i&&!Ln&&(Ti(e,o?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Lw=function(e,t,i){var r;if(i>t)for(r=e._first;r&&r._start<=i;){if(r.data==="isPause"&&r._start>t)return r;r=r._next}else for(r=e._last;r&&r._start>=i;){if(r.data==="isPause"&&r._start<t)return r;r=r._prev}},Ca=function(e,t,i,r){var s=e._repeat,o=Gt(t)||0,a=e._tTime/e._tDur;return a&&!r&&(e._time*=o/e._dur),e._dur=o,e._tDur=s?s<0?1e10:Gt(o*(s+1)+e._rDelay*s):o,a>0&&!r&&pf(e,e._tTime=e._tDur*a),e.parent&&df(e),i||po(e.parent,e),e},k_=function(e){return e instanceof si?po(e):Ca(e,e._dur)},Iw={_start:0,endTime:Hl,totalDuration:Hl},Fi=function n(e,t,i){var r=e.labels,s=e._recent||Iw,o=e.duration()>=Vi?s.endTime(!1):e._dur,a,l,c;return Rn(t)&&(isNaN(t)||t in r)?(l=t.charAt(0),c=t.substr(-1)==="%",a=t.indexOf("="),l==="<"||l===">"?(a>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(a<0?s:i).totalDuration()/100:1)):a<0?(t in r||(r[t]=o),r[t]):(l=parseFloat(t.charAt(a-1)+t.substr(a+1)),c&&i&&(l=l/100*(Wn(i)?i[0]:i).totalDuration()),a>1?n(e,t.substr(0,a-1),i)+l:o+l)):t==null?o:+t},xl=function(e,t,i){var r=Jr(t[1]),s=(r?2:1)+(e<2?0:1),o=t[s],a,l;if(r&&(o.duration=t[1]),o.parent=i,e){for(a=o,l=i;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=ai(l.vars.inherit)&&l.parent;o.immediateRender=ai(a.immediateRender),e<2?o.runBackwards=1:o.startAt=t[s-1]}return new fn(t[0],o,t[s+1])},zs=function(e,t){return e||e===0?t(e):t},ic=function(e,t,i){return i<e?e:i>t?t:i},zn=function(e,t){return!Rn(e)||!(t=Mw.exec(e))?"":t[1]},Nw=function(e,t,i){return zs(i,function(r){return ic(e,t,r)})},ld=[].slice,Vx=function(e,t){return e&&br(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&br(e[0]))&&!e.nodeType&&e!==lr},Uw=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(r){var s;return Rn(r)&&!t||Vx(r,1)?(s=i).push.apply(s,Gi(r)):i.push(r)})||i},Gi=function(e,t,i){return Vt&&!t&&Vt.selector?Vt.selector(e):Rn(e)&&!i&&(rd||!Pa())?ld.call((t||tm).querySelectorAll(e),0):Wn(e)?Uw(e,i):Vx(e)?ld.call(e,0):e?[e]:[]},cd=function(e){return e=Gi(e)[0]||kl("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return Gi(t,i.querySelectorAll?i:i===e?kl("Invalid scope")||tm.createElement("div"):e)}},Gx=function(e){return e.sort(function(){return .5-Math.random()})},Wx=function(e){if(Yt(e))return e;var t=br(e)?e:{each:e},i=mo(t.ease),r=t.from||0,s=parseFloat(t.base)||0,o={},a=r>0&&r<1,l=isNaN(r)||a,c=t.axis,u=r,d=r;return Rn(r)?u=d={center:.5,edges:.5,end:1}[r]||0:!a&&l&&(u=r[0],d=r[1]),function(f,h,p){var m=(p||t).length,_=o[m],g,y,x,v,b,T,A,S,E;if(!_){if(E=t.grid==="auto"?0:(t.grid||[1,Vi])[1],!E){for(A=-Vi;A<(A=p[E++].getBoundingClientRect().left)&&E<m;);E<m&&E--}for(_=o[m]=[],g=l?Math.min(E,m)*u-.5:r%E,y=E===Vi?0:l?m*d/E-.5:r/E|0,A=0,S=Vi,T=0;T<m;T++)x=T%E-g,v=y-(T/E|0),_[T]=b=c?Math.abs(c==="y"?v:x):wx(x*x+v*v),b>A&&(A=b),b<S&&(S=b);r==="random"&&Gx(_),_.max=A-S,_.min=S,_.v=m=(parseFloat(t.amount)||parseFloat(t.each)*(E>m?m-1:c?c==="y"?m/E:E:Math.max(E,m/E))||0)*(r==="edges"?-1:1),_.b=m<0?s-m:s,_.u=zn(t.amount||t.each)||0,i=i&&m<0?Yw(i):i}return m=(_[f]-_.min)/_.max||0,Gt(_.b+(i?i(m):m)*_.v)+_.u}},ud=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var r=Gt(Math.round(parseFloat(i)/e)*e*t);return(r-r%1)/t+(Jr(i)?0:zn(i))}},Xx=function(e,t){var i=Wn(e),r,s;return!i&&br(e)&&(r=i=e.radius||Vi,e.values?(e=Gi(e.values),(s=!Jr(e[0]))&&(r*=r)):e=ud(e.increment)),zs(t,i?Yt(e)?function(o){return s=e(o),Math.abs(s-o)<=r?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=Vi,u=0,d=e.length,f,h;d--;)s?(f=e[d].x-a,h=e[d].y-l,f=f*f+h*h):f=Math.abs(e[d]-a),f<c&&(c=f,u=d);return u=!r||c<=r?e[u]:o,s||u===o||Jr(o)?u:u+zn(o)}:ud(e))},$x=function(e,t,i,r){return zs(Wn(e)?!t:i===!0?!!(i=0):!r,function(){return Wn(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(r=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*r)/r})},Fw=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(r){return t.reduce(function(s,o){return o(s)},r)}},Ow=function(e,t){return function(i){return e(parseFloat(i))+(t||zn(i))}},Bw=function(e,t,i){return Yx(e,t,0,1,i)},qx=function(e,t,i){return zs(i,function(r){return e[~~t(r)]})},kw=function n(e,t,i){var r=t-e;return Wn(e)?qx(e,n(0,e.length),t):zs(i,function(s){return(r+(s-e)%r)%r+e})},Hw=function n(e,t,i){var r=t-e,s=r*2;return Wn(e)?qx(e,n(0,e.length-1),t):zs(i,function(o){return o=(s+(o-e)%s)%s||0,e+(o>r?s-o:o)})},zl=function(e){return e.replace(xw,function(t){var i=t.indexOf("[")+1,r=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(yw);return $x(i?r:+r[0],i?0:+r[1],+r[2]||1e-5)})},Yx=function(e,t,i,r,s){var o=t-e,a=r-i;return zs(s,function(l){return i+((l-e)/o*a||0)})},zw=function n(e,t,i,r){var s=isNaN(e+t)?0:function(h){return(1-h)*e+h*t};if(!s){var o=Rn(e),a={},l,c,u,d,f;if(i===!0&&(r=1)&&(i=null),o)e={p:e},t={p:t};else if(Wn(e)&&!Wn(t)){for(u=[],d=e.length,f=d-2,c=1;c<d;c++)u.push(n(e[c-1],e[c]));d--,s=function(p){p*=d;var m=Math.min(f,~~p);return u[m](p-m)},i=t}else r||(e=Aa(Wn(e)?[]:{},e));if(!u){for(l in t)am.call(a,e,l,"get",t[l]);s=function(p){return fm(p,a)||(o?e.p:e)}}}return zs(i,s)},H_=function(e,t,i){var r=e.labels,s=Vi,o,a,l;for(o in r)a=r[o]-t,a<0==!!i&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},Ti=function(e,t,i){var r=e.vars,s=r[t],o=Vt,a=e._ctx,l,c,u;if(s)return l=r[t+"Params"],c=r.callbackScope||e,i&&Ps.length&&Lu(),a&&(Vt=a),u=l?s.apply(c,l):s.call(c),Vt=o,u},il=function(e){return Ns(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Ln),e.progress()<1&&Ti(e,"onInterrupt"),e},ra,jx=[],Kx=function(e){if(e)if(e=!e.name&&e.default||e,em()||e.headless){var t=e.name,i=Yt(e),r=t&&!i&&e.init?function(){this._props=[]}:e,s={init:Hl,render:fm,add:am,kill:rA,modifier:iA,rawVars:0},o={targetTest:0,get:0,getSetter:um,aliases:{},register:0};if(Pa(),e!==r){if(yi[t])return;Di(r,Di(Iu(e,s),o)),Aa(r.prototype,Aa(s,Iu(e,o))),yi[r.prop=t]=r,e.targetTest&&(iu.push(r),im[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Lx(t,r),e.register&&e.register(di,r,ci)}else jx.push(e)},It=255,rl={aqua:[0,It,It],lime:[0,It,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,It],navy:[0,0,128],white:[It,It,It],olive:[128,128,0],yellow:[It,It,0],orange:[It,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[It,0,0],pink:[It,192,203],cyan:[0,It,It],transparent:[It,It,It,0]},Hf=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*It+.5|0},Zx=function(e,t,i){var r=e?Jr(e)?[e>>16,e>>8&It,e&It]:0:rl.black,s,o,a,l,c,u,d,f,h,p;if(!r){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),rl[e])r=rl[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),o=e.charAt(2),a=e.charAt(3),e="#"+s+s+o+o+a+a+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return r=parseInt(e.substr(1,6),16),[r>>16,r>>8&It,r&It,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),r=[e>>16,e>>8&It,e&It]}else if(e.substr(0,3)==="hsl"){if(r=p=e.match(U_),!t)l=+r[0]%360/360,c=+r[1]/100,u=+r[2]/100,o=u<=.5?u*(c+1):u+c-u*c,s=u*2-o,r.length>3&&(r[3]*=1),r[0]=Hf(l+1/3,s,o),r[1]=Hf(l,s,o),r[2]=Hf(l-1/3,s,o);else if(~e.indexOf("="))return r=e.match(Rx),i&&r.length<4&&(r[3]=1),r}else r=e.match(U_)||rl.transparent;r=r.map(Number)}return t&&!p&&(s=r[0]/It,o=r[1]/It,a=r[2]/It,d=Math.max(s,o,a),f=Math.min(s,o,a),u=(d+f)/2,d===f?l=c=0:(h=d-f,c=u>.5?h/(2-d-f):h/(d+f),l=d===s?(o-a)/h+(o<a?6:0):d===o?(a-s)/h+2:(s-o)/h+4,l*=60),r[0]=~~(l+.5),r[1]=~~(c*100+.5),r[2]=~~(u*100+.5)),i&&r.length<4&&(r[3]=1),r},Jx=function(e){var t=[],i=[],r=-1;return e.split(Ds).forEach(function(s){var o=s.match(ia)||[];t.push.apply(t,o),i.push(r+=o.length+1)}),t.c=i,t},z_=function(e,t,i){var r="",s=(e+r).match(Ds),o=t?"hsla(":"rgba(",a=0,l,c,u,d;if(!s)return e;if(s=s.map(function(f){return(f=Zx(f,t,1))&&o+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),i&&(u=Jx(e),l=i.c,l.join(r)!==u.c.join(r)))for(c=e.replace(Ds,"1").split(ia),d=c.length-1;a<d;a++)r+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:i).shift());if(!c)for(c=e.split(Ds),d=c.length-1;a<d;a++)r+=c[a]+s[a];return r+c[d]},Ds=(function(){var n="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in rl)n+="|"+e+"\\b";return new RegExp(n+")","gi")})(),Vw=/hsl[a]?\(/,Qx=function(e){var t=e.join(" "),i;if(Ds.lastIndex=0,Ds.test(t))return i=Vw.test(t),e[1]=z_(e[1],i),e[0]=z_(e[0],i,Jx(e[1])),!0},Vl,bi=(function(){var n=Date.now,e=500,t=33,i=n(),r=i,s=1e3/240,o=s,a=[],l,c,u,d,f,h,p=function m(_){var g=n()-r,y=_===!0,x,v,b,T;if((g>e||g<0)&&(i+=g-t),r+=g,b=r-i,x=b-o,(x>0||y)&&(T=++d.frame,f=b-d.time*1e3,d.time=b=b/1e3,o+=x+(x>=s?4:s-x),v=1),y||(l=c(m)),v)for(h=0;h<a.length;h++)a[h](b,f,T,_)};return d={time:0,frame:0,tick:function(){p(!0)},deltaRatio:function(_){return f/(1e3/(_||60))},wake:function(){Px&&(!rd&&em()&&(lr=rd=window,tm=lr.document||{},Pi.gsap=di,(lr.gsapVersions||(lr.gsapVersions=[])).push(di.version),Dx(Du||lr.GreenSockGlobals||!lr.gsap&&lr||{}),jx.forEach(Kx)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=u||function(_){return setTimeout(_,o-d.time*1e3+1|0)},Vl=1,p(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),Vl=0,c=Hl},lagSmoothing:function(_,g){e=_||1/0,t=Math.min(g||33,e)},fps:function(_){s=1e3/(_||240),o=d.time*1e3+s},add:function(_,g,y){var x=g?function(v,b,T,A){_(v,b,T,A),d.remove(x)}:_;return d.remove(_),a[y?"unshift":"push"](x),Pa(),x},remove:function(_,g){~(g=a.indexOf(_))&&a.splice(g,1)&&h>=g&&h--},_listeners:a},d})(),Pa=function(){return!Vl&&bi.wake()},dt={},Gw=/^[\d.\-M][\d.\-,\s]/,Ww=/["']/g,Xw=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),r=i[0],s=1,o=i.length,a,l,c;s<o;s++)l=i[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),t[r]=isNaN(c)?c.replace(Ww,"").trim():+c,r=l.substr(a+1).trim();return t},$w=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),r=e.indexOf("(",t);return e.substring(t,~r&&r<i?e.indexOf(")",i+1):i)},qw=function(e){var t=(e+"").split("("),i=dt[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[Xw(t[1])]:$w(e).split(",").map(Fx)):dt._CE&&Gw.test(e)?dt._CE("",e):i},Yw=function(e){return function(t){return 1-e(1-t)}},mo=function(e,t){return e&&(Yt(e)?e:dt[e]||qw(e))||t},Ro=function(e,t,i,r){i===void 0&&(i=function(l){return 1-t(1-l)}),r===void 0&&(r=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:i,easeInOut:r},o;return li(e,function(a){dt[a]=Pi[a]=s,dt[o=a.toLowerCase()]=i;for(var l in s)dt[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=dt[a+"."+l]=s[l]}),s},ey=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},zf=function n(e,t,i){var r=t>=1?t:1,s=(i||(e?.3:.45))/(t<1?t:1),o=s/id*(Math.asin(1/r)||0),a=function(u){return u===1?1:r*Math.pow(2,-10*u)*vw((u-o)*s)+1},l=e==="out"?a:e==="in"?function(c){return 1-a(1-c)}:ey(a);return s=id/s,l.config=function(c,u){return n(e,c,u)},l},Vf=function n(e,t){t===void 0&&(t=1.70158);var i=function(o){return o?--o*o*((t+1)*o+t)+1:0},r=e==="out"?i:e==="in"?function(s){return 1-i(1-s)}:ey(i);return r.config=function(s){return n(e,s)},r};li("Linear,Quad,Cubic,Quart,Quint,Strong",function(n,e){var t=e<5?e+1:e;Ro(n+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});dt.Linear.easeNone=dt.none=dt.Linear.easeIn;Ro("Elastic",zf("in"),zf("out"),zf());(function(n,e){var t=1/e,i=2*t,r=2.5*t,s=function(a){return a<t?n*a*a:a<i?n*Math.pow(a-1.5/e,2)+.75:a<r?n*(a-=2.25/e)*a+.9375:n*Math.pow(a-2.625/e,2)+.984375};Ro("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Ro("Expo",function(n){return Math.pow(2,10*(n-1))*n+n*n*n*n*n*n*(1-n)});Ro("Circ",function(n){return-(wx(1-n*n)-1)});Ro("Sine",function(n){return n===1?1:-gw(n*mw)+1});Ro("Back",Vf("in"),Vf("out"),Vf());dt.SteppedEase=dt.steps=Pi.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,r=e+(t?0:1),s=t?1:0,o=1-Nt;return function(a){return((r*ic(0,o,a)|0)+s)*i}}};Bl.ease=dt["quad.out"];li("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(n){return rm+=n+","+n+"Params,"});var ty=function(e,t){this.id=_w++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:Nx,this.set=t?t.getSetter:um},Gl=(function(){function n(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Ca(this,+t.duration,1,1),this.data=t.data,Vt&&(this._ctx=Vt,Vt.data.push(this)),Vl||bi.wake()}var e=n.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,Ca(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,r){if(Pa(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(pf(this,i),!s._dp||s.parent||kx(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&hr(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===Nt||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),Ux(this,i,r)),this},e.time=function(i,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+B_(this))%(this._dur+this._rDelay)||(i?this._dur:0),r):this._time},e.totalProgress=function(i,r){return arguments.length?this.totalTime(this.totalDuration()*i,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+B_(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,r){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*s,r):this._repeat?Ra(this._tTime,s)+1:1},e.timeScale=function(i,r){if(!arguments.length)return this._rts===-Nt?0:this._rts;if(this._rts===i)return this;var s=this.parent&&this._ts?Nu(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-Nt?0:this._rts,this.totalTime(ic(-Math.abs(this._delay),this.totalDuration(),s),r!==!1),df(this),Rw(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Pa(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Nt&&(this._tTime-=Nt)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=Gt(i);var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&hr(r,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(ai(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var r=this.parent||this._dp;return r?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Nu(r.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=Ew);var r=Ln;return Ln=i,om(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Ln=r,this},e.globalTime=function(i){for(var r=this,s=arguments.length?i:r.rawTime();r;)s=r._start+s/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(i):s},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,k_(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var r=this._time;return this._rDelay=i,k_(this),r?this.time(r):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,r){return this.totalTime(Fi(this,i),ai(r))},e.restart=function(i,r){return this.play().totalTime(i?-this._delay:0,ai(r)),this._dur||(this._zTime=-Nt),this},e.play=function(i,r){return i!=null&&this.seek(i,r),this.reversed(!1).paused(!1)},e.reverse=function(i,r){return i!=null&&this.seek(i||this.totalDuration(),r),this.reversed(!0).paused(!1)},e.pause=function(i,r){return i!=null&&this.seek(i,r),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-Nt:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-Nt,this},e.isActive=function(){var i=this.parent||this._dp,r=this._start,s;return!!(!i||this._ts&&this._initted&&i.isActive()&&(s=i.rawTime(!0))>=r&&s<this.endTime(!0)-Nt)},e.eventCallback=function(i,r,s){var o=this.vars;return arguments.length>1?(r?(o[i]=r,s&&(o[i+"Params"]=s),i==="onUpdate"&&(this._onUpdate=r)):delete o[i],this):o[i]},e.then=function(i){var r=this,s=r._prom;return new Promise(function(o){var a=Yt(i)?i:Ox,l=function(){var u=r.then;r.then=null,s&&s(),Yt(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=u),o(a),r.then=u};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?l():r._prom=l})},e.kill=function(){il(this)},n})();Di(Gl.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Nt,_prom:0,_ps:!1,_rts:1});var si=(function(n){Tx(e,n);function e(i,r){var s;return i===void 0&&(i={}),s=n.call(this,i)||this,s.labels={},s.smoothChildTiming=!!i.smoothChildTiming,s.autoRemoveChildren=!!i.autoRemoveChildren,s._sort=ai(i.sortChildren),Wt&&hr(i.parent||Wt,Nr(s),r),i.reversed&&s.reverse(),i.paused&&s.paused(!0),i.scrollTrigger&&Hx(Nr(s),i.scrollTrigger),s}var t=e.prototype;return t.to=function(r,s,o){return xl(0,arguments,this),this},t.from=function(r,s,o){return xl(1,arguments,this),this},t.fromTo=function(r,s,o,a){return xl(2,arguments,this),this},t.set=function(r,s,o){return s.duration=0,s.parent=this,vl(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new fn(r,s,Fi(this,o),1),this},t.call=function(r,s,o){return hr(this,fn.delayedCall(0,r,s),o)},t.staggerTo=function(r,s,o,a,l,c,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=u,o.parent=this,new fn(r,o,Fi(this,l)),this},t.staggerFrom=function(r,s,o,a,l,c,u){return o.runBackwards=1,vl(o).immediateRender=ai(o.immediateRender),this.staggerTo(r,s,o,a,l,c,u)},t.staggerFromTo=function(r,s,o,a,l,c,u,d){return a.startAt=o,vl(a).immediateRender=ai(a.immediateRender),this.staggerTo(r,s,a,l,c,u,d)},t.render=function(r,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=r<=0?0:Gt(r),d=this._zTime<0!=r<0&&(this._initted||!c),f,h,p,m,_,g,y,x,v,b,T,A;if(this!==Wt&&u>l&&r>=0&&(u=l),u!==this._tTime||o||d){if(a!==this._time&&c&&(u+=this._time-a,r+=this._time-a),f=u,v=this._start,x=this._ts,g=!x,d&&(c||(a=this._zTime),(r||!s)&&(this._zTime=r)),this._repeat){if(T=this._yoyo,_=c+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(_*100+r,s,o);if(f=Gt(u%_),u===l?(m=this._repeat,f=c):(b=Gt(u/_),m=~~b,m&&m===b&&(f=c,m--),f>c&&(f=c)),b=Ra(this._tTime,_),!a&&this._tTime&&b!==m&&this._tTime-b*_-this._dur<=0&&(b=m),T&&m&1&&(f=c-f,A=1),m!==b&&!this._lock){var S=T&&b&1,E=S===(T&&m&1);if(m<b&&(S=!S),a=S?0:u%c?c:u,this._lock=1,this.render(a||(A?0:Gt(m*_)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&Ti(this,"onRepeat"),this.vars.repeatRefresh&&!A&&(this.invalidate()._lock=1,b=m),a&&a!==this._time||g!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,E&&(this._lock=2,a=S?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!A&&this.invalidate()),this._lock=0,!this._ts&&!g)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(y=Lw(this,Gt(a),Gt(f)),y&&(u-=f-(f=y._start))),this._tTime=u,this._time=f,this._act=!!x,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,a=0),!a&&u&&c&&!s&&!b&&(Ti(this,"onStart"),this._tTime!==u))return this;if(f>=a&&r>=0)for(h=this._first;h;){if(p=h._next,(h._act||f>=h._start)&&h._ts&&y!==h){if(h.parent!==this)return this.render(r,s,o);if(h.render(h._ts>0?(f-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(f-h._start)*h._ts,s,o),f!==this._time||!this._ts&&!g){y=0,p&&(u+=this._zTime=-Nt);break}}h=p}else{h=this._last;for(var R=r<0?r:f;h;){if(p=h._prev,(h._act||R<=h._end)&&h._ts&&y!==h){if(h.parent!==this)return this.render(r,s,o);if(h.render(h._ts>0?(R-h._start)*h._ts:(h._dirty?h.totalDuration():h._tDur)+(R-h._start)*h._ts,s,o||Ln&&om(h)),f!==this._time||!this._ts&&!g){y=0,p&&(u+=this._zTime=R?-Nt:Nt);break}}h=p}}if(y&&!s&&(this.pause(),y.render(f>=a?0:-Nt)._zTime=f>=a?1:-1,this._ts))return this._start=v,df(this),this.render(r,s,o);this._onUpdate&&!s&&Ti(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&a)&&(v===this._start||Math.abs(x)!==Math.abs(this._ts))&&(this._lock||((r||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Ns(this,1),!s&&!(r<0&&!a)&&(u||a||!l)&&(Ti(this,u===l&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(r,s){var o=this;if(Jr(s)||(s=Fi(this,s,r)),!(r instanceof Gl)){if(Wn(r))return r.forEach(function(a){return o.add(a,s)}),this;if(Rn(r))return this.addLabel(r,s);if(Yt(r))r=fn.delayedCall(0,r);else return this}return this!==r?hr(this,r,s):this},t.getChildren=function(r,s,o,a){r===void 0&&(r=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-Vi);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof fn?s&&l.push(c):(o&&l.push(c),r&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},t.getById=function(r){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===r)return s[o]},t.remove=function(r){return Rn(r)?this.removeLabel(r):Yt(r)?this.killTweensOf(r):(r.parent===this&&hf(this,r),r===this._recent&&(this._recent=this._last),po(this))},t.totalTime=function(r,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Gt(bi.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),n.prototype.totalTime.call(this,r,s),this._forcing=0,this):this._tTime},t.addLabel=function(r,s){return this.labels[r]=Fi(this,s),this},t.removeLabel=function(r){return delete this.labels[r],this},t.addPause=function(r,s,o){var a=fn.delayedCall(0,s||Hl,o);return a.data="isPause",this._hasPause=1,hr(this,a,Fi(this,r))},t.removePause=function(r){var s=this._first;for(r=Fi(this,r);s;)s._start===r&&s.data==="isPause"&&Ns(s),s=s._next},t.killTweensOf=function(r,s,o){for(var a=this.getTweensOf(r,o),l=a.length;l--;)Ss!==a[l]&&a[l].kill(r,s);return this},t.getTweensOf=function(r,s){for(var o=[],a=Gi(r),l=this._first,c=Jr(s),u;l;)l instanceof fn?Tw(l._targets,a)&&(c?(!Ss||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(u=l.getTweensOf(a,s)).length&&o.push.apply(o,u),l=l._next;return o},t.tweenTo=function(r,s){s=s||{};var o=this,a=Fi(o,r),l=s,c=l.startAt,u=l.onStart,d=l.onStartParams,f=l.immediateRender,h,p=fn.to(o,Di({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||Nt,onStart:function(){if(o.pause(),!h){var _=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());p._dur!==_&&Ca(p,_,0,1).render(p._time,!0,!0),h=1}u&&u.apply(p,d||[])}},s));return f?p.render(0):p},t.tweenFromTo=function(r,s,o){return this.tweenTo(s,Di({startAt:{time:Fi(this,r)}},o))},t.recent=function(){return this._recent},t.nextLabel=function(r){return r===void 0&&(r=this._time),H_(this,Fi(this,r))},t.previousLabel=function(r){return r===void 0&&(r=this._time),H_(this,Fi(this,r),1)},t.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+Nt)},t.shiftChildren=function(r,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(r=Gt(r);a;)a._start>=o&&(a._start+=r,a._end+=r),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=r);return po(this)},t.invalidate=function(r){var s=this._first;for(this._lock=0;s;)s.invalidate(r),s=s._next;return n.prototype.invalidate.call(this,r)},t.clear=function(r){r===void 0&&(r=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),po(this)},t.totalDuration=function(r){var s=0,o=this,a=o._last,l=Vi,c,u,d;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-r:r));if(o._dirty){for(d=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,hr(o,a,u-a._delay,1)._lock=0):l=u,u<0&&a._ts&&(s-=u,(!d&&!o._dp||d&&d.smoothChildTiming)&&(o._start+=Gt(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;Ca(o,o===Wt&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},e.updateRoot=function(r){if(Wt._ts&&(Ux(Wt,Nu(r,Wt)),Ix=bi.frame),bi.frame>=F_){F_+=Ri.autoSleep||120;var s=Wt._first;if((!s||!s._ts)&&Ri.autoSleep&&bi._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||bi.sleep()}}},e})(Gl);Di(si.prototype,{_lock:0,_hasPause:0,_forcing:0});var jw=function(e,t,i,r,s,o,a){var l=new ci(this._pt,e,t,0,1,ay,null,s),c=0,u=0,d,f,h,p,m,_,g,y;for(l.b=i,l.e=r,i+="",r+="",(g=~r.indexOf("random("))&&(r=zl(r)),o&&(y=[i,r],o(y,e,t),i=y[0],r=y[1]),f=i.match(Bf)||[];d=Bf.exec(r);)p=d[0],m=r.substring(c,d.index),h?h=(h+1)%5:m.substr(-5)==="rgba("&&(h=1),p!==f[u++]&&(_=parseFloat(f[u-1])||0,l._pt={_next:l._pt,p:m||u===1?m:",",s:_,c:p.charAt(1)==="="?da(_,p)-_:parseFloat(p)-_,m:h&&h<4?Math.round:0},c=Bf.lastIndex);return l.c=c<r.length?r.substring(c,r.length):"",l.fp=a,(Cx.test(r)||g)&&(l.e=0),this._pt=l,l},am=function(e,t,i,r,s,o,a,l,c,u){Yt(r)&&(r=r(s||0,e,o));var d=e[t],f=i!=="get"?i:Yt(d)?c?e[t.indexOf("set")||!Yt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():d,h=Yt(d)?c?eA:sy:cm,p;if(Rn(r)&&(~r.indexOf("random(")&&(r=zl(r)),r.charAt(1)==="="&&(p=da(f,r)+(zn(f)||0),(p||p===0)&&(r=p))),!u||f!==r||fd)return!isNaN(f*r)&&r!==""?(p=new ci(this._pt,e,t,+f||0,r-(f||0),typeof d=="boolean"?nA:oy,0,h),c&&(p.fp=c),a&&p.modifier(a,this,e),this._pt=p):(!d&&!(t in e)&&nm(t,r),jw.call(this,e,t,f,r,h,l||Ri.stringFilter,c))},Kw=function(e,t,i,r,s){if(Yt(e)&&(e=yl(e,s,t,i,r)),!br(e)||e.style&&e.nodeType||Wn(e)||Ax(e))return Rn(e)?yl(e,s,t,i,r):e;var o={},a;for(a in e)o[a]=yl(e[a],s,t,i,r);return o},ny=function(e,t,i,r,s,o){var a,l,c,u;if(yi[e]&&(a=new yi[e]).init(s,a.rawVars?t[e]:Kw(t[e],r,s,o,i),i,r,o)!==!1&&(i._pt=l=new ci(i._pt,s,e,0,1,a.render,a,0,a.priority),i!==ra))for(c=i._ptLookup[i._targets.indexOf(s)],u=a._props.length;u--;)c[a._props[u]]=l;return a},Ss,fd,lm=function n(e,t,i){var r=e.vars,s=r.ease,o=r.startAt,a=r.immediateRender,l=r.lazy,c=r.onUpdate,u=r.runBackwards,d=r.yoyoEase,f=r.keyframes,h=r.autoRevert,p=e._dur,m=e._startAt,_=e._targets,g=e.parent,y=g&&g.data==="nested"?g.vars.targets:_,x=e._overwrite==="auto"&&!Jp,v=e.timeline,b=r.easeReverse||d,T,A,S,E,R,D,N,V,z,O,F,k,H;if(v&&(!f||!s)&&(s="none"),e._ease=mo(s,Bl.ease),e._rEase=b&&(mo(b)||e._ease),e._from=!v&&!!r.runBackwards,e._from&&(e.ratio=1),!v||f&&!r.stagger){if(V=_[0]?ho(_[0]).harness:0,k=V&&r[V.prop],T=Iu(r,im),m&&(m._zTime<0&&m.progress(1),t<0&&u&&a&&!h?m.render(-1,!0):m.revert(u&&p?nu:bw),m._lazy=0),o){if(Ns(e._startAt=fn.set(_,Di({data:"isStart",overwrite:!1,parent:g,immediateRender:!0,lazy:!m&&ai(l),startAt:null,delay:0,onUpdate:c&&function(){return Ti(e,"onUpdate")},stagger:0},o))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Ln||!a&&!h)&&e._startAt.revert(nu),a&&p&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(u&&p&&!m){if(t&&(a=!1),S=Di({overwrite:!1,data:"isFromStart",lazy:a&&!m&&ai(l),immediateRender:a,stagger:0,parent:g},T),k&&(S[V.prop]=k),Ns(e._startAt=fn.set(_,S)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Ln?e._startAt.revert(nu):e._startAt.render(-1,!0)),e._zTime=t,!a)n(e._startAt,Nt,Nt);else if(!t)return}for(e._pt=e._ptCache=0,l=p&&ai(l)||l&&!p,A=0;A<_.length;A++){if(R=_[A],N=R._gsap||sm(_)[A]._gsap,e._ptLookup[A]=O={},sd[N.id]&&Ps.length&&Lu(),F=y===_?A:y.indexOf(R),V&&(z=new V).init(R,k||T,e,F,y)!==!1&&(e._pt=E=new ci(e._pt,R,z.name,0,1,z.render,z,0,z.priority),z._props.forEach(function(X){O[X]=E}),z.priority&&(D=1)),!V||k)for(S in T)yi[S]&&(z=ny(S,T,e,F,R,y))?z.priority&&(D=1):O[S]=E=am.call(e,R,S,"get",T[S],F,y,0,r.stringFilter);e._op&&e._op[A]&&e.kill(R,e._op[A]),x&&e._pt&&(Ss=e,Wt.killTweensOf(R,O,e.globalTime(t)),H=!e.parent,Ss=0),e._pt&&l&&(sd[N.id]=1)}D&&ly(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!H,f&&t<=0&&v.render(Vi,!0,!0)},Zw=function(e,t,i,r,s,o,a,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,d,f,h;if(!c)for(c=e._ptCache[t]=[],f=e._ptLookup,h=e._targets.length;h--;){if(u=f[h][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return fd=1,e.vars[t]="+=0",lm(e,a),fd=0,l?kl(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(h=c.length;h--;)d=c[h],u=d._pt||d,u.s=(r||r===0)&&!s?r:u.s+(r||0)+o*u.c,u.c=i-u.s,d.e&&(d.e=Jt(i)+zn(d.e)),d.b&&(d.b=u.s+zn(d.b))},Jw=function(e,t){var i=e[0]?ho(e[0]).harness:0,r=i&&i.aliases,s,o,a,l;if(!r)return t;s=Aa({},t);for(o in r)if(o in s)for(l=r[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},Qw=function(e,t,i,r){var s=t.ease||r||"power1.inOut",o,a;if(Wn(t))a=i[e]||(i[e]=[]),t.forEach(function(l,c){return a.push({t:c/(t.length-1)*100,v:l,e:s})});else for(o in t)a=i[o]||(i[o]=[]),o==="ease"||a.push({t:parseFloat(e),v:t[o],e:s})},yl=function(e,t,i,r,s){return Yt(e)?e.call(t,i,r,s):Rn(e)&&~e.indexOf("random(")?zl(e):e},iy=rm+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",ry={};li(iy+",id,stagger,delay,duration,paused,scrollTrigger",function(n){return ry[n]=1});var fn=(function(n){Tx(e,n);function e(i,r,s,o){var a;typeof r=="number"&&(s.duration=r,r=s,s=null),a=n.call(this,o?r:vl(r))||this;var l=a.vars,c=l.duration,u=l.delay,d=l.immediateRender,f=l.stagger,h=l.overwrite,p=l.keyframes,m=l.defaults,_=l.scrollTrigger,g=r.parent||Wt,y=(Wn(i)||Ax(i)?Jr(i[0]):"length"in r)?[i]:Gi(i),x,v,b,T,A,S,E,R;if(a._targets=y.length?sm(y):kl("GSAP target "+i+" not found. https://gsap.com",!Ri.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=h,p||f||_c(c)||_c(u)){r=a.vars;var D=r.easeReverse||r.yoyoEase;if(x=a.timeline=new si({data:"nested",defaults:m||{},targets:g&&g.data==="nested"?g.vars.targets:y}),x.kill(),x.parent=x._dp=Nr(a),x._start=0,f||_c(c)||_c(u)){if(T=y.length,E=f&&Wx(f),br(f))for(A in f)~iy.indexOf(A)&&(R||(R={}),R[A]=f[A]);for(v=0;v<T;v++)b=Iu(r,ry),b.stagger=0,D&&(b.easeReverse=D),R&&Aa(b,R),S=y[v],b.duration=+yl(c,Nr(a),v,S,y),b.delay=(+yl(u,Nr(a),v,S,y)||0)-a._delay,!f&&T===1&&b.delay&&(a._delay=u=b.delay,a._start+=u,b.delay=0),x.to(S,b,E?E(v,S,y):0),x._ease=dt.none;x.duration()?c=u=0:a.timeline=0}else if(p){vl(Di(x.vars.defaults,{ease:"none"})),x._ease=mo(p.ease||r.ease||"none");var N=0,V,z,O;if(Wn(p))p.forEach(function(F){return x.to(y,F,">")}),x.duration();else{b={};for(A in p)A==="ease"||A==="easeEach"||Qw(A,p[A],b,p.easeEach);for(A in b)for(V=b[A].sort(function(F,k){return F.t-k.t}),N=0,v=0;v<V.length;v++)z=V[v],O={ease:z.e,duration:(z.t-(v?V[v-1].t:0))/100*c},O[A]=z.v,x.to(y,O,N),N+=O.duration;x.duration()<c&&x.to({},{duration:c-x.duration()})}}c||a.duration(c=x.duration())}else a.timeline=0;return h===!0&&!Jp&&(Ss=Nr(a),Wt.killTweensOf(y),Ss=0),hr(g,Nr(a),s),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(d||!c&&!p&&a._start===Gt(g._time)&&ai(d)&&Cw(Nr(a))&&g.data!=="nested")&&(a._tTime=-Nt,a.render(Math.max(0,-u)||0)),_&&Hx(Nr(a),_),a}var t=e.prototype;return t.render=function(r,s,o){var a=this._time,l=this._tDur,c=this._dur,u=r<0,d=r>l-Nt&&!u?l:r<Nt?0:r,f,h,p,m,_,g,y,x;if(!c)Dw(this,r,s,o);else if(d!==this._tTime||!r||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=d,x=this.timeline,this._repeat){if(m=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(m*100+r,s,o);if(f=Gt(d%m),d===l?(p=this._repeat,f=c):(_=Gt(d/m),p=~~_,p&&p===_?(f=c,p--):f>c&&(f=c)),g=this._yoyo&&p&1,g&&(f=c-f),_=Ra(this._tTime,m),f===a&&!o&&this._initted&&p===_)return this._tTime=d,this;p!==_&&this.vars.repeatRefresh&&!g&&!this._lock&&f!==m&&this._initted&&(this._lock=o=1,this.render(Gt(m*p),!0).invalidate()._lock=0)}if(!this._initted){if(zx(this,u?r:f,o,s,d))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&p!==_))return this;if(c!==this._dur)return this.render(r,s,o)}if(this._rEase){var v=f<a;if(v!==this._inv){var b=v?a:c-a;this._inv=v,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=b?(v?-1:1)/b:0,this._invScale=v?-this.ratio:1-this.ratio,this._invEase=v?this._rEase:this._ease}this.ratio=y=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=y=this._ease(f/c);if(this._from&&(this.ratio=y=1-y),this._tTime=d,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&d&&!s&&!_&&(Ti(this,"onStart"),this._tTime!==d))return this;for(h=this._pt;h;)h.r(y,h.d),h=h._next;x&&x.render(r<0?r:x._dur*x._ease(f/this._dur),s,o)||this._startAt&&(this._zTime=r),this._onUpdate&&!s&&(u&&od(this,r,s,o),Ti(this,"onUpdate")),this._repeat&&p!==_&&this.vars.onRepeat&&!s&&this.parent&&Ti(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(u&&!this._onUpdate&&od(this,r,!0,!0),(r||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&Ns(this,1),!s&&!(u&&!a)&&(d||a||g)&&(Ti(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),n.prototype.invalidate.call(this,r)},t.resetTo=function(r,s,o,a,l){Vl||bi.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||lm(this,c),u=this._ease(c/this._dur),Zw(this,r,s,o,a,u,c,l)?this.resetTo(r,s,o,a,1):(pf(this,0),this.parent||Bx(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(r,s){if(s===void 0&&(s="all"),!r&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?il(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Ln),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(r,s,Ss&&Ss.vars.overwrite!==!0)._first||il(this),this.parent&&o!==this.timeline.totalDuration()&&Ca(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=r?Gi(r):a,c=this._ptLookup,u=this._pt,d,f,h,p,m,_,g;if((!s||s==="all")&&Aw(a,l))return s==="all"&&(this._pt=0),il(this);for(d=this._op=this._op||[],s!=="all"&&(Rn(s)&&(m={},li(s,function(y){return m[y]=1}),s=m),s=Jw(a,s)),g=a.length;g--;)if(~l.indexOf(a[g])){f=c[g],s==="all"?(d[g]=s,p=f,h={}):(h=d[g]=d[g]||{},p=s);for(m in p)_=f&&f[m],_&&((!("kill"in _.d)||_.d.kill(m)===!0)&&hf(this,_,"_pt"),delete f[m]),h!=="all"&&(h[m]=1)}return this._initted&&!this._pt&&u&&il(this),this},e.to=function(r,s){return new e(r,s,arguments[2])},e.from=function(r,s){return xl(1,arguments)},e.delayedCall=function(r,s,o,a){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},e.fromTo=function(r,s,o){return xl(2,arguments)},e.set=function(r,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(r,s)},e.killTweensOf=function(r,s,o){return Wt.killTweensOf(r,s,o)},e})(Gl);Di(fn.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});li("staggerTo,staggerFrom,staggerFromTo",function(n){fn[n]=function(){var e=new si,t=ld.call(arguments,0);return t.splice(n==="staggerFromTo"?5:4,0,0),e[n].apply(e,t)}});var cm=function(e,t,i){return e[t]=i},sy=function(e,t,i){return e[t](i)},eA=function(e,t,i,r){return e[t](r.fp,i)},tA=function(e,t,i){return e.setAttribute(t,i)},um=function(e,t){return Yt(e[t])?sy:Qp(e[t])&&e.setAttribute?tA:cm},oy=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},nA=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},ay=function(e,t){var i=t._pt,r="";if(!e&&t.b)r=t.b;else if(e===1&&t.e)r=t.e;else{for(;i;)r=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+r,i=i._next;r+=t.c}t.set(t.t,t.p,r,t)},fm=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},iA=function(e,t,i,r){for(var s=this._pt,o;s;)o=s._next,s.p===r&&s.modifier(e,t,i),s=o},rA=function(e){for(var t=this._pt,i,r;t;)r=t._next,t.p===e&&!t.op||t.op===e?hf(this,t,"_pt"):t.dep||(i=1),t=r;return!i},sA=function(e,t,i,r){r.mSet(e,t,r.m.call(r.tween,i,r.mt),r)},ly=function(e){for(var t=e._pt,i,r,s,o;t;){for(i=t._next,r=s;r&&r.pr>t.pr;)r=r._next;(t._prev=r?r._prev:o)?t._prev._next=t:s=t,(t._next=r)?r._prev=t:o=t,t=i}e._pt=s},ci=(function(){function n(t,i,r,s,o,a,l,c,u){this.t=i,this.s=s,this.c=o,this.p=r,this.r=a||oy,this.d=l||this,this.set=c||cm,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=n.prototype;return e.modifier=function(i,r,s){this.mSet=this.mSet||this.set,this.set=sA,this.m=i,this.mt=s,this.tween=r},n})();li(rm+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(n){return im[n]=1});Pi.TweenMax=Pi.TweenLite=fn;Pi.TimelineLite=Pi.TimelineMax=si;Wt=new si({sortChildren:!1,defaults:Bl,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Ri.stringFilter=Qx;var _o=[],ru={},oA=[],V_=0,aA=0,Gf=function(e){return(ru[e]||oA).map(function(t){return t()})},hd=function(){var e=Date.now(),t=[];e-V_>2&&(Gf("matchMediaInit"),_o.forEach(function(i){var r=i.queries,s=i.conditions,o,a,l,c;for(a in r)o=lr.matchMedia(r[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(i.revert(),l&&t.push(i))}),Gf("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(r){return i.add(null,r)})}),V_=e,Gf("matchMedia"))},cy=(function(){function n(t,i){this.selector=i&&cd(i),this.data=[],this._r=[],this.isReverted=!1,this.id=aA++,t&&this.add(t)}var e=n.prototype;return e.add=function(i,r,s){Yt(i)&&(s=r,r=i,i=Yt);var o=this,a=function(){var c=Vt,u=o.selector,d;return c&&c!==o&&c.data.push(o),s&&(o.selector=cd(s)),Vt=o,d=r.apply(o,arguments),Yt(d)&&o._r.push(d),Vt=c,o.selector=u,o.isReverted=!1,d};return o.last=a,i===Yt?a(o,function(l){return o.add(null,l)}):i?o[i]=a:a},e.ignore=function(i){var r=Vt;Vt=null,i(this),Vt=r},e.getTweens=function(){var i=[];return this.data.forEach(function(r){return r instanceof n?i.push.apply(i,r.getTweens()):r instanceof fn&&!(r.parent&&r.parent.data==="nested")&&i.push(r)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,r){var s=this;if(i?(function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,d){return d.g-u.g||-1/0}).forEach(function(u){return u.t.revert(i)}),l=s.data.length;l--;)c=s.data[l],c instanceof si?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof fn)&&c.revert&&c.revert(i);s._r.forEach(function(u){return u(i,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),r)for(var o=_o.length;o--;)_o[o].id===this.id&&_o.splice(o,1)},e.revert=function(i){this.kill(i||{})},n})(),lA=(function(){function n(t){this.contexts=[],this.scope=t,Vt&&Vt.data.push(this)}var e=n.prototype;return e.add=function(i,r,s){br(i)||(i={matches:i});var o=new cy(0,s||this.scope),a=o.conditions={},l,c,u;Vt&&!o.selector&&(o.selector=Vt.selector),this.contexts.push(o),r=o.add("onMatch",r),o.queries=i;for(c in i)c==="all"?u=1:(l=lr.matchMedia(i[c]),l&&(_o.indexOf(o)<0&&_o.push(o),(a[c]=l.matches)&&(u=1),l.addListener?l.addListener(hd):l.addEventListener("change",hd)));return u&&r(o,function(d){return o.add(null,d)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(r){return r.kill(i,!0)})},n})(),Uu={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(r){return Kx(r)})},timeline:function(e){return new si(e)},getTweensOf:function(e,t){return Wt.getTweensOf(e,t)},getProperty:function(e,t,i,r){Rn(e)&&(e=Gi(e)[0]);var s=ho(e||{}).get,o=i?Ox:Fx;return i==="native"&&(i=""),e&&(t?o((yi[t]&&yi[t].get||s)(e,t,i,r)):function(a,l,c){return o((yi[a]&&yi[a].get||s)(e,a,l,c))})},quickSetter:function(e,t,i){if(e=Gi(e),e.length>1){var r=e.map(function(u){return di.quickSetter(u,t,i)}),s=r.length;return function(u){for(var d=s;d--;)r[d](u)}}e=e[0]||{};var o=yi[t],a=ho(e),l=a.harness&&(a.harness.aliases||{})[t]||t,c=o?function(u){var d=new o;ra._pt=0,d.init(e,i?u+i:u,ra,0,[e]),d.render(1,d),ra._pt&&fm(1,ra)}:a.set(e,l);return o?c:function(u){return c(e,l,i?u+i:u,a,1)}},quickTo:function(e,t,i){var r,s=di.to(e,Di((r={},r[t]="+=0.1",r.paused=!0,r.stagger=0,r),i||{})),o=function(l,c,u){return s.resetTo(t,l,c,u)};return o.tween=s,o},isTweening:function(e){return Wt.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=mo(e.ease,Bl.ease)),O_(Bl,e||{})},config:function(e){return O_(Ri,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,r=e.plugins,s=e.defaults,o=e.extendTimeline;(r||"").split(",").forEach(function(a){return a&&!yi[a]&&!Pi[a]&&kl(t+" effect requires "+a+" plugin.")}),kf[t]=function(a,l,c){return i(Gi(a),Di(l||{},s),c)},o&&(si.prototype[t]=function(a,l,c){return this.add(kf[t](a,br(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){dt[e]=mo(t)},parseEase:function(e,t){return arguments.length?mo(e,t):dt},getById:function(e){return Wt.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new si(e),r,s;for(i.smoothChildTiming=ai(e.smoothChildTiming),Wt.remove(i),i._dp=0,i._time=i._tTime=Wt._time,r=Wt._first;r;)s=r._next,(t||!(!r._dur&&r instanceof fn&&r.vars.onComplete===r._targets[0]))&&hr(i,r,r._start-r._delay),r=s;return hr(Wt,i,0),i},context:function(e,t){return e?new cy(e,t):Vt},matchMedia:function(e){return new lA(e)},matchMediaRefresh:function(){return _o.forEach(function(e){var t=e.conditions,i,r;for(r in t)t[r]&&(t[r]=!1,i=1);i&&e.revert()})||hd()},addEventListener:function(e,t){var i=ru[e]||(ru[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=ru[e],r=i&&i.indexOf(t);r>=0&&i.splice(r,1)},utils:{wrap:kw,wrapYoyo:Hw,distribute:Wx,random:$x,snap:Xx,normalize:Bw,getUnit:zn,clamp:Nw,splitColor:Zx,toArray:Gi,selector:cd,mapRange:Yx,pipe:Fw,unitize:Ow,interpolate:zw,shuffle:Gx},install:Dx,effects:kf,ticker:bi,updateRoot:si.updateRoot,plugins:yi,globalTimeline:Wt,core:{PropTween:ci,globals:Lx,Tween:fn,Timeline:si,Animation:Gl,getCache:ho,_removeLinkedListItem:hf,reverting:function(){return Ln},context:function(e){return e&&Vt&&(Vt.data.push(e),e._ctx=Vt),Vt},suppressOverwrites:function(e){return Jp=e}}};li("to,from,fromTo,delayedCall,set,killTweensOf",function(n){return Uu[n]=fn[n]});bi.add(si.updateRoot);ra=Uu.to({},{duration:0});var cA=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},uA=function(e,t){var i=e._targets,r,s,o;for(r in t)for(s=i.length;s--;)o=e._ptLookup[s][r],o&&(o=o.d)&&(o._pt&&(o=cA(o,r)),o&&o.modifier&&o.modifier(t[r],e,i[s],r))},Wf=function(e,t){return{name:e,headless:1,rawVars:1,init:function(r,s,o){o._onInit=function(a){var l,c;if(Rn(s)&&(l={},li(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}uA(a,s)}}}},di=Uu.registerPlugin({name:"attr",init:function(e,t,i,r,s){var o,a,l;this.tween=i;for(o in t)l=e.getAttribute(o)||"",a=this.add(e,"setAttribute",(l||0)+"",t[o],r,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(e,t){for(var i=t._pt;i;)Ln?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},Wf("roundProps",ud),Wf("modifiers"),Wf("snap",Xx))||Uu;fn.version=si.version=di.version="3.15.0";Px=1;em()&&Pa();dt.Power0;dt.Power1;dt.Power2;dt.Power3;dt.Power4;dt.Linear;dt.Quad;dt.Cubic;dt.Quart;dt.Quint;dt.Strong;dt.Elastic;dt.Back;dt.SteppedEase;dt.Bounce;dt.Sine;dt.Expo;dt.Circ;var G_,Ms,pa,hm,io,W_,dm,fA=function(){return typeof window<"u"},Qr={},Zs=180/Math.PI,ma=Math.PI/180,Uo=Math.atan2,X_=1e8,pm=/([A-Z])/g,hA=/(left|right|width|margin|padding|x)/i,dA=/[\s,\(]\S/,dr={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},dd=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},pA=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},mA=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},_A=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},gA=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},uy=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},fy=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},vA=function(e,t,i){return e.style[t]=i},xA=function(e,t,i){return e.style.setProperty(t,i)},yA=function(e,t,i){return e._gsap[t]=i},SA=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},MA=function(e,t,i,r,s){var o=e._gsap;o.scaleX=o.scaleY=i,o.renderTransform(s,o)},bA=function(e,t,i,r,s){var o=e._gsap;o[t]=i,o.renderTransform(s,o)},$t="transform",ui=$t+"Origin",EA=function n(e,t){var i=this,r=this.target,s=r.style,o=r._gsap;if(e in Qr&&s){if(this.tfm=this.tfm||{},e!=="transform")e=dr[e]||e,~e.indexOf(",")?e.split(",").forEach(function(a){return i.tfm[a]=Fr(r,a)}):this.tfm[e]=o.x?o[e]:Fr(r,e),e===ui&&(this.tfm.zOrigin=o.zOrigin);else return dr.transform.split(",").forEach(function(a){return n.call(i,a,t)});if(this.props.indexOf($t)>=0)return;o.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(ui,t,"")),e=$t}(s||t)&&this.props.push(e,t,s[e])},hy=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},TA=function(){var e=this.props,t=this.target,i=t.style,r=t._gsap,s,o;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?i[e[s]]=e[s+2]:i.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(pm,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)r[o]=this.tfm[o];r.svg&&(r.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=dm(),(!s||!s.isStart)&&!i[$t]&&(hy(i),r.zOrigin&&i[ui]&&(i[ui]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},dy=function(e,t){var i={target:e,props:[],revert:TA,save:EA};return e._gsap||di.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(r){return i.save(r)}),i},py,pd=function(e,t){var i=Ms.createElementNS?Ms.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Ms.createElement(e);return i&&i.style?i:Ms.createElement(e)},wi=function n(e,t,i){var r=getComputedStyle(e);return r[t]||r.getPropertyValue(t.replace(pm,"-$1").toLowerCase())||r.getPropertyValue(t)||!i&&n(e,Da(t)||t,1)||""},$_="O,Moz,ms,Ms,Webkit".split(","),Da=function(e,t,i){var r=t||io,s=r.style,o=5;if(e in s&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);o--&&!($_[o]+e in s););return o<0?null:(o===3?"ms":o>=0?$_[o]:"")+e},md=function(){fA()&&window.document&&(G_=window,Ms=G_.document,pa=Ms.documentElement,io=pd("div")||{style:{}},pd("div"),$t=Da($t),ui=$t+"Origin",io.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",py=!!Da("perspective"),dm=di.core.reverting,hm=1)},q_=function(e){var t=e.ownerSVGElement,i=pd("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=e.cloneNode(!0),s;r.style.display="block",i.appendChild(r),pa.appendChild(i);try{s=r.getBBox()}catch{}return i.removeChild(r),pa.removeChild(i),s},Y_=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},my=function(e){var t,i;try{t=e.getBBox()}catch{t=q_(e),i=1}return t&&(t.width||t.height)||i||(t=q_(e)),t&&!t.width&&!t.x&&!t.y?{x:+Y_(e,["x","cx","x1"])||0,y:+Y_(e,["y","cy","y1"])||0,width:0,height:0}:t},_y=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&my(e))},Us=function(e,t){if(t){var i=e.style,r;t in Qr&&t!==ui&&(t=$t),i.removeProperty?(r=t.substr(0,2),(r==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(r==="--"?t:t.replace(pm,"-$1").toLowerCase())):i.removeAttribute(t)}},bs=function(e,t,i,r,s,o){var a=new ci(e._pt,t,i,0,1,o?fy:uy);return e._pt=a,a.b=r,a.e=s,e._props.push(i),a},j_={deg:1,rad:1,turn:1},wA={grid:1,flex:1},Fs=function n(e,t,i,r){var s=parseFloat(i)||0,o=(i+"").trim().substr((s+"").length)||"px",a=io.style,l=hA.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),d=100,f=r==="px",h=r==="%",p,m,_,g;if(r===o||!s||j_[r]||j_[o])return s;if(o!=="px"&&!f&&(s=n(e,t,i,"px")),g=e.getCTM&&_y(e),(h||o==="%")&&(Qr[t]||~t.indexOf("adius")))return p=g?e.getBBox()[l?"width":"height"]:e[u],Jt(h?s/p*d:s/100*p);if(a[l?"width":"height"]=d+(f?o:r),m=r!=="rem"&&~t.indexOf("adius")||r==="em"&&e.appendChild&&!c?e:e.parentNode,g&&(m=(e.ownerSVGElement||{}).parentNode),(!m||m===Ms||!m.appendChild)&&(m=Ms.body),_=m._gsap,_&&h&&_.width&&l&&_.time===bi.time&&!_.uncache)return Jt(s/_.width*d);if(h&&(t==="height"||t==="width")){var y=e.style[t];e.style[t]=d+r,p=e[u],y?e.style[t]=y:Us(e,t)}else(h||o==="%")&&!wA[wi(m,"display")]&&(a.position=wi(e,"position")),m===e&&(a.position="static"),m.appendChild(io),p=io[u],m.removeChild(io),a.position="absolute";return l&&h&&(_=ho(m),_.time=bi.time,_.width=m[u]),Jt(f?p*s/d:p&&s?d/p*s:0)},Fr=function(e,t,i,r){var s;return hm||md(),t in dr&&t!=="transform"&&(t=dr[t],~t.indexOf(",")&&(t=t.split(",")[0])),Qr[t]&&t!=="transform"?(s=Xl(e,r),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:Ou(wi(e,ui))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||r||~(s+"").indexOf("calc("))&&(s=Fu[t]&&Fu[t](e,t,i)||wi(e,t)||Nx(e,t)||(t==="opacity"?1:0))),i&&!~(s+"").trim().indexOf(" ")?Fs(e,t,s,i)+i:s},AA=function(e,t,i,r){if(!i||i==="none"){var s=Da(t,e,1),o=s&&wi(e,s,1);o&&o!==i?(t=s,i=o):t==="borderColor"&&(i=wi(e,"borderTopColor"))}var a=new ci(this._pt,e.style,t,0,1,ay),l=0,c=0,u,d,f,h,p,m,_,g,y,x,v,b;if(a.b=i,a.e=r,i+="",r+="",r.substring(0,6)==="var(--"&&(r=wi(e,r.substring(4,r.indexOf(")")))),r==="auto"&&(m=e.style[t],e.style[t]=r,r=wi(e,t)||r,m?e.style[t]=m:Us(e,t)),u=[i,r],Qx(u),i=u[0],r=u[1],f=i.match(ia)||[],b=r.match(ia)||[],b.length){for(;d=ia.exec(r);)_=d[0],y=r.substring(l,d.index),p?p=(p+1)%5:(y.substr(-5)==="rgba("||y.substr(-5)==="hsla(")&&(p=1),_!==(m=f[c++]||"")&&(h=parseFloat(m)||0,v=m.substr((h+"").length),_.charAt(1)==="="&&(_=da(h,_)+v),g=parseFloat(_),x=_.substr((g+"").length),l=ia.lastIndex-x.length,x||(x=x||Ri.units[t]||v,l===r.length&&(r+=x,a.e+=x)),v!==x&&(h=Fs(e,t,m,x)||0),a._pt={_next:a._pt,p:y||c===1?y:",",s:h,c:g-h,m:p&&p<4||t==="zIndex"?Math.round:0});a.c=l<r.length?r.substring(l,r.length):""}else a.r=t==="display"&&r==="none"?fy:uy;return Cx.test(r)&&(a.e=0),this._pt=a,a},K_={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},RA=function(e){var t=e.split(" "),i=t[0],r=t[1]||"50%";return(i==="top"||i==="bottom"||r==="left"||r==="right")&&(e=i,i=r,r=e),t[0]=K_[i]||i,t[1]=K_[r]||r,t.join(" ")},CA=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,r=i.style,s=t.u,o=i._gsap,a,l,c;if(s==="all"||s===!0)r.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Qr[a]&&(l=1,a=a==="transformOrigin"?ui:$t),Us(i,a);l&&(Us(i,$t),o&&(o.svg&&i.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",Xl(i,1),o.uncache=1,hy(r)))}},Fu={clearProps:function(e,t,i,r,s){if(s.data!=="isFromStart"){var o=e._pt=new ci(e._pt,t,i,0,0,CA);return o.u=r,o.pr=-10,o.tween=s,e._props.push(i),1}}},Wl=[1,0,0,1,0,0],gy={},vy=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},Z_=function(e){var t=wi(e,$t);return vy(t)?Wl:t.substr(7).match(Rx).map(Jt)},mm=function(e,t){var i=e._gsap||ho(e),r=e.style,s=Z_(e),o,a,l,c;return i.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Wl:s):(s===Wl&&!e.offsetParent&&e!==pa&&!i.svg&&(l=r.display,r.display="block",o=e.parentNode,(!o||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,a=e.nextElementSibling,pa.appendChild(e)),s=Z_(e),l?r.display=l:Us(e,"display"),c&&(a?o.insertBefore(e,a):o?o.appendChild(e):pa.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},_d=function(e,t,i,r,s,o){var a=e._gsap,l=s||mm(e,!0),c=a.xOrigin||0,u=a.yOrigin||0,d=a.xOffset||0,f=a.yOffset||0,h=l[0],p=l[1],m=l[2],_=l[3],g=l[4],y=l[5],x=t.split(" "),v=parseFloat(x[0])||0,b=parseFloat(x[1])||0,T,A,S,E;i?l!==Wl&&(A=h*_-p*m)&&(S=v*(_/A)+b*(-m/A)+(m*y-_*g)/A,E=v*(-p/A)+b*(h/A)-(h*y-p*g)/A,v=S,b=E):(T=my(e),v=T.x+(~x[0].indexOf("%")?v/100*T.width:v),b=T.y+(~(x[1]||x[0]).indexOf("%")?b/100*T.height:b)),r||r!==!1&&a.smooth?(g=v-c,y=b-u,a.xOffset=d+(g*h+y*m)-g,a.yOffset=f+(g*p+y*_)-y):a.xOffset=a.yOffset=0,a.xOrigin=v,a.yOrigin=b,a.smooth=!!r,a.origin=t,a.originIsAbsolute=!!i,e.style[ui]="0px 0px",o&&(bs(o,a,"xOrigin",c,v),bs(o,a,"yOrigin",u,b),bs(o,a,"xOffset",d,a.xOffset),bs(o,a,"yOffset",f,a.yOffset)),e.setAttribute("data-svg-origin",v+" "+b)},Xl=function(e,t){var i=e._gsap||new ty(e);if("x"in i&&!t&&!i.uncache)return i;var r=e.style,s=i.scaleX<0,o="px",a="deg",l=getComputedStyle(e),c=wi(e,ui)||"0",u,d,f,h,p,m,_,g,y,x,v,b,T,A,S,E,R,D,N,V,z,O,F,k,H,X,L,ue,de,ke,ze,Ne;return u=d=f=m=_=g=y=x=v=0,h=p=1,i.svg=!!(e.getCTM&&_y(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(r[$t]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[$t]!=="none"?l[$t]:"")),r.scale=r.rotate=r.translate="none"),A=mm(e,i.svg),i.svg&&(i.uncache?(H=e.getBBox(),c=i.xOrigin-H.x+"px "+(i.yOrigin-H.y)+"px",k=""):k=!t&&e.getAttribute("data-svg-origin"),_d(e,k||c,!!k||i.originIsAbsolute,i.smooth!==!1,A)),b=i.xOrigin||0,T=i.yOrigin||0,A!==Wl&&(D=A[0],N=A[1],V=A[2],z=A[3],u=O=A[4],d=F=A[5],A.length===6?(h=Math.sqrt(D*D+N*N),p=Math.sqrt(z*z+V*V),m=D||N?Uo(N,D)*Zs:0,y=V||z?Uo(V,z)*Zs+m:0,y&&(p*=Math.abs(Math.cos(y*ma))),i.svg&&(u-=b-(b*D+T*V),d-=T-(b*N+T*z))):(Ne=A[6],ke=A[7],L=A[8],ue=A[9],de=A[10],ze=A[11],u=A[12],d=A[13],f=A[14],S=Uo(Ne,de),_=S*Zs,S&&(E=Math.cos(-S),R=Math.sin(-S),k=O*E+L*R,H=F*E+ue*R,X=Ne*E+de*R,L=O*-R+L*E,ue=F*-R+ue*E,de=Ne*-R+de*E,ze=ke*-R+ze*E,O=k,F=H,Ne=X),S=Uo(-V,de),g=S*Zs,S&&(E=Math.cos(-S),R=Math.sin(-S),k=D*E-L*R,H=N*E-ue*R,X=V*E-de*R,ze=z*R+ze*E,D=k,N=H,V=X),S=Uo(N,D),m=S*Zs,S&&(E=Math.cos(S),R=Math.sin(S),k=D*E+N*R,H=O*E+F*R,N=N*E-D*R,F=F*E-O*R,D=k,O=H),_&&Math.abs(_)+Math.abs(m)>359.9&&(_=m=0,g=180-g),h=Jt(Math.sqrt(D*D+N*N+V*V)),p=Jt(Math.sqrt(F*F+Ne*Ne)),S=Uo(O,F),y=Math.abs(S)>2e-4?S*Zs:0,v=ze?1/(ze<0?-ze:ze):0),i.svg&&(k=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!vy(wi(e,$t)),k&&e.setAttribute("transform",k))),Math.abs(y)>90&&Math.abs(y)<270&&(s?(h*=-1,y+=m<=0?180:-180,m+=m<=0?180:-180):(p*=-1,y+=y<=0?180:-180)),t=t||i.uncache,i.x=u-((i.xPercent=u&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+o,i.y=d-((i.yPercent=d&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-d)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+o,i.z=f+o,i.scaleX=Jt(h),i.scaleY=Jt(p),i.rotation=Jt(m)+a,i.rotationX=Jt(_)+a,i.rotationY=Jt(g)+a,i.skewX=y+a,i.skewY=x+a,i.transformPerspective=v+o,(i.zOrigin=parseFloat(c.split(" ")[2])||!t&&i.zOrigin||0)&&(r[ui]=Ou(c)),i.xOffset=i.yOffset=0,i.force3D=Ri.force3D,i.renderTransform=i.svg?DA:py?xy:PA,i.uncache=0,i},Ou=function(e){return(e=e.split(" "))[0]+" "+e[1]},Xf=function(e,t,i){var r=zn(t);return Jt(parseFloat(t)+parseFloat(Fs(e,"x",i+"px",r)))+r},PA=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,xy(e,t)},Ws="0deg",Xa="0px",Xs=") ",xy=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.z,c=i.rotation,u=i.rotationY,d=i.rotationX,f=i.skewX,h=i.skewY,p=i.scaleX,m=i.scaleY,_=i.transformPerspective,g=i.force3D,y=i.target,x=i.zOrigin,v="",b=g==="auto"&&e&&e!==1||g===!0;if(x&&(d!==Ws||u!==Ws)){var T=parseFloat(u)*ma,A=Math.sin(T),S=Math.cos(T),E;T=parseFloat(d)*ma,E=Math.cos(T),o=Xf(y,o,A*E*-x),a=Xf(y,a,-Math.sin(T)*-x),l=Xf(y,l,S*E*-x+x)}_!==Xa&&(v+="perspective("+_+Xs),(r||s)&&(v+="translate("+r+"%, "+s+"%) "),(b||o!==Xa||a!==Xa||l!==Xa)&&(v+=l!==Xa||b?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+Xs),c!==Ws&&(v+="rotate("+c+Xs),u!==Ws&&(v+="rotateY("+u+Xs),d!==Ws&&(v+="rotateX("+d+Xs),(f!==Ws||h!==Ws)&&(v+="skew("+f+", "+h+Xs),(p!==1||m!==1)&&(v+="scale("+p+", "+m+Xs),y.style[$t]=v||"translate(0, 0)"},DA=function(e,t){var i=t||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.rotation,c=i.skewX,u=i.skewY,d=i.scaleX,f=i.scaleY,h=i.target,p=i.xOrigin,m=i.yOrigin,_=i.xOffset,g=i.yOffset,y=i.forceCSS,x=parseFloat(o),v=parseFloat(a),b,T,A,S,E;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=ma,c*=ma,b=Math.cos(l)*d,T=Math.sin(l)*d,A=Math.sin(l-c)*-f,S=Math.cos(l-c)*f,c&&(u*=ma,E=Math.tan(c-u),E=Math.sqrt(1+E*E),A*=E,S*=E,u&&(E=Math.tan(u),E=Math.sqrt(1+E*E),b*=E,T*=E)),b=Jt(b),T=Jt(T),A=Jt(A),S=Jt(S)):(b=d,S=f,T=A=0),(x&&!~(o+"").indexOf("px")||v&&!~(a+"").indexOf("px"))&&(x=Fs(h,"x",o,"px"),v=Fs(h,"y",a,"px")),(p||m||_||g)&&(x=Jt(x+p-(p*b+m*A)+_),v=Jt(v+m-(p*T+m*S)+g)),(r||s)&&(E=h.getBBox(),x=Jt(x+r/100*E.width),v=Jt(v+s/100*E.height)),E="matrix("+b+","+T+","+A+","+S+","+x+","+v+")",h.setAttribute("transform",E),y&&(h.style[$t]=E)},LA=function(e,t,i,r,s){var o=360,a=Rn(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?Zs:1),c=l-r,u=r+c+"deg",d,f;return a&&(d=s.split("_")[1],d==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),d==="cw"&&c<0?c=(c+o*X_)%o-~~(c/o)*o:d==="ccw"&&c>0&&(c=(c-o*X_)%o-~~(c/o)*o)),e._pt=f=new ci(e._pt,t,i,r,c,pA),f.e=u,f.u="deg",e._props.push(i),f},J_=function(e,t){for(var i in t)e[i]=t[i];return e},IA=function(e,t,i){var r=J_({},i._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=i.style,a,l,c,u,d,f,h,p;r.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),o[$t]=t,a=Xl(i,1),Us(i,$t),i.setAttribute("transform",c)):(c=getComputedStyle(i)[$t],o[$t]=t,a=Xl(i,1),o[$t]=c);for(l in Qr)c=r[l],u=a[l],c!==u&&s.indexOf(l)<0&&(h=zn(c),p=zn(u),d=h!==p?Fs(i,l,c,p):parseFloat(c),f=parseFloat(u),e._pt=new ci(e._pt,a,l,d,f-d,dd),e._pt.u=p||0,e._props.push(l));J_(a,r)};li("padding,margin,Width,Radius",function(n,e){var t="Top",i="Right",r="Bottom",s="Left",o=(e<3?[t,i,r,s]:[t+s,t+i,r+i,r+s]).map(function(a){return e<2?n+a:"border"+a+n});Fu[e>1?"border"+n:n]=function(a,l,c,u,d){var f,h;if(arguments.length<4)return f=o.map(function(p){return Fr(a,p,c)}),h=f.join(" "),h.split(f[0]).length===5?f[0]:h;f=(u+"").split(" "),h={},o.forEach(function(p,m){return h[p]=f[m]=f[m]||f[(m-1)/2|0]}),a.init(l,h,d)}});var yy={name:"css",register:md,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,r,s){var o=this._props,a=e.style,l=i.vars.startAt,c,u,d,f,h,p,m,_,g,y,x,v,b,T,A,S,E;hm||md(),this.styles=this.styles||dy(e),S=this.styles.props,this.tween=i;for(m in t)if(m!=="autoRound"&&(u=t[m],!(yi[m]&&ny(m,t,i,r,e,s)))){if(h=typeof u,p=Fu[m],h==="function"&&(u=u.call(i,r,e,s),h=typeof u),h==="string"&&~u.indexOf("random(")&&(u=zl(u)),p)p(this,e,m,u,i)&&(A=1);else if(m.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(m)+"").trim(),u+="",Ds.lastIndex=0,Ds.test(c)||(_=zn(c),g=zn(u),g?_!==g&&(c=Fs(e,m,c,g)+g):_&&(u+=_)),this.add(a,"setProperty",c,u,r,s,0,0,m),o.push(m),S.push(m,0,a[m]);else if(h!=="undefined"){if(l&&m in l?(c=typeof l[m]=="function"?l[m].call(i,r,e,s):l[m],Rn(c)&&~c.indexOf("random(")&&(c=zl(c)),zn(c+"")||c==="auto"||(c+=Ri.units[m]||zn(Fr(e,m))||""),(c+"").charAt(1)==="="&&(c=Fr(e,m))):c=Fr(e,m),f=parseFloat(c),y=h==="string"&&u.charAt(1)==="="&&u.substr(0,2),y&&(u=u.substr(2)),d=parseFloat(u),m in dr&&(m==="autoAlpha"&&(f===1&&Fr(e,"visibility")==="hidden"&&d&&(f=0),S.push("visibility",0,a.visibility),bs(this,a,"visibility",f?"inherit":"hidden",d?"inherit":"hidden",!d)),m!=="scale"&&m!=="transform"&&(m=dr[m],~m.indexOf(",")&&(m=m.split(",")[0]))),x=m in Qr,x){if(this.styles.save(m),E=u,h==="string"&&u.substring(0,6)==="var(--"){if(u=wi(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var R=e.style.perspective;e.style.perspective=u,u=wi(e,"perspective"),R?e.style.perspective=R:Us(e,"perspective")}d=parseFloat(u)}if(v||(b=e._gsap,b.renderTransform&&!t.parseTransform||Xl(e,t.parseTransform),T=t.smoothOrigin!==!1&&b.smooth,v=this._pt=new ci(this._pt,a,$t,0,1,b.renderTransform,b,0,-1),v.dep=1),m==="scale")this._pt=new ci(this._pt,b,"scaleY",b.scaleY,(y?da(b.scaleY,y+d):d)-b.scaleY||0,dd),this._pt.u=0,o.push("scaleY",m),m+="X";else if(m==="transformOrigin"){S.push(ui,0,a[ui]),u=RA(u),b.svg?_d(e,u,0,T,0,this):(g=parseFloat(u.split(" ")[2])||0,g!==b.zOrigin&&bs(this,b,"zOrigin",b.zOrigin,g),bs(this,a,m,Ou(c),Ou(u)));continue}else if(m==="svgOrigin"){_d(e,u,1,T,0,this);continue}else if(m in gy){LA(this,b,m,f,y?da(f,y+u):u);continue}else if(m==="smoothOrigin"){bs(this,b,"smooth",b.smooth,u);continue}else if(m==="force3D"){b[m]=u;continue}else if(m==="transform"){IA(this,u,e);continue}}else m in a||(m=Da(m)||m);if(x||(d||d===0)&&(f||f===0)&&!dA.test(u)&&m in a)_=(c+"").substr((f+"").length),d||(d=0),g=zn(u)||(m in Ri.units?Ri.units[m]:_),_!==g&&(f=Fs(e,m,c,g)),this._pt=new ci(this._pt,x?b:a,m,f,(y?da(f,y+d):d)-f,!x&&(g==="px"||m==="zIndex")&&t.autoRound!==!1?gA:dd),this._pt.u=g||0,x&&E!==u?(this._pt.b=c,this._pt.e=E,this._pt.r=_A):_!==g&&g!=="%"&&(this._pt.b=c,this._pt.r=mA);else if(m in a)AA.call(this,e,m,c,y?y+u:u);else if(m in e)this.add(e,m,c||e[m],y?y+u:u,r,s);else if(m!=="parseTransform"){nm(m,u);continue}x||(m in a?S.push(m,0,a[m]):typeof e[m]=="function"?S.push(m,2,e[m]()):S.push(m,1,c||e[m])),o.push(m)}}A&&ly(this)},render:function(e,t){if(t.tween._time||!dm())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Fr,aliases:dr,getSetter:function(e,t,i){var r=dr[t];return r&&r.indexOf(",")<0&&(t=r),t in Qr&&t!==ui&&(e._gsap.x||Fr(e,"x"))?i&&W_===i?t==="scale"?SA:yA:(W_=i||{})&&(t==="scale"?MA:bA):e.style&&!Qp(e.style[t])?vA:~t.indexOf("-")?xA:um(e,t)},core:{_removeProperty:Us,_getMatrix:mm}};di.utils.checkPrefix=Da;di.core.getStyleSaver=dy;(function(n,e,t,i){var r=li(n+","+e+","+t,function(s){Qr[s]=1});li(e,function(s){Ri.units[s]="deg",gy[s]=1}),dr[r[13]]=n+","+e,li(i,function(s){var o=s.split(":");dr[o[1]]=r[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");li("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(n){Ri.units[n]="px"});di.registerPlugin(yy);var _n=di.registerPlugin(yy)||di;_n.core.Tween;function NA(n,e){for(var t=0;t<e.length;t++){var i=e[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}function UA(n,e,t){return e&&NA(n.prototype,e),n}var Pn,su,Ei,Es,Ts,_a,Sy,Js,ga,My,Vr,ji,by,Ey=function(){return Pn||typeof window<"u"&&(Pn=window.gsap)&&Pn.registerPlugin&&Pn},Ty=1,sa=[],ct=[],vr=[],Sl=Date.now,gd=function(e,t){return t},FA=function(){var e=ga.core,t=e.bridge||{},i=e._scrollers,r=e._proxies;i.push.apply(i,ct),r.push.apply(r,vr),ct=i,vr=r,gd=function(o,a){return t[o](a)}},Ls=function(e,t){return~vr.indexOf(e)&&vr[vr.indexOf(e)+1][t]},Ml=function(e){return!!~My.indexOf(e)},Yn=function(e,t,i,r,s){return e.addEventListener(t,i,{passive:r!==!1,capture:!!s})},$n=function(e,t,i,r){return e.removeEventListener(t,i,!!r)},gc="scrollLeft",vc="scrollTop",vd=function(){return Vr&&Vr.isPressed||ct.cache++},Bu=function(e,t){var i=function r(s){if(s||s===0){Ty&&(Ei.history.scrollRestoration="manual");var o=Vr&&Vr.isPressed;s=r.v=Math.round(s)||(Vr&&Vr.iOS?1:0),e(s),r.cacheID=ct.cache,o&&gd("ss",s)}else(t||ct.cache!==r.cacheID||gd("ref"))&&(r.cacheID=ct.cache,r.v=e());return r.v+r.offset};return i.offset=0,e&&i},ti={s:gc,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:Bu(function(n){return arguments.length?Ei.scrollTo(n,mn.sc()):Ei.pageXOffset||Es[gc]||Ts[gc]||_a[gc]||0})},mn={s:vc,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:ti,sc:Bu(function(n){return arguments.length?Ei.scrollTo(ti.sc(),n):Ei.pageYOffset||Es[vc]||Ts[vc]||_a[vc]||0})},ri=function(e,t){return(t&&t._ctx&&t._ctx.selector||Pn.utils.toArray)(e)[0]||(typeof e=="string"&&Pn.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},OA=function(e,t){for(var i=t.length;i--;)if(t[i]===e||t[i].contains(e))return!0;return!1},Os=function(e,t){var i=t.s,r=t.sc;Ml(e)&&(e=Es.scrollingElement||Ts);var s=ct.indexOf(e),o=r===mn.sc?1:2;!~s&&(s=ct.push(e)-1),ct[s+o]||Yn(e,"scroll",vd);var a=ct[s+o],l=a||(ct[s+o]=Bu(Ls(e,i),!0)||(Ml(e)?r:Bu(function(c){return arguments.length?e[i]=c:e[i]})));return l.target=e,a||(l.smooth=Pn.getProperty(e,"scrollBehavior")==="smooth"),l},xd=function(e,t,i){var r=e,s=e,o=Sl(),a=o,l=t||50,c=Math.max(500,l*3),u=function(p,m){var _=Sl();m||_-o>l?(s=r,r=p,a=o,o=_):i?r+=p:r=s+(p-s)/(_-a)*(o-a)},d=function(){s=r=i?0:r,a=o=0},f=function(p){var m=a,_=s,g=Sl();return(p||p===0)&&p!==r&&u(p),o===a||g-a>c?0:(r+(i?_:-_))/((i?g:o)-m)*1e3};return{update:u,reset:d,getVelocity:f}},$a=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},Q_=function(e){var t=Math.max.apply(Math,e),i=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(i)?t:i},wy=function(){ga=Pn.core.globals().ScrollTrigger,ga&&ga.core&&FA()},Ay=function(e){return Pn=e||Ey(),!su&&Pn&&typeof document<"u"&&document.body&&(Ei=window,Es=document,Ts=Es.documentElement,_a=Es.body,My=[Ei,Es,Ts,_a],Pn.utils.clamp,by=Pn.core.context||function(){},Js="onpointerenter"in _a?"pointer":"mouse",Sy=nn.isTouch=Ei.matchMedia&&Ei.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Ei||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,ji=nn.eventTypes=("ontouchstart"in Ts?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Ts?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return Ty=0},500),su=1),ga||wy(),su};ti.op=mn;ct.cache=0;var nn=(function(){function n(t){this.init(t)}var e=n.prototype;return e.init=function(i){su||Ay(Pn)||console.warn("Please gsap.registerPlugin(Observer)"),ga||wy();var r=i.tolerance,s=i.dragMinimum,o=i.type,a=i.target,l=i.lineHeight,c=i.debounce,u=i.preventDefault,d=i.onStop,f=i.onStopDelay,h=i.ignore,p=i.wheelSpeed,m=i.event,_=i.onDragStart,g=i.onDragEnd,y=i.onDrag,x=i.onPress,v=i.onRelease,b=i.onRight,T=i.onLeft,A=i.onUp,S=i.onDown,E=i.onChangeX,R=i.onChangeY,D=i.onChange,N=i.onToggleX,V=i.onToggleY,z=i.onHover,O=i.onHoverEnd,F=i.onMove,k=i.ignoreCheck,H=i.isNormalizer,X=i.onGestureStart,L=i.onGestureEnd,ue=i.onWheel,de=i.onEnable,ke=i.onDisable,ze=i.onClick,Ne=i.scrollSpeed,ne=i.capture,xe=i.allowClicks,_e=i.lockAxis,Le=i.onLockAxis;this.target=a=ri(a)||Ts,this.vars=i,h&&(h=Pn.utils.toArray(h)),r=r||1e-9,s=s||0,p=p||1,Ne=Ne||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Ei.getComputedStyle(_a).lineHeight)||22);var we,Te,Be,P,B,$,Q,U=this,oe=0,be=0,I=i.passive||!u&&i.passive!==!1,K=Os(a,ti),Y=Os(a,mn),pe=K(),q=Y(),he=~o.indexOf("touch")&&!~o.indexOf("pointer")&&ji[0]==="pointerdown",w=Ml(a),M=a.ownerDocument||Es,G=[0,0,0],Z=[0,0,0],ae=0,ce=function(){return ae=Sl()},fe=function(Re,je){return(U.event=Re)&&h&&OA(Re.target,h)||je&&he&&Re.pointerType!=="touch"||k&&k(Re,je)},ie=function(){U._vx.reset(),U._vy.reset(),Te.pause(),d&&d(U)},le=function(){var Re=U.deltaX=Q_(G),je=U.deltaY=Q_(Z),Se=Math.abs(Re)>=r,$e=Math.abs(je)>=r;D&&(Se||$e)&&D(U,Re,je,G,Z),Se&&(b&&U.deltaX>0&&b(U),T&&U.deltaX<0&&T(U),E&&E(U),N&&U.deltaX<0!=oe<0&&N(U),oe=U.deltaX,G[0]=G[1]=G[2]=0),$e&&(S&&U.deltaY>0&&S(U),A&&U.deltaY<0&&A(U),R&&R(U),V&&U.deltaY<0!=be<0&&V(U),be=U.deltaY,Z[0]=Z[1]=Z[2]=0),(P||Be)&&(F&&F(U),Be&&(_&&Be===1&&_(U),y&&y(U),Be=0),P=!1),$&&!($=!1)&&Le&&Le(U),B&&(ue(U),B=!1),we=0},Ce=function(Re,je,Se){G[Se]+=Re,Z[Se]+=je,U._vx.update(Re),U._vy.update(je),c?we||(we=requestAnimationFrame(le)):le()},ge=function(Re,je){_e&&!Q&&(U.axis=Q=Math.abs(Re)>Math.abs(je)?"x":"y",$=!0),Q!=="y"&&(G[2]+=Re,U._vx.update(Re,!0)),Q!=="x"&&(Z[2]+=je,U._vy.update(je,!0)),c?we||(we=requestAnimationFrame(le)):le()},ve=function(Re){if(!fe(Re,1)){Re=$a(Re,u);var je=Re.clientX,Se=Re.clientY,$e=je-U.x,He=Se-U.y,Qe=U.isDragging;U.x=je,U.y=Se,(Qe||($e||He)&&(Math.abs(U.startX-je)>=s||Math.abs(U.startY-Se)>=s))&&(Be||(Be=Qe?2:1),Qe||(U.isDragging=!0),ge($e,He))}},Me=U.onPress=function(Ee){fe(Ee,1)||Ee&&Ee.button||(U.axis=Q=null,Te.pause(),U.isPressed=!0,Ee=$a(Ee),oe=be=0,U.startX=U.x=Ee.clientX,U.startY=U.y=Ee.clientY,U._vx.reset(),U._vy.reset(),Yn(H?a:M,ji[1],ve,I,!0),U.deltaX=U.deltaY=0,x&&x(U))},Pe=U.onRelease=function(Ee){if(!fe(Ee,1)){$n(H?a:M,ji[1],ve,!0);var Re=!isNaN(U.y-U.startY),je=U.isDragging,Se=je&&(Math.abs(U.x-U.startX)>3||Math.abs(U.y-U.startY)>3),$e=$a(Ee);!Se&&Re&&(U._vx.reset(),U._vy.reset(),u&&xe&&Pn.delayedCall(.08,function(){if(Sl()-ae>300&&!Ee.defaultPrevented){if(Ee.target.click)Ee.target.click();else if(M.createEvent){var He=M.createEvent("MouseEvents");He.initMouseEvent("click",!0,!0,Ei,1,$e.screenX,$e.screenY,$e.clientX,$e.clientY,!1,!1,!1,!1,0,null),Ee.target.dispatchEvent(He)}}})),U.isDragging=U.isGesturing=U.isPressed=!1,d&&je&&!H&&Te.restart(!0),Be&&le(),g&&je&&g(U),v&&v(U,Se)}},Xe=function(Re){return Re.touches&&Re.touches.length>1&&(U.isGesturing=!0)&&X(Re,U.isDragging)},Ke=function(){return(U.isGesturing=!1)||L(U)},W=function(Re){if(!fe(Re)){var je=K(),Se=Y();Ce((je-pe)*Ne,(Se-q)*Ne,1),pe=je,q=Se,d&&Te.restart(!0)}},me=function(Re){if(!fe(Re)){Re=$a(Re,u),ue&&(B=!0);var je=(Re.deltaMode===1?l:Re.deltaMode===2?Ei.innerHeight:1)*p;Ce(Re.deltaX*je,Re.deltaY*je,0),d&&!H&&Te.restart(!0)}},ee=function(Re){if(!fe(Re)){var je=Re.clientX,Se=Re.clientY,$e=je-U.x,He=Se-U.y;U.x=je,U.y=Se,P=!0,d&&Te.restart(!0),($e||He)&&ge($e,He)}},De=function(Re){U.event=Re,z(U)},Ae=function(Re){U.event=Re,O(U)},ye=function(Re){return fe(Re)||$a(Re,u)&&ze(U)};Te=U._dc=Pn.delayedCall(f||.25,ie).pause(),U.deltaX=U.deltaY=0,U._vx=xd(0,50,!0),U._vy=xd(0,50,!0),U.scrollX=K,U.scrollY=Y,U.isDragging=U.isGesturing=U.isPressed=!1,by(this),U.enable=function(Ee){return U.isEnabled||(Yn(w?M:a,"scroll",vd),o.indexOf("scroll")>=0&&Yn(w?M:a,"scroll",W,I,ne),o.indexOf("wheel")>=0&&Yn(a,"wheel",me,I,ne),(o.indexOf("touch")>=0&&Sy||o.indexOf("pointer")>=0)&&(Yn(a,ji[0],Me,I,ne),Yn(M,ji[2],Pe),Yn(M,ji[3],Pe),xe&&Yn(a,"click",ce,!0,!0),ze&&Yn(a,"click",ye),X&&Yn(M,"gesturestart",Xe),L&&Yn(M,"gestureend",Ke),z&&Yn(a,Js+"enter",De),O&&Yn(a,Js+"leave",Ae),F&&Yn(a,Js+"move",ee)),U.isEnabled=!0,U.isDragging=U.isGesturing=U.isPressed=P=Be=!1,U._vx.reset(),U._vy.reset(),pe=K(),q=Y(),Ee&&Ee.type&&Me(Ee),de&&de(U)),U},U.disable=function(){U.isEnabled&&(sa.filter(function(Ee){return Ee!==U&&Ml(Ee.target)}).length||$n(w?M:a,"scroll",vd),U.isPressed&&(U._vx.reset(),U._vy.reset(),$n(H?a:M,ji[1],ve,!0)),$n(w?M:a,"scroll",W,ne),$n(a,"wheel",me,ne),$n(a,ji[0],Me,ne),$n(M,ji[2],Pe),$n(M,ji[3],Pe),$n(a,"click",ce,!0),$n(a,"click",ye),$n(M,"gesturestart",Xe),$n(M,"gestureend",Ke),$n(a,Js+"enter",De),$n(a,Js+"leave",Ae),$n(a,Js+"move",ee),U.isEnabled=U.isPressed=U.isDragging=!1,ke&&ke(U))},U.kill=U.revert=function(){U.disable();var Ee=sa.indexOf(U);Ee>=0&&sa.splice(Ee,1),Vr===U&&(Vr=0)},sa.push(U),H&&Ml(a)&&(Vr=U),U.enable(m)},UA(n,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),n})();nn.version="3.15.0";nn.create=function(n){return new nn(n)};nn.register=Ay;nn.getAll=function(){return sa.slice()};nn.getById=function(n){return sa.filter(function(e){return e.vars.id===n})[0]};Ey()&&Pn.registerPlugin(nn);var Ge,ea,lt,wt,Mi,yt,_m,ku,$l,bl,sl,xc,On,mf,yd,Jn,eg,tg,ta,Ry,$f,Cy,Zn,Sd,Py,Dy,ps,Md,gm,va,vm,El,bd,qf,yc=1,Bn=Date.now,Yf=Bn(),Wi=0,ol=0,ng=function(e,t,i){var r=xi(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return i["_"+t+"Clamp"]=r,r?e.substr(6,e.length-7):e},ig=function(e,t){return t&&(!xi(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},BA=function n(){return ol&&requestAnimationFrame(n)},rg=function(){return mf=1},sg=function(){return mf=0},cr=function(e){return e},al=function(e){return Math.round(e*1e5)/1e5||0},Ly=function(){return typeof window<"u"},Iy=function(){return Ge||Ly()&&(Ge=window.gsap)&&Ge.registerPlugin&&Ge},Mo=function(e){return!!~_m.indexOf(e)},Ny=function(e){return(e==="Height"?vm:lt["inner"+e])||Mi["client"+e]||yt["client"+e]},Uy=function(e){return Ls(e,"getBoundingClientRect")||(Mo(e)?function(){return uu.width=lt.innerWidth,uu.height=vm,uu}:function(){return kr(e)})},kA=function(e,t,i){var r=i.d,s=i.d2,o=i.a;return(o=Ls(e,"getBoundingClientRect"))?function(){return o()[r]}:function(){return(t?Ny(s):e["client"+s])||0}},HA=function(e,t){return!t||~vr.indexOf(e)?Uy(e):function(){return uu}},pr=function(e,t){var i=t.s,r=t.d2,s=t.d,o=t.a;return Math.max(0,(i="scroll"+r)&&(o=Ls(e,i))?o()-Uy(e)()[s]:Mo(e)?(Mi[i]||yt[i])-Ny(r):e[i]-e["offset"+r])},Sc=function(e,t){for(var i=0;i<ta.length;i+=3)(!t||~t.indexOf(ta[i+1]))&&e(ta[i],ta[i+1],ta[i+2])},xi=function(e){return typeof e=="string"},Vn=function(e){return typeof e=="function"},ll=function(e){return typeof e=="number"},Qs=function(e){return typeof e=="object"},qa=function(e,t,i){return e&&e.progress(t?0:1)&&i&&e.pause()},Fo=function(e,t,i){if(e.enabled){var r=e._ctx?e._ctx.add(function(){return t(e,i)}):t(e,i);r&&r.totalTime&&(e.callbackAnimation=r)}},Oo=Math.abs,Fy="left",Oy="top",xm="right",ym="bottom",go="width",vo="height",Tl="Right",wl="Left",Al="Top",Rl="Bottom",cn="padding",Bi="margin",La="Width",Sm="Height",dn="px",ki=function(e){return lt.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},zA=function(e){var t=ki(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},og=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},kr=function(e,t){var i=t&&ki(e)[yd]!=="matrix(1, 0, 0, 1, 0, 0)"&&Ge.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),r=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return i&&i.progress(0).kill(),r},Hu=function(e,t){var i=t.d2;return e["offset"+i]||e["client"+i]||0},By=function(e){var t=[],i=e.labels,r=e.duration(),s;for(s in i)t.push(i[s]/r);return t},VA=function(e){return function(t){return Ge.utils.snap(By(e),t)}},Mm=function(e){var t=Ge.utils.snap(e),i=Array.isArray(e)&&e.slice(0).sort(function(r,s){return r-s});return i?function(r,s,o){o===void 0&&(o=.001);var a;if(!s)return t(r);if(s>0){for(r-=o,a=0;a<i.length;a++)if(i[a]>=r)return i[a];return i[a-1]}else for(a=i.length,r+=o;a--;)if(i[a]<=r)return i[a];return i[0]}:function(r,s,o){o===void 0&&(o=.001);var a=t(r);return!s||Math.abs(a-r)<o||a-r<0==s<0?a:t(s<0?r-e:r+e)}},GA=function(e){return function(t,i){return Mm(By(e))(t,i.direction)}},Mc=function(e,t,i,r){return i.split(",").forEach(function(s){return e(t,s,r)})},Tn=function(e,t,i,r,s){return e.addEventListener(t,i,{passive:!r,capture:!!s})},En=function(e,t,i,r){return e.removeEventListener(t,i,!!r)},bc=function(e,t,i){i=i&&i.wheelHandler,i&&(e(t,"wheel",i),e(t,"touchmove",i))},ag={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Ec={toggleActions:"play",anticipatePin:0},zu={top:0,left:0,center:.5,bottom:1,right:1},ou=function(e,t){if(xi(e)){var i=e.indexOf("="),r=~i?+(e.charAt(i-1)+1)*parseFloat(e.substr(i+1)):0;~i&&(e.indexOf("%")>i&&(r*=t/100),e=e.substr(0,i-1)),e=r+(e in zu?zu[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},Tc=function(e,t,i,r,s,o,a,l){var c=s.startColor,u=s.endColor,d=s.fontSize,f=s.indent,h=s.fontWeight,p=wt.createElement("div"),m=Mo(i)||Ls(i,"pinType")==="fixed",_=e.indexOf("scroller")!==-1,g=m?yt:i.tagName==="IFRAME"?i.contentDocument.body:i,y=e.indexOf("start")!==-1,x=y?c:u,v="border-color:"+x+";font-size:"+d+";color:"+x+";font-weight:"+h+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return v+="position:"+((_||l)&&m?"fixed;":"absolute;"),(_||l||!m)&&(v+=(r===mn?xm:ym)+":"+(o+parseFloat(f))+"px;"),a&&(v+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),p._isStart=y,p.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),p.style.cssText=v,p.innerText=t||t===0?e+"-"+t:e,g.children[0]?g.insertBefore(p,g.children[0]):g.appendChild(p),p._offset=p["offset"+r.op.d2],au(p,0,r,y),p},au=function(e,t,i,r){var s={display:"block"},o=i[r?"os2":"p2"],a=i[r?"p2":"os2"];e._isFlipped=r,s[i.a+"Percent"]=r?-100:0,s[i.a]=r?"1px":0,s["border"+o+La]=1,s["border"+a+La]=0,s[i.p]=t+"px",Ge.set(e,s)},ot=[],Ed={},ql,lg=function(){return Bn()-Wi>34&&(ql||(ql=requestAnimationFrame(Wr)))},Bo=function(){(!Zn||!Zn.isPressed||Zn.startX>yt.clientWidth)&&(ct.cache++,Zn?ql||(ql=requestAnimationFrame(Wr)):Wr(),Wi||Eo("scrollStart"),Wi=Bn())},jf=function(){Dy=lt.innerWidth,Py=lt.innerHeight},cl=function(e){ct.cache++,(e===!0||!On&&!Cy&&!wt.fullscreenElement&&!wt.webkitFullscreenElement&&(!Sd||Dy!==lt.innerWidth||Math.abs(lt.innerHeight-Py)>lt.innerHeight*.25))&&ku.restart(!0)},bo={},WA=[],ky=function n(){return En(rt,"scrollEnd",n)||ro(!0)},Eo=function(e){return bo[e]&&bo[e].map(function(t){return t()})||WA},vi=[],Hy=function(e){for(var t=0;t<vi.length;t+=5)(!e||vi[t+4]&&vi[t+4].query===e)&&(vi[t].style.cssText=vi[t+1],vi[t].getBBox&&vi[t].setAttribute("transform",vi[t+2]||""),vi[t+3].uncache=1)},zy=function(){return ct.forEach(function(e){return Vn(e)&&++e.cacheID&&(e.rec=e())})},bm=function(e,t){var i;for(Jn=0;Jn<ot.length;Jn++)i=ot[Jn],i&&(!t||i._ctx===t)&&(e?i.kill(1):i.revert(!0,!0));El=!0,t&&Hy(t),t||Eo("revert")},Vy=function(e,t){ct.cache++,(t||!Qn)&&ct.forEach(function(i){return Vn(i)&&i.cacheID++&&(i.rec=0)}),xi(e)&&(lt.history.scrollRestoration=gm=e)},Qn,xo=0,cg,XA=function(){if(cg!==xo){var e=cg=xo;requestAnimationFrame(function(){return e===xo&&ro(!0)})}},Gy=function(){yt.appendChild(va),vm=!Zn&&va.offsetHeight||lt.innerHeight,yt.removeChild(va)},ug=function(e){return $l(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},ro=function(e,t){if(Mi=wt.documentElement,yt=wt.body,_m=[lt,wt,Mi,yt],Wi&&!e&&!El){Tn(rt,"scrollEnd",ky);return}Gy(),Qn=rt.isRefreshing=!0,El||zy();var i=Eo("refreshInit");Ry&&rt.sort(),t||bm(),ct.forEach(function(r){Vn(r)&&(r.smooth&&(r.target.style.scrollBehavior="auto"),r(0))}),ot.slice(0).forEach(function(r){return r.refresh()}),El=!1,ot.forEach(function(r){if(r._subPinOffset&&r.pin){var s=r.vars.horizontal?"offsetWidth":"offsetHeight",o=r.pin[s];r.revert(!0,1),r.adjustPinSpacing(r.pin[s]-o),r.refresh()}}),bd=1,ug(!0),ot.forEach(function(r){var s=pr(r.scroller,r._dir),o=r.vars.end==="max"||r._endClamp&&r.end>s,a=r._startClamp&&r.start>=s;(o||a)&&r.setPositions(a?s-1:r.start,o?Math.max(a?s:r.start+1,s):r.end,!0)}),ug(!1),bd=0,i.forEach(function(r){return r&&r.render&&r.render(-1)}),ct.forEach(function(r){Vn(r)&&(r.smooth&&requestAnimationFrame(function(){return r.target.style.scrollBehavior="smooth"}),r.rec&&r(r.rec))}),Vy(gm,1),ku.pause(),xo++,Qn=2,Wr(2),ot.forEach(function(r){return Vn(r.vars.onRefresh)&&r.vars.onRefresh(r)}),Qn=rt.isRefreshing=!1,Eo("refresh")},Td=0,lu=1,Cl,Wr=function(e){if(e===2||!Qn&&!El){rt.isUpdating=!0,Cl&&Cl.update(0);var t=ot.length,i=Bn(),r=i-Yf>=50,s=t&&ot[0].scroll();if(lu=Td>s?-1:1,Qn||(Td=s),r&&(Wi&&!mf&&i-Wi>200&&(Wi=0,Eo("scrollEnd")),sl=Yf,Yf=i),lu<0){for(Jn=t;Jn-- >0;)ot[Jn]&&ot[Jn].update(0,r);lu=1}else for(Jn=0;Jn<t;Jn++)ot[Jn]&&ot[Jn].update(0,r);rt.isUpdating=!1}ql=0},wd=[Fy,Oy,ym,xm,Bi+Rl,Bi+Tl,Bi+Al,Bi+wl,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],cu=wd.concat([go,vo,"boxSizing","max"+La,"max"+Sm,"position",Bi,cn,cn+Al,cn+Tl,cn+Rl,cn+wl]),$A=function(e,t,i){xa(i);var r=e._gsap;if(r.spacerIsNative)xa(r.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},Kf=function(e,t,i,r){if(!e._gsap.swappedIn){for(var s=wd.length,o=t.style,a=e.style,l;s--;)l=wd[s],o[l]=i[l];o.position=i.position==="absolute"?"absolute":"relative",i.display==="inline"&&(o.display="inline-block"),a[ym]=a[xm]="auto",o.flexBasis=i.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[go]=Hu(e,ti)+dn,o[vo]=Hu(e,mn)+dn,o[cn]=a[Bi]=a[Oy]=a[Fy]="0",xa(r),a[go]=a["max"+La]=i[go],a[vo]=a["max"+Sm]=i[vo],a[cn]=i[cn],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},qA=/([A-Z])/g,xa=function(e){if(e){var t=e.t.style,i=e.length,r=0,s,o;for((e.t._gsap||Ge.core.getCache(e.t)).uncache=1;r<i;r+=2)o=e[r+1],s=e[r],o?t[s]=o:t[s]&&t.removeProperty(s.replace(qA,"-$1").toLowerCase())}},wc=function(e){for(var t=cu.length,i=e.style,r=[],s=0;s<t;s++)r.push(cu[s],i[cu[s]]);return r.t=e,r},YA=function(e,t,i){for(var r=[],s=e.length,o=i?8:0,a;o<s;o+=2)a=e[o],r.push(a,a in t?t[a]:e[o+1]);return r.t=e.t,r},uu={left:0,top:0},fg=function(e,t,i,r,s,o,a,l,c,u,d,f,h,p){Vn(e)&&(e=e(l)),xi(e)&&e.substr(0,3)==="max"&&(e=f+(e.charAt(4)==="="?ou("0"+e.substr(3),i):0));var m=h?h.time():0,_,g,y;if(h&&h.seek(0),isNaN(e)||(e=+e),ll(e))h&&(e=Ge.utils.mapRange(h.scrollTrigger.start,h.scrollTrigger.end,0,f,e)),a&&au(a,i,r,!0);else{Vn(t)&&(t=t(l));var x=(e||"0").split(" "),v,b,T,A;y=ri(t,l)||yt,v=kr(y)||{},(!v||!v.left&&!v.top)&&ki(y).display==="none"&&(A=y.style.display,y.style.display="block",v=kr(y),A?y.style.display=A:y.style.removeProperty("display")),b=ou(x[0],v[r.d]),T=ou(x[1]||"0",i),e=v[r.p]-c[r.p]-u+b+s-T,a&&au(a,T,r,i-T<20||a._isStart&&T>20),i-=i-T}if(p&&(l[p]=e||-.001,e<0&&(e=0)),o){var S=e+i,E=o._isStart;_="scroll"+r.d2,au(o,S,r,E&&S>20||!E&&(d?Math.max(yt[_],Mi[_]):o.parentNode[_])<=S+1),d&&(c=kr(a),d&&(o.style[r.op.p]=c[r.op.p]-r.op.m-o._offset+dn))}return h&&y&&(_=kr(y),h.seek(f),g=kr(y),h._caScrollDist=_[r.p]-g[r.p],e=e/h._caScrollDist*f),h&&h.seek(m),h?e:Math.round(e)},jA=/(webkit|moz|length|cssText|inset)/i,hg=function(e,t,i,r){if(e.parentNode!==t){var s=e.style,o,a;if(t===yt){e._stOrig=s.cssText,a=ki(e);for(o in a)!+o&&!jA.test(o)&&a[o]&&typeof s[o]=="string"&&o!=="0"&&(s[o]=a[o]);s.top=i,s.left=r}else s.cssText=e._stOrig;Ge.core.getCache(e).uncache=1,t.appendChild(e)}},Wy=function(e,t,i){var r=t,s=r;return function(o){var a=Math.round(e());return a!==r&&a!==s&&Math.abs(a-r)>3&&Math.abs(a-s)>3&&(o=a,i&&i()),s=r,r=Math.round(o),r}},Ac=function(e,t,i){var r={};r[t.p]="+="+i,Ge.set(e,r)},dg=function(e,t){var i=Os(e,t),r="_scroll"+t.p2,s=function o(a,l,c,u,d){var f=o.tween,h=l.onComplete,p={};c=c||i();var m=Wy(i,c,function(){f.kill(),o.tween=0});return d=u&&d||0,u=u||a-c,f&&f.kill(),l[r]=a,l.inherit=!1,l.modifiers=p,p[r]=function(){return m(c+u*f.ratio+d*f.ratio*f.ratio)},l.onUpdate=function(){ct.cache++,o.tween&&Wr()},l.onComplete=function(){o.tween=0,h&&h.call(f)},f=o.tween=Ge.to(e,l),f};return e[r]=i,i.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},Tn(e,"wheel",i.wheelHandler),rt.isTouch&&Tn(e,"touchmove",i.wheelHandler),s},rt=(function(){function n(t,i){ea||n.register(Ge)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),Md(this),this.init(t,i)}var e=n.prototype;return e.init=function(i,r){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!ol){this.update=this.refresh=this.kill=cr;return}i=og(xi(i)||ll(i)||i.nodeType?{trigger:i}:i,Ec);var s=i,o=s.onUpdate,a=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,d=s.scrub,f=s.trigger,h=s.pin,p=s.pinSpacing,m=s.invalidateOnRefresh,_=s.anticipatePin,g=s.onScrubComplete,y=s.onSnapComplete,x=s.once,v=s.snap,b=s.pinReparent,T=s.pinSpacer,A=s.containerAnimation,S=s.fastScrollEnd,E=s.preventOverlaps,R=i.horizontal||i.containerAnimation&&i.horizontal!==!1?ti:mn,D=!d&&d!==0,N=ri(i.scroller||lt),V=Ge.core.getCache(N),z=Mo(N),O=("pinType"in i?i.pinType:Ls(N,"pinType")||z&&"fixed")==="fixed",F=[i.onEnter,i.onLeave,i.onEnterBack,i.onLeaveBack],k=D&&i.toggleActions.split(" "),H="markers"in i?i.markers:Ec.markers,X=z?0:parseFloat(ki(N)["border"+R.p2+La])||0,L=this,ue=i.onRefreshInit&&function(){return i.onRefreshInit(L)},de=kA(N,z,R),ke=HA(N,z),ze=0,Ne=0,ne=0,xe=Os(N,R),_e,Le,we,Te,Be,P,B,$,Q,U,oe,be,I,K,Y,pe,q,he,w,M,G,Z,ae,ce,fe,ie,le,Ce,ge,ve,Me,Pe,Xe,Ke,W,me,ee,De,Ae;if(L._startClamp=L._endClamp=!1,L._dir=R,_*=45,L.scroller=N,L.scroll=A?A.time.bind(A):xe,Te=xe(),L.vars=i,r=r||i.animation,"refreshPriority"in i&&(Ry=1,i.refreshPriority===-9999&&(Cl=L)),V.tweenScroll=V.tweenScroll||{top:dg(N,mn),left:dg(N,ti)},L.tweenTo=_e=V.tweenScroll[R.p],L.scrubDuration=function(Se){Xe=ll(Se)&&Se,Xe?Pe?Pe.duration(Se):Pe=Ge.to(r,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:Xe,paused:!0,onComplete:function(){return g&&g(L)}}):(Pe&&Pe.progress(1).kill(),Pe=0)},r&&(r.vars.lazy=!1,r._initted&&!L.isReverted||r.vars.immediateRender!==!1&&i.immediateRender!==!1&&r.duration()&&r.render(0,!0,!0),L.animation=r.pause(),r.scrollTrigger=L,L.scrubDuration(d),ve=0,l||(l=r.vars.id)),v&&((!Qs(v)||v.push)&&(v={snapTo:v}),"scrollBehavior"in yt.style&&Ge.set(z?[yt,Mi]:N,{scrollBehavior:"auto"}),ct.forEach(function(Se){return Vn(Se)&&Se.target===(z?wt.scrollingElement||Mi:N)&&(Se.smooth=!1)}),we=Vn(v.snapTo)?v.snapTo:v.snapTo==="labels"?VA(r):v.snapTo==="labelsDirectional"?GA(r):v.directional!==!1?function(Se,$e){return Mm(v.snapTo)(Se,Bn()-Ne<500?0:$e.direction)}:Ge.utils.snap(v.snapTo),Ke=v.duration||{min:.1,max:2},Ke=Qs(Ke)?bl(Ke.min,Ke.max):bl(Ke,Ke),W=Ge.delayedCall(v.delay||Xe/2||.1,function(){var Se=xe(),$e=Bn()-Ne<500,He=_e.tween;if(($e||Math.abs(L.getVelocity())<10)&&!He&&!mf&&ze!==Se){var Qe=(Se-P)/K,on=r&&!D?r.totalProgress():Qe,at=$e?0:(on-Me)/(Bn()-sl)*1e3||0,Ht=Ge.utils.clamp(-Qe,1-Qe,Oo(at/2)*at/.185),zt=Qe+(v.inertia===!1?0:Ht),Ut,Pt,xt=v,In=xt.onStart,Ft=xt.onInterrupt,yn=xt.onComplete;if(Ut=we(zt,L),ll(Ut)||(Ut=zt),Pt=Math.max(0,Math.round(P+Ut*K)),Se<=B&&Se>=P&&Pt!==Se){if(He&&!He._initted&&He.data<=Oo(Pt-Se))return;v.inertia===!1&&(Ht=Ut-Qe),_e(Pt,{duration:Ke(Oo(Math.max(Oo(zt-on),Oo(Ut-on))*.185/at/.05||0)),ease:v.ease||"power3",data:Oo(Pt-Se),onInterrupt:function(){return W.restart(!0)&&Ft&&Fo(L,Ft)},onComplete:function(){L.update(),ze=xe(),r&&!D&&(Pe?Pe.resetTo("totalProgress",Ut,r._tTime/r._tDur):r.progress(Ut)),ve=Me=r&&!D?r.totalProgress():L.progress,y&&y(L),yn&&Fo(L,yn)}},Se,Ht*K,Pt-Se-Ht*K),In&&Fo(L,In,_e.tween)}}else L.isActive&&ze!==Se&&W.restart(!0)}).pause()),l&&(Ed[l]=L),f=L.trigger=ri(f||h!==!0&&h),Ae=f&&f._gsap&&f._gsap.stRevert,Ae&&(Ae=Ae(L)),h=h===!0?f:ri(h),xi(a)&&(a={targets:f,className:a}),h&&(p===!1||p===Bi||(p=!p&&h.parentNode&&h.parentNode.style&&ki(h.parentNode).display==="flex"?!1:cn),L.pin=h,Le=Ge.core.getCache(h),Le.spacer?Y=Le.pinState:(T&&(T=ri(T),T&&!T.nodeType&&(T=T.current||T.nativeElement),Le.spacerIsNative=!!T,T&&(Le.spacerState=wc(T))),Le.spacer=he=T||wt.createElement("div"),he.classList.add("pin-spacer"),l&&he.classList.add("pin-spacer-"+l),Le.pinState=Y=wc(h)),i.force3D!==!1&&Ge.set(h,{force3D:!0}),L.spacer=he=Le.spacer,ge=ki(h),ce=ge[p+R.os2],M=Ge.getProperty(h),G=Ge.quickSetter(h,R.a,dn),Kf(h,he,ge),q=wc(h)),H){be=Qs(H)?og(H,ag):ag,U=Tc("scroller-start",l,N,R,be,0),oe=Tc("scroller-end",l,N,R,be,0,U),w=U["offset"+R.op.d2];var ye=ri(Ls(N,"content")||N);$=this.markerStart=Tc("start",l,ye,R,be,w,0,A),Q=this.markerEnd=Tc("end",l,ye,R,be,w,0,A),A&&(De=Ge.quickSetter([$,Q],R.a,dn)),!O&&!(vr.length&&Ls(N,"fixedMarkers")===!0)&&(zA(z?yt:N),Ge.set([U,oe],{force3D:!0}),ie=Ge.quickSetter(U,R.a,dn),Ce=Ge.quickSetter(oe,R.a,dn))}if(A){var Ee=A.vars.onUpdate,Re=A.vars.onUpdateParams;A.eventCallback("onUpdate",function(){L.update(0,0,1),Ee&&Ee.apply(A,Re||[])})}if(L.previous=function(){return ot[ot.indexOf(L)-1]},L.next=function(){return ot[ot.indexOf(L)+1]},L.revert=function(Se,$e){if(!$e)return L.kill(!0);var He=Se!==!1||!L.enabled,Qe=On;He!==L.isReverted&&(He&&(me=Math.max(xe(),L.scroll.rec||0),ne=L.progress,ee=r&&r.progress()),$&&[$,Q,U,oe].forEach(function(on){return on.style.display=He?"none":"block"}),He&&(On=L,L.update(He)),h&&(!b||!L.isActive)&&(He?$A(h,he,Y):Kf(h,he,ki(h),fe)),He||L.update(He),On=Qe,L.isReverted=He)},L.refresh=function(Se,$e,He,Qe){if(!((On||!L.enabled)&&!$e)){if(h&&Se&&Wi){Tn(n,"scrollEnd",ky);return}!Qn&&ue&&ue(L),On=L,_e.tween&&!He&&(_e.tween.kill(),_e.tween=0),Pe&&Pe.pause(),m&&r&&(r.revert({kill:!1}).invalidate(),r.getChildren?r.getChildren(!0,!0,!1).forEach(function(Ue){return Ue.vars.immediateRender&&Ue.render(0,!0,!0)}):r.vars.immediateRender&&r.render(0,!0,!0)),L.isReverted||L.revert(!0,!0),L._subPinOffset=!1;var on=de(),at=ke(),Ht=A?A.duration():pr(N,R),zt=K<=.01||!K,Ut=0,Pt=Qe||0,xt=Qs(He)?He.end:i.end,In=i.endTrigger||f,Ft=Qs(He)?He.start:i.start||(i.start===0||!f?0:h?"0 0":"0 100%"),yn=L.pinnedContainer=i.pinnedContainer&&ri(i.pinnedContainer,L),pi=f&&Math.max(0,ot.indexOf(L))||0,an=pi,hn,Sn,wr,Po,Mn,jt,Li,C,j,se,J,te,Ie;for(H&&Qs(He)&&(te=Ge.getProperty(U,R.p),Ie=Ge.getProperty(oe,R.p));an-- >0;)jt=ot[an],jt.end||jt.refresh(0,1)||(On=L),Li=jt.pin,Li&&(Li===f||Li===h||Li===yn)&&!jt.isReverted&&(se||(se=[]),se.unshift(jt),jt.revert(!0,!0)),jt!==ot[an]&&(pi--,an--);for(Vn(Ft)&&(Ft=Ft(L)),Ft=ng(Ft,"start",L),P=fg(Ft,f,on,R,xe(),$,U,L,at,X,O,Ht,A,L._startClamp&&"_startClamp")||(h?-.001:0),Vn(xt)&&(xt=xt(L)),xi(xt)&&!xt.indexOf("+=")&&(~xt.indexOf(" ")?xt=(xi(Ft)?Ft.split(" ")[0]:"")+xt:(Ut=ou(xt.substr(2),on),xt=xi(Ft)?Ft:(A?Ge.utils.mapRange(0,A.duration(),A.scrollTrigger.start,A.scrollTrigger.end,P):P)+Ut,In=f)),xt=ng(xt,"end",L),B=Math.max(P,fg(xt||(In?"100% 0":Ht),In,on,R,xe()+Ut,Q,oe,L,at,X,O,Ht,A,L._endClamp&&"_endClamp"))||-.001,Ut=0,an=pi;an--;)jt=ot[an]||{},Li=jt.pin,Li&&jt.start-jt._pinPush<=P&&!A&&jt.end>0&&(hn=jt.end-(L._startClamp?Math.max(0,jt.start):jt.start),(Li===f&&jt.start-jt._pinPush<P||Li===yn)&&isNaN(Ft)&&(Ut+=hn*(1-jt.progress)),Li===h&&(Pt+=hn));if(P+=Ut,B+=Ut,L._startClamp&&(L._startClamp+=Ut),L._endClamp&&!Qn&&(L._endClamp=B||-.001,B=Math.min(B,pr(N,R))),K=B-P||(P-=.01)&&.001,zt&&(ne=Ge.utils.clamp(0,1,Ge.utils.normalize(P,B,me))),L._pinPush=Pt,$&&Ut&&(hn={},hn[R.a]="+="+Ut,yn&&(hn[R.p]="-="+xe()),Ge.set([$,Q],hn)),h&&!(bd&&L.end>=pr(N,R)))hn=ki(h),Po=R===mn,wr=xe(),Z=parseFloat(M(R.a))+Pt,!Ht&&B>1&&(J=(z?wt.scrollingElement||Mi:N).style,J={style:J,value:J["overflow"+R.a.toUpperCase()]},z&&ki(yt)["overflow"+R.a.toUpperCase()]!=="scroll"&&(J.style["overflow"+R.a.toUpperCase()]="scroll")),Kf(h,he,hn),q=wc(h),Sn=kr(h,!0),C=O&&Os(N,Po?ti:mn)(),p?(fe=[p+R.os2,K+Pt+dn],fe.t=he,an=p===cn?Hu(h,R)+K+Pt:0,an&&(fe.push(R.d,an+dn),he.style.flexBasis!=="auto"&&(he.style.flexBasis=an+dn)),xa(fe),yn&&ot.forEach(function(Ue){Ue.pin===yn&&Ue.vars.pinSpacing!==!1&&(Ue._subPinOffset=!0)}),O&&xe(me)):(an=Hu(h,R),an&&he.style.flexBasis!=="auto"&&(he.style.flexBasis=an+dn)),O&&(Mn={top:Sn.top+(Po?wr-P:C)+dn,left:Sn.left+(Po?C:wr-P)+dn,boxSizing:"border-box",position:"fixed"},Mn[go]=Mn["max"+La]=Math.ceil(Sn.width)+dn,Mn[vo]=Mn["max"+Sm]=Math.ceil(Sn.height)+dn,Mn[Bi]=Mn[Bi+Al]=Mn[Bi+Tl]=Mn[Bi+Rl]=Mn[Bi+wl]="0",Mn[cn]=hn[cn],Mn[cn+Al]=hn[cn+Al],Mn[cn+Tl]=hn[cn+Tl],Mn[cn+Rl]=hn[cn+Rl],Mn[cn+wl]=hn[cn+wl],pe=YA(Y,Mn,b),Qn&&xe(0)),r?(j=r._initted,$f(1),r.render(r.duration(),!0,!0),ae=M(R.a)-Z+K+Pt,le=Math.abs(K-ae)>1,O&&le&&pe.splice(pe.length-2,2),r.render(0,!0,!0),j||r.invalidate(!0),r.parent||r.totalTime(r.totalTime()),$f(0)):ae=K,J&&(J.value?J.style["overflow"+R.a.toUpperCase()]=J.value:J.style.removeProperty("overflow-"+R.a));else if(f&&xe()&&!A)for(Sn=f.parentNode;Sn&&Sn!==yt;)Sn._pinOffset&&(P-=Sn._pinOffset,B-=Sn._pinOffset),Sn=Sn.parentNode;se&&se.forEach(function(Ue){return Ue.revert(!1,!0)}),L.start=P,L.end=B,Te=Be=Qn?me:xe(),!A&&!Qn&&(Te<me&&xe(me),L.scroll.rec=0),L.revert(!1,!0),Ne=Bn(),W&&(ze=-1,W.restart(!0)),On=0,r&&D&&(r._initted||ee)&&r.progress()!==ee&&r.progress(ee||0,!0).render(r.time(),!0,!0),(zt||ne!==L.progress||A||m||r&&!r._initted)&&(r&&!D&&(r._initted||ne||r.vars.immediateRender!==!1)&&r.totalProgress(A&&P<-.001&&!ne?Ge.utils.normalize(P,B,0):ne,!0),L.progress=zt||(Te-P)/K===ne?0:ne),h&&p&&(he._pinOffset=Math.round(L.progress*ae)),Pe&&Pe.invalidate(),isNaN(te)||(te-=Ge.getProperty(U,R.p),Ie-=Ge.getProperty(oe,R.p),Ac(U,R,te),Ac($,R,te-(Qe||0)),Ac(oe,R,Ie),Ac(Q,R,Ie-(Qe||0))),zt&&!Qn&&L.update(),u&&!Qn&&!I&&(I=!0,u(L),I=!1)}},L.getVelocity=function(){return(xe()-Be)/(Bn()-sl)*1e3||0},L.endAnimation=function(){qa(L.callbackAnimation),r&&(Pe?Pe.progress(1):r.paused()?D||qa(r,L.direction<0,1):qa(r,r.reversed()))},L.labelToScroll=function(Se){return r&&r.labels&&(P||L.refresh()||P)+r.labels[Se]/r.duration()*K||0},L.getTrailing=function(Se){var $e=ot.indexOf(L),He=L.direction>0?ot.slice(0,$e).reverse():ot.slice($e+1);return(xi(Se)?He.filter(function(Qe){return Qe.vars.preventOverlaps===Se}):He).filter(function(Qe){return L.direction>0?Qe.end<=P:Qe.start>=B})},L.update=function(Se,$e,He){if(!(A&&!He&&!Se)){var Qe=Qn===!0?me:L.scroll(),on=Se?0:(Qe-P)/K,at=on<0?0:on>1?1:on||0,Ht=L.progress,zt,Ut,Pt,xt,In,Ft,yn,pi;if($e&&(Be=Te,Te=A?xe():Qe,v&&(Me=ve,ve=r&&!D?r.totalProgress():at)),_&&h&&!On&&!yc&&Wi&&(!at&&P<Qe+(Qe-Be)/(Bn()-sl)*_?at=1e-4:at===1&&B>Qe+(Qe-Be)/(Bn()-sl)*_&&(at=.9999)),at!==Ht&&L.enabled){if(zt=L.isActive=!!at&&at<1,Ut=!!Ht&&Ht<1,Ft=zt!==Ut,In=Ft||!!at!=!!Ht,L.direction=at>Ht?1:-1,L.progress=at,In&&!On&&(Pt=at&&!Ht?0:at===1?1:Ht===1?2:3,D&&(xt=!Ft&&k[Pt+1]!=="none"&&k[Pt+1]||k[Pt],pi=r&&(xt==="complete"||xt==="reset"||xt in r))),E&&(Ft||pi)&&(pi||d||!r)&&(Vn(E)?E(L):L.getTrailing(E).forEach(function(wr){return wr.endAnimation()})),D||(Pe&&!On&&!yc?(Pe._dp._time-Pe._start!==Pe._time&&Pe.render(Pe._dp._time-Pe._start),Pe.resetTo?Pe.resetTo("totalProgress",at,r._tTime/r._tDur):(Pe.vars.totalProgress=at,Pe.invalidate().restart())):r&&r.totalProgress(at,!!(On&&(Ne||Se)))),h){if(Se&&p&&(he.style[p+R.os2]=ce),!O)G(al(Z+ae*at));else if(In){if(yn=!Se&&at>Ht&&B+1>Qe&&Qe+1>=pr(N,R),b)if(!Se&&(zt||yn)){var an=kr(h,!0),hn=Qe-P;hg(h,yt,an.top+(R===mn?hn:0)+dn,an.left+(R===mn?0:hn)+dn)}else hg(h,he);xa(zt||yn?pe:q),le&&at<1&&zt||G(Z+(at===1&&!yn?ae:0))}}v&&!_e.tween&&!On&&!yc&&W.restart(!0),a&&(Ft||x&&at&&(at<1||!qf))&&$l(a.targets).forEach(function(wr){return wr.classList[zt||x?"add":"remove"](a.className)}),o&&!D&&!Se&&o(L),In&&!On?(D&&(pi&&(xt==="complete"?r.pause().totalProgress(1):xt==="reset"?r.restart(!0).pause():xt==="restart"?r.restart(!0):r[xt]()),o&&o(L)),(Ft||!qf)&&(c&&Ft&&Fo(L,c),F[Pt]&&Fo(L,F[Pt]),x&&(at===1?L.kill(!1,1):F[Pt]=0),Ft||(Pt=at===1?1:3,F[Pt]&&Fo(L,F[Pt]))),S&&!zt&&Math.abs(L.getVelocity())>(ll(S)?S:2500)&&(qa(L.callbackAnimation),Pe?Pe.progress(1):qa(r,xt==="reverse"?1:!at,1))):D&&o&&!On&&o(L)}if(Ce){var Sn=A?Qe/A.duration()*(A._caScrollDist||0):Qe;ie(Sn+(U._isFlipped?1:0)),Ce(Sn)}De&&De(-Qe/A.duration()*(A._caScrollDist||0))}},L.enable=function(Se,$e){L.enabled||(L.enabled=!0,Tn(N,"resize",cl),z||Tn(N,"scroll",Bo),ue&&Tn(n,"refreshInit",ue),Se!==!1&&(L.progress=ne=0,Te=Be=ze=xe()),$e!==!1&&L.refresh())},L.getTween=function(Se){return Se&&_e?_e.tween:Pe},L.setPositions=function(Se,$e,He,Qe){if(A){var on=A.scrollTrigger,at=A.duration(),Ht=on.end-on.start;Se=on.start+Ht*Se/at,$e=on.start+Ht*$e/at}L.refresh(!1,!1,{start:ig(Se,He&&!!L._startClamp),end:ig($e,He&&!!L._endClamp)},Qe),L.update()},L.adjustPinSpacing=function(Se){if(fe&&Se){var $e=fe.indexOf(R.d)+1;fe[$e]=parseFloat(fe[$e])+Se+dn,fe[1]=parseFloat(fe[1])+Se+dn,xa(fe)}},L.disable=function(Se,$e){if(Se!==!1&&L.revert(!0,!0),L.enabled&&(L.enabled=L.isActive=!1,$e||Pe&&Pe.pause(),me=0,Le&&(Le.uncache=1),ue&&En(n,"refreshInit",ue),W&&(W.pause(),_e.tween&&_e.tween.kill()&&(_e.tween=0)),!z)){for(var He=ot.length;He--;)if(ot[He].scroller===N&&ot[He]!==L)return;En(N,"resize",cl),z||En(N,"scroll",Bo)}},L.kill=function(Se,$e){L.disable(Se,$e),Pe&&!$e&&Pe.kill(),l&&delete Ed[l];var He=ot.indexOf(L);He>=0&&ot.splice(He,1),He===Jn&&lu>0&&Jn--,He=0,ot.forEach(function(Qe){return Qe.scroller===L.scroller&&(He=1)}),He||Qn||(L.scroll.rec=0),r&&(r.scrollTrigger=null,Se&&r.revert({kill:!1}),$e||r.kill()),$&&[$,Q,U,oe].forEach(function(Qe){return Qe.parentNode&&Qe.parentNode.removeChild(Qe)}),Cl===L&&(Cl=0),h&&(Le&&(Le.uncache=1),He=0,ot.forEach(function(Qe){return Qe.pin===h&&He++}),He||(Le.spacer=0)),i.onKill&&i.onKill(L)},ot.push(L),L.enable(!1,!1),Ae&&Ae(L),r&&r.add&&!K){var je=L.update;L.update=function(){L.update=je,ct.cache++,P||B||L.refresh()},Ge.delayedCall(.01,L.update),K=.01,P=B=0}else L.refresh();h&&XA()},n.register=function(i){return ea||(Ge=i||Iy(),Ly()&&window.document&&n.enable(),ea=ol),ea},n.defaults=function(i){if(i)for(var r in i)Ec[r]=i[r];return Ec},n.disable=function(i,r){ol=0,ot.forEach(function(o){return o[r?"kill":"disable"](i)}),En(lt,"wheel",Bo),En(wt,"scroll",Bo),clearInterval(xc),En(wt,"touchcancel",cr),En(yt,"touchstart",cr),Mc(En,wt,"pointerdown,touchstart,mousedown",rg),Mc(En,wt,"pointerup,touchend,mouseup",sg),ku.kill(),Sc(En);for(var s=0;s<ct.length;s+=3)bc(En,ct[s],ct[s+1]),bc(En,ct[s],ct[s+2])},n.enable=function(){if(lt=window,wt=document,Mi=wt.documentElement,yt=wt.body,Ge){if($l=Ge.utils.toArray,bl=Ge.utils.clamp,Md=Ge.core.context||cr,$f=Ge.core.suppressOverwrites||cr,gm=lt.history.scrollRestoration||"auto",Td=lt.pageYOffset||0,Ge.core.globals("ScrollTrigger",n),yt){ol=1,va=document.createElement("div"),va.style.height="100vh",va.style.position="absolute",Gy(),BA(),nn.register(Ge),n.isTouch=nn.isTouch,ps=nn.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Sd=nn.isTouch===1,Tn(lt,"wheel",Bo),_m=[lt,wt,Mi,yt],Ge.matchMedia?(n.matchMedia=function(u){var d=Ge.matchMedia(),f;for(f in u)d.add(f,u[f]);return d},Ge.addEventListener("matchMediaInit",function(){zy(),bm()}),Ge.addEventListener("matchMediaRevert",function(){return Hy()}),Ge.addEventListener("matchMedia",function(){ro(0,1),Eo("matchMedia")}),Ge.matchMedia().add("(orientation: portrait)",function(){return jf(),jf})):console.warn("Requires GSAP 3.11.0 or later"),jf(),Tn(wt,"scroll",Bo);var i=yt.hasAttribute("style"),r=yt.style,s=r.borderTopStyle,o=Ge.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),r.borderTopStyle="solid",a=kr(yt),mn.m=Math.round(a.top+mn.sc())||0,ti.m=Math.round(a.left+ti.sc())||0,s?r.borderTopStyle=s:r.removeProperty("border-top-style"),i||(yt.setAttribute("style",""),yt.removeAttribute("style")),xc=setInterval(lg,250),Ge.delayedCall(.5,function(){return yc=0}),Tn(wt,"touchcancel",cr),Tn(yt,"touchstart",cr),Mc(Tn,wt,"pointerdown,touchstart,mousedown",rg),Mc(Tn,wt,"pointerup,touchend,mouseup",sg),yd=Ge.utils.checkPrefix("transform"),cu.push(yd),ea=Bn(),ku=Ge.delayedCall(.2,ro).pause(),ta=[wt,"visibilitychange",function(){var u=lt.innerWidth,d=lt.innerHeight;wt.hidden?(eg=u,tg=d):(eg!==u||tg!==d)&&cl()},wt,"DOMContentLoaded",ro,lt,"load",ro,lt,"resize",cl],Sc(Tn),ot.forEach(function(u){return u.enable(0,1)}),l=0;l<ct.length;l+=3)bc(En,ct[l],ct[l+1]),bc(En,ct[l],ct[l+2])}else if(wt){var c=function u(){n.enable(),wt.removeEventListener("DOMContentLoaded",u)};wt.addEventListener("DOMContentLoaded",c)}}},n.config=function(i){"limitCallbacks"in i&&(qf=!!i.limitCallbacks);var r=i.syncInterval;r&&clearInterval(xc)||(xc=r)&&setInterval(lg,r),"ignoreMobileResize"in i&&(Sd=n.isTouch===1&&i.ignoreMobileResize),"autoRefreshEvents"in i&&(Sc(En)||Sc(Tn,i.autoRefreshEvents||"none"),Cy=(i.autoRefreshEvents+"").indexOf("resize")===-1)},n.scrollerProxy=function(i,r){var s=ri(i),o=ct.indexOf(s),a=Mo(s);~o&&ct.splice(o,a?6:2),r&&(a?vr.unshift(lt,r,yt,r,Mi,r):vr.unshift(s,r))},n.clearMatchMedia=function(i){ot.forEach(function(r){return r._ctx&&r._ctx.query===i&&r._ctx.kill(!0,!0)})},n.isInViewport=function(i,r,s){var o=(xi(i)?ri(i):i).getBoundingClientRect(),a=o[s?go:vo]*r||0;return s?o.right-a>0&&o.left+a<lt.innerWidth:o.bottom-a>0&&o.top+a<lt.innerHeight},n.positionInViewport=function(i,r,s){xi(i)&&(i=ri(i));var o=i.getBoundingClientRect(),a=o[s?go:vo],l=r==null?a/2:r in zu?zu[r]*a:~r.indexOf("%")?parseFloat(r)*a/100:parseFloat(r)||0;return s?(o.left+l)/lt.innerWidth:(o.top+l)/lt.innerHeight},n.killAll=function(i){if(ot.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),i!==!0){var r=bo.killAll||[];bo={},r.forEach(function(s){return s()})}},n})();rt.version="3.15.0";rt.saveStyles=function(n){return n?$l(n).forEach(function(e){if(e&&e.style){var t=vi.indexOf(e);t>=0&&vi.splice(t,5),vi.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),Ge.core.getCache(e),Md())}}):vi};rt.revert=function(n,e){return bm(!n,e)};rt.create=function(n,e){return new rt(n,e)};rt.refresh=function(n){return n?cl(!0):(ea||rt.register())&&ro(!0)};rt.update=function(n){return++ct.cache&&Wr(n===!0?2:0)};rt.clearScrollMemory=Vy;rt.maxScroll=function(n,e){return pr(n,e?ti:mn)};rt.getScrollFunc=function(n,e){return Os(ri(n),e?ti:mn)};rt.getById=function(n){return Ed[n]};rt.getAll=function(){return ot.filter(function(n){return n.vars.id!=="ScrollSmoother"})};rt.isScrolling=function(){return!!Wi};rt.snapDirectional=Mm;rt.addEventListener=function(n,e){var t=bo[n]||(bo[n]=[]);~t.indexOf(e)||t.push(e)};rt.removeEventListener=function(n,e){var t=bo[n],i=t&&t.indexOf(e);i>=0&&t.splice(i,1)};rt.batch=function(n,e){var t=[],i={},r=e.interval||.016,s=e.batchMax||1e9,o=function(c,u){var d=[],f=[],h=Ge.delayedCall(r,function(){u(d,f),d=[],f=[]}).pause();return function(p){d.length||h.restart(!0),d.push(p.trigger),f.push(p),s<=d.length&&h.progress(1)}},a;for(a in e)i[a]=a.substr(0,2)==="on"&&Vn(e[a])&&a!=="onRefreshInit"?o(a,e[a]):e[a];return Vn(s)&&(s=s(),Tn(rt,"refresh",function(){return s=e.batchMax()})),$l(n).forEach(function(l){var c={};for(a in i)c[a]=i[a];c.trigger=l,t.push(rt.create(c))}),t};var pg=function(e,t,i,r){return t>r?e(r):t<0&&e(0),i>r?(r-t)/(i-t):i<0?t/(t-i):1},Zf=function n(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(nn.isTouch?" pinch-zoom":""):"none",e===Mi&&n(yt,t)},Rc={auto:1,scroll:1},KA=function(e){var t=e.event,i=e.target,r=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,o=s._gsap||Ge.core.getCache(s),a=Bn(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;s&&s!==yt&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(Rc[(l=ki(s)).overflowY]||Rc[l.overflowX]));)s=s.parentNode;o._isScroll=s&&s!==i&&!Mo(s)&&(Rc[(l=ki(s)).overflowY]||Rc[l.overflowX]),o._isScrollT=a}(o._isScroll||r==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},Xy=function(e,t,i,r){return nn.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:r=r&&KA,onPress:r,onDrag:r,onScroll:r,onEnable:function(){return i&&Tn(wt,nn.eventTypes[0],_g,!1,!0)},onDisable:function(){return En(wt,nn.eventTypes[0],_g,!0)}})},ZA=/(input|label|select|textarea)/i,mg,_g=function(e){var t=ZA.test(e.target.tagName);(t||mg)&&(e._gsapAllow=!0,mg=t)},JA=function(e){Qs(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,i=t.normalizeScrollX,r=t.momentum,s=t.allowNestedScroll,o=t.onRelease,a,l,c=ri(e.target)||Mi,u=Ge.core.globals().ScrollSmoother,d=u&&u.get(),f=ps&&(e.content&&ri(e.content)||d&&e.content!==!1&&!d.smooth()&&d.content()),h=Os(c,mn),p=Os(c,ti),m=1,_=(nn.isTouch&&lt.visualViewport?lt.visualViewport.scale*lt.visualViewport.width:lt.outerWidth)/lt.innerWidth,g=0,y=Vn(r)?function(){return r(a)}:function(){return r||2.8},x,v,b=Xy(c,e.type,!0,s),T=function(){return v=!1},A=cr,S=cr,E=function(){l=pr(c,mn),S=bl(ps?1:0,l),i&&(A=bl(0,pr(c,ti))),x=xo},R=function(){f._gsap.y=al(parseFloat(f._gsap.y)+h.offset)+"px",f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(f._gsap.y)+", 0, 1)",h.offset=h.cacheID=0},D=function(){if(v){requestAnimationFrame(T);var H=al(a.deltaY/2),X=S(h.v-H);if(f&&X!==h.v+h.offset){h.offset=X-h.v;var L=al((parseFloat(f&&f._gsap.y)||0)-h.offset);f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+L+", 0, 1)",f._gsap.y=L+"px",h.cacheID=ct.cache,Wr()}return!0}h.offset&&R(),v=!0},N,V,z,O,F=function(){E(),N.isActive()&&N.vars.scrollY>l&&(h()>l?N.progress(1)&&h(l):N.resetTo("scrollY",l))};return f&&Ge.set(f,{y:"+=0"}),e.ignoreCheck=function(k){return ps&&k.type==="touchmove"&&D()||m>1.05&&k.type!=="touchstart"||a.isGesturing||k.touches&&k.touches.length>1},e.onPress=function(){v=!1;var k=m;m=al((lt.visualViewport&&lt.visualViewport.scale||1)/_),N.pause(),k!==m&&Zf(c,m>1.01?!0:i?!1:"x"),V=p(),z=h(),E(),x=xo},e.onRelease=e.onGestureStart=function(k,H){if(h.offset&&R(),!H)O.restart(!0);else{ct.cache++;var X=y(),L,ue;i&&(L=p(),ue=L+X*.05*-k.velocityX/.227,X*=pg(p,L,ue,pr(c,ti)),N.vars.scrollX=A(ue)),L=h(),ue=L+X*.05*-k.velocityY/.227,X*=pg(h,L,ue,pr(c,mn)),N.vars.scrollY=S(ue),N.invalidate().duration(X).play(.01),(ps&&N.vars.scrollY>=l||L>=l-1)&&Ge.to({},{onUpdate:F,duration:X})}o&&o(k)},e.onWheel=function(){N._ts&&N.pause(),Bn()-g>1e3&&(x=0,g=Bn())},e.onChange=function(k,H,X,L,ue){if(xo!==x&&E(),H&&i&&p(A(L[2]===H?V+(k.startX-k.x):p()+H-L[1])),X){h.offset&&R();var de=ue[2]===X,ke=de?z+k.startY-k.y:h()+X-ue[1],ze=S(ke);de&&ke!==ze&&(z+=ze-ke),h(ze)}(X||H)&&Wr()},e.onEnable=function(){Zf(c,i?!1:"x"),rt.addEventListener("refresh",F),Tn(lt,"resize",F),h.smooth&&(h.target.style.scrollBehavior="auto",h.smooth=p.smooth=!1),b.enable()},e.onDisable=function(){Zf(c,!0),En(lt,"resize",F),rt.removeEventListener("refresh",F),b.kill()},e.lockAxis=e.lockAxis!==!1,a=new nn(e),a.iOS=ps,ps&&!h()&&h(1),ps&&Ge.ticker.add(cr),O=a._dc,N=Ge.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:i?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:Wy(h,h(),function(){return N.pause()})},onUpdate:Wr,onComplete:O.vars.onComplete}),a};rt.sort=function(n){if(Vn(n))return ot.sort(n);var e=lt.pageYOffset||0;return rt.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+lt.innerHeight}),ot.sort(n||function(t,i){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((i.vars.containerAnimation?1e6:i._sortY)+(i.vars.refreshPriority||0)*-1e6)})};rt.observe=function(n){return new nn(n)};rt.normalizeScroll=function(n){if(typeof n>"u")return Zn;if(n===!0&&Zn)return Zn.enable();if(n===!1){Zn&&Zn.kill(),Zn=n;return}var e=n instanceof nn?n:JA(n);return Zn&&Zn.target===e.target&&Zn.kill(),Mo(e.target)&&(Zn=e),e};rt.core={_getVelocityProp:xd,_inputObserver:Xy,_scrollers:ct,_proxies:vr,bridge:{ss:function(){Wi||Eo("scrollStart"),Wi=Bn()},ref:function(){return On}}};Iy()&&Ge.registerPlugin(rt);const QA={viewBox:"0 0 300 300"},eR=["x","y","fill"],tR={class:"orange-core__content"},Jf=4,nR=2,iR=0,rR=Tr({__name:"OrangeCore",props:{color:{default:"#ff6a00"}},setup(n){const e=Array.from({length:9},(o,a)=>({x:a%3*100,y:Math.floor(a/3)*100})),t=[0,1,2,3,5,6,7,8],i=vt(null),r=vt(null),s=vt(null);return Kr(()=>{_n.registerPlugin(rt);const o=i.value,a=r.value,l=s.value;if(!o||!a||!l)return;const c=Array.from(l.querySelectorAll(".orange-core__cell")),u=o.querySelector(".orange-core-anchor"),d=.92;_n.set(a,{autoAlpha:0,zIndex:nR}),_n.set(c,{opacity:0,scale:d,transformOrigin:"50% 50%"}),_n.set(c[Jf],{opacity:1});const f=()=>{if(!u)return{x:0,y:0,scale:1};const _=u.getBoundingClientRect(),g=o.getBoundingClientRect(),y=a.getBoundingClientRect();return{x:_.left+_.width/2-(y.left+y.width/2),y:_.top-g.top+_.height/2-(y.top+y.height/2),scale:_.width*3/((l.offsetWidth||1)*d)}},h=()=>{const _=Math.abs(f().x);return Math.max(window.innerWidth/2+_,window.innerHeight/2)*2/(l.offsetWidth||1)*1.1},p=_n.timeline({defaults:{ease:"none"},scrollTrigger:{trigger:o,start:"top bottom",end:"bottom bottom",scrub:!0,invalidateOnRefresh:!0,onToggle:_=>{_n.to(a,{autoAlpha:_.isActive?1:0,duration:.25,overwrite:"auto"})}}});p.fromTo(l,{x:()=>f().x,y:()=>f().y+a.clientHeight,scale:()=>f().scale},{x:()=>f().x,y:()=>f().y,scale:()=>f().scale,duration:1,ease:"none",immediateRender:!0},0);const m=_n.timeline({defaults:{ease:"none"}});m.addLabel("mosaic",0),m.fromTo(l,{x:()=>f().x,y:()=>f().y,scale:()=>f().scale},{x:()=>f().x,y:0,scale:1,duration:.45,ease:"power2.inOut",immediateRender:!1},.1);for(const _ of c)Array.from({length:3},()=>.05+Math.random()*.9).sort((y,x)=>y-x).forEach((y,x)=>m.set(_,{opacity:x%2===0?1:0},y));m.addLabel("converge",1),m.set(a,{zIndex:iR},1),m.set(c[Jf],{opacity:1},1);for(const _ of t){const g=1.05+Math.random()*.5;m.set(c[_],{opacity:0},g),m.set(c[_],{opacity:1},g+.06),m.set(c[_],{opacity:0},g+.12)}m.addLabel("expand",2),m.to(c[Jf],{scale:3,duration:.7,ease:"power2.inOut"},2),m.to(l,{scale:()=>h(),duration:.8,ease:"power2.in"},2.1),m.to({},{duration:.1},2.9),m.duration(2),p.add(m,1),Zr(()=>{p.scrollTrigger?.kill(),p.kill()})}),(o,a)=>(_t(),Xt("div",{ref_key:"trackRef",ref:i,class:"orange-core"},[en("div",{ref_key:"layerRef",ref:r,class:"orange-core__layer","aria-hidden":"true"},[en("div",{ref_key:"boxRef",ref:s,class:"orange-core__box"},[(_t(),Xt("svg",QA,[(_t(!0),Xt(Qt,null,ec(ut(e),(l,c)=>(_t(),Xt("rect",{key:c,class:"orange-core__cell",x:l.x,y:l.y,width:"100",height:"100",fill:n.color},null,8,eR))),128))]))],512)],512),en("div",tR,[uv(o.$slots,"default",{},void 0)])],512))}}),sR=Object.assign(Ha(rR,[["__scopeId","data-v-d19dff2a"]]),{__name:"OrangeCore"});const Em="184",oR=0,gg=1,aR=2,fu=1,lR=2,ul=3,Bs=0,fi=1,Hr=2,Xr=0,ya=1,vg=2,xg=3,yg=4,cR=5,to=100,uR=101,fR=102,hR=103,dR=104,pR=200,mR=201,_R=202,gR=203,Ad=204,Rd=205,vR=206,xR=207,yR=208,SR=209,MR=210,bR=211,ER=212,TR=213,wR=214,Cd=0,Pd=1,Dd=2,Ia=3,Ld=4,Id=5,Nd=6,Ud=7,$y=0,AR=1,RR=2,xr=0,qy=1,Yy=2,jy=3,Ky=4,Zy=5,Jy=6,Qy=7,eS=300,To=301,Na=302,Qf=303,eh=304,_f=306,Fd=1e3,Zi=1001,Od=1002,Dn=1003,CR=1004,Cc=1005,gn=1006,th=1007,ws=1008,zi=1009,tS=1010,nS=1011,Yl=1012,Tm=1013,Er=1014,mr=1015,es=1016,wm=1017,Am=1018,jl=1020,iS=35902,rS=35899,sS=1021,oS=1022,Ji=1023,ts=1026,so=1027,aS=1028,Rm=1029,wo=1030,Cm=1031,Pm=1033,hu=33776,du=33777,pu=33778,mu=33779,Bd=35840,kd=35841,Hd=35842,zd=35843,Vd=36196,Gd=37492,Wd=37496,Xd=37488,$d=37489,Vu=37490,qd=37491,Yd=37808,jd=37809,Kd=37810,Zd=37811,Jd=37812,Qd=37813,ep=37814,tp=37815,np=37816,ip=37817,rp=37818,sp=37819,op=37820,ap=37821,lp=36492,cp=36494,up=36495,fp=36283,hp=36284,Gu=36285,dp=36286,PR=3200,Sg=0,DR=1,xs="",Oi="srgb",Wu="srgb-linear",Xu="linear",At="srgb",ko=7680,Mg=519,LR=512,IR=513,NR=514,Dm=515,UR=516,FR=517,Lm=518,OR=519,bg=35044,BR=35048,Eg="300 es",_r=2e3,$u=2001;function kR(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function qu(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function HR(){const n=qu("canvas");return n.style.display="block",n}const Tg={};function wg(...n){const e="THREE."+n.shift();console.log(e,...n)}function lS(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Je(...n){n=lS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function pt(...n){n=lS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function pp(...n){const e=n.join(" ");e in Tg||(Tg[e]=!0,Je(...n))}function zR(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const VR={[Cd]:Pd,[Dd]:Nd,[Ld]:Ud,[Ia]:Id,[Pd]:Cd,[Nd]:Dd,[Ud]:Ld,[Id]:Ia};class Co{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],nh=Math.PI/180,mp=180/Math.PI;function rc(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Un[n&255]+Un[n>>8&255]+Un[n>>16&255]+Un[n>>24&255]+"-"+Un[e&255]+Un[e>>8&255]+"-"+Un[e>>16&15|64]+Un[e>>24&255]+"-"+Un[t&63|128]+Un[t>>8&255]+"-"+Un[t>>16&255]+Un[t>>24&255]+Un[i&255]+Un[i>>8&255]+Un[i>>16&255]+Un[i>>24&255]).toLowerCase()}function ht(n,e,t){return Math.max(e,Math.min(t,n))}function GR(n,e){return(n%e+e)%e}function ih(n,e,t){return(1-t)*n+t*e}function Ya(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ii(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Fm=class Fm{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Fm.prototype.isVector2=!0;let Et=Fm;class za{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],d=i[r+3],f=s[o+0],h=s[o+1],p=s[o+2],m=s[o+3];if(d!==m||l!==f||c!==h||u!==p){let _=l*f+c*h+u*p+d*m;_<0&&(f=-f,h=-h,p=-p,m=-m,_=-_);let g=1-a;if(_<.9995){const y=Math.acos(_),x=Math.sin(y);g=Math.sin(g*y)/x,a=Math.sin(a*y)/x,l=l*g+f*a,c=c*g+h*a,u=u*g+p*a,d=d*g+m*a}else{l=l*g+f*a,c=c*g+h*a,u=u*g+p*a,d=d*g+m*a;const y=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=y,c*=y,u*=y,d*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],d=s[o],f=s[o+1],h=s[o+2],p=s[o+3];return e[t]=a*p+u*d+l*h-c*f,e[t+1]=l*p+u*f+c*d-a*h,e[t+2]=c*p+u*h+a*f-l*d,e[t+3]=u*p-a*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),d=a(s/2),f=l(i/2),h=l(r/2),p=l(s/2);switch(o){case"XYZ":this._x=f*u*d+c*h*p,this._y=c*h*d-f*u*p,this._z=c*u*p+f*h*d,this._w=c*u*d-f*h*p;break;case"YXZ":this._x=f*u*d+c*h*p,this._y=c*h*d-f*u*p,this._z=c*u*p-f*h*d,this._w=c*u*d+f*h*p;break;case"ZXY":this._x=f*u*d-c*h*p,this._y=c*h*d+f*u*p,this._z=c*u*p+f*h*d,this._w=c*u*d-f*h*p;break;case"ZYX":this._x=f*u*d-c*h*p,this._y=c*h*d+f*u*p,this._z=c*u*p-f*h*d,this._w=c*u*d+f*h*p;break;case"YZX":this._x=f*u*d+c*h*p,this._y=c*h*d+f*u*p,this._z=c*u*p-f*h*d,this._w=c*u*d-f*h*p;break;case"XZY":this._x=f*u*d-c*h*p,this._y=c*h*d-f*u*p,this._z=c*u*p+f*h*d,this._w=c*u*d+f*h*p;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=i+a+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(s-c)*h,this._z=(o-r)*h}else if(i>a&&i>d){const h=2*Math.sqrt(1+i-a-d);this._w=(u-l)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(s+c)/h}else if(a>d){const h=2*Math.sqrt(1+a-i-d);this._w=(s-c)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-i-a);this._w=(o-r)/h,this._x=(s+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Om=class Om{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ag.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ag.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),d=2*(s*i-o*t);return this.x=t+l*c+o*d-a*u,this.y=i+l*u+a*c-s*d,this.z=r+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return rh.copy(this).projectOnVector(e),this.sub(rh)}reflect(e){return this.sub(rh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Om.prototype.isVector3=!0;let re=Om;const rh=new re,Ag=new za,Bm=class Bm{constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],f=i[2],h=i[5],p=i[8],m=r[0],_=r[3],g=r[6],y=r[1],x=r[4],v=r[7],b=r[2],T=r[5],A=r[8];return s[0]=o*m+a*y+l*b,s[3]=o*_+a*x+l*T,s[6]=o*g+a*v+l*A,s[1]=c*m+u*y+d*b,s[4]=c*_+u*x+d*T,s[7]=c*g+u*v+d*A,s[2]=f*m+h*y+p*b,s[5]=f*_+h*x+p*T,s[8]=f*g+h*v+p*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,f=a*l-u*s,h=c*s-o*l,p=t*d+i*f+r*h;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/p;return e[0]=d*m,e[1]=(r*c-u*i)*m,e[2]=(a*i-r*o)*m,e[3]=f*m,e[4]=(u*t-r*l)*m,e[5]=(r*s-a*t)*m,e[6]=h*m,e[7]=(i*l-c*t)*m,e[8]=(o*t-i*s)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Bm.prototype.isMatrix3=!0;let tt=Bm;const sh=new tt,Rg=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cg=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function WR(){const n={enabled:!0,workingColorSpace:Wu,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===At&&(r.r=$r(r.r),r.g=$r(r.g),r.b=$r(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===At&&(r.r=Sa(r.r),r.g=Sa(r.g),r.b=Sa(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===xs?Xu:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return pp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return pp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Wu]:{primaries:e,whitePoint:i,transfer:Xu,toXYZ:Rg,fromXYZ:Cg,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Oi},outputColorSpaceConfig:{drawingBufferColorSpace:Oi}},[Oi]:{primaries:e,whitePoint:i,transfer:At,toXYZ:Rg,fromXYZ:Cg,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Oi}}}),n}const ft=WR();function $r(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Sa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ho;class XR{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ho===void 0&&(Ho=qu("canvas")),Ho.width=e.width,Ho.height=e.height;const r=Ho.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ho}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=qu("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=$r(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor($r(t[i]/255)*255):t[i]=$r(t[i]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $R=0;class Im{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$R++}),this.uuid=rc(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(oh(r[o].image)):s.push(oh(r[o]))}else s=oh(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function oh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?XR.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}let qR=0;const ah=new re;class Xn extends Co{constructor(e=Xn.DEFAULT_IMAGE,t=Xn.DEFAULT_MAPPING,i=Zi,r=Zi,s=gn,o=ws,a=Ji,l=zi,c=Xn.DEFAULT_ANISOTROPY,u=xs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qR++}),this.uuid=rc(),this.name="",this.source=new Im(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Et(0,0),this.repeat=new Et(1,1),this.center=new Et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ah).x}get height(){return this.source.getSize(ah).y}get depth(){return this.source.getSize(ah).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==eS)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fd:e.x=e.x-Math.floor(e.x);break;case Zi:e.x=e.x<0?0:1;break;case Od:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fd:e.y=e.y-Math.floor(e.y);break;case Zi:e.y=e.y<0?0:1;break;case Od:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=eS;Xn.DEFAULT_ANISOTROPY=1;const km=class km{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],p=l[9],m=l[2],_=l[6],g=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-m)<.01&&Math.abs(p-_)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+m)<.1&&Math.abs(p+_)<.1&&Math.abs(c+h+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,v=(h+1)/2,b=(g+1)/2,T=(u+f)/4,A=(d+m)/4,S=(p+_)/4;return x>v&&x>b?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=T/i,s=A/i):v>b?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=T/r,s=S/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=A/s,r=S/s),this.set(i,r,s,t),this}let y=Math.sqrt((_-p)*(_-p)+(d-m)*(d-m)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(_-p)/y,this.y=(d-m)/y,this.z=(f-u)/y,this.w=Math.acos((c+h+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};km.prototype.isVector4=!0;let tn=km;class YR extends Co{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new tn(0,0,e,t),this.scissorTest=!1,this.viewport=new tn(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new Xn(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:gn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Im(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yr extends YR{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class cS extends Xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class jR extends Xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Yu=class Yu{constructor(e,t,i,r,s,o,a,l,c,u,d,f,h,p,m,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,d,f,h,p,m,_)}set(e,t,i,r,s,o,a,l,c,u,d,f,h,p,m,_){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=r,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=d,g[14]=f,g[3]=h,g[7]=p,g[11]=m,g[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Yu().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/zo.setFromMatrixColumn(e,0).length(),s=1/zo.setFromMatrixColumn(e,1).length(),o=1/zo.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=o*u,h=o*d,p=a*u,m=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+p*c,t[5]=f-m*c,t[9]=-a*l,t[2]=m-f*c,t[6]=p+h*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,h=l*d,p=c*u,m=c*d;t[0]=f+m*a,t[4]=p*a-h,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=h*a-p,t[6]=m+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,h=l*d,p=c*u,m=c*d;t[0]=f-m*a,t[4]=-o*d,t[8]=p+h*a,t[1]=h+p*a,t[5]=o*u,t[9]=m-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,h=o*d,p=a*u,m=a*d;t[0]=l*u,t[4]=p*c-h,t[8]=f*c+m,t[1]=l*d,t[5]=m*c+f,t[9]=h*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,h=o*c,p=a*l,m=a*c;t[0]=l*u,t[4]=m-f*d,t[8]=p*d+h,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=h*d+p,t[10]=f-m*d}else if(e.order==="XZY"){const f=o*l,h=o*c,p=a*l,m=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+m,t[5]=o*u,t[9]=h*d-p,t[2]=p*d-h,t[6]=a*u,t[10]=m*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(KR,e,ZR)}lookAt(e,t,i){const r=this.elements;return _i.subVectors(e,t),_i.lengthSq()===0&&(_i.z=1),_i.normalize(),as.crossVectors(i,_i),as.lengthSq()===0&&(Math.abs(i.z)===1?_i.x+=1e-4:_i.z+=1e-4,_i.normalize(),as.crossVectors(i,_i)),as.normalize(),Pc.crossVectors(_i,as),r[0]=as.x,r[4]=Pc.x,r[8]=_i.x,r[1]=as.y,r[5]=Pc.y,r[9]=_i.y,r[2]=as.z,r[6]=Pc.z,r[10]=_i.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],f=i[9],h=i[13],p=i[2],m=i[6],_=i[10],g=i[14],y=i[3],x=i[7],v=i[11],b=i[15],T=r[0],A=r[4],S=r[8],E=r[12],R=r[1],D=r[5],N=r[9],V=r[13],z=r[2],O=r[6],F=r[10],k=r[14],H=r[3],X=r[7],L=r[11],ue=r[15];return s[0]=o*T+a*R+l*z+c*H,s[4]=o*A+a*D+l*O+c*X,s[8]=o*S+a*N+l*F+c*L,s[12]=o*E+a*V+l*k+c*ue,s[1]=u*T+d*R+f*z+h*H,s[5]=u*A+d*D+f*O+h*X,s[9]=u*S+d*N+f*F+h*L,s[13]=u*E+d*V+f*k+h*ue,s[2]=p*T+m*R+_*z+g*H,s[6]=p*A+m*D+_*O+g*X,s[10]=p*S+m*N+_*F+g*L,s[14]=p*E+m*V+_*k+g*ue,s[3]=y*T+x*R+v*z+b*H,s[7]=y*A+x*D+v*O+b*X,s[11]=y*S+x*N+v*F+b*L,s[15]=y*E+x*V+v*k+b*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],p=e[3],m=e[7],_=e[11],g=e[15],y=l*h-c*f,x=a*h-c*d,v=a*f-l*d,b=o*h-c*u,T=o*f-l*u,A=o*d-a*u;return t*(m*y-_*x+g*v)-i*(p*y-_*b+g*T)+r*(p*x-m*b+g*A)-s*(p*v-m*T+_*A)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],p=e[12],m=e[13],_=e[14],g=e[15],y=t*a-i*o,x=t*l-r*o,v=t*c-s*o,b=i*l-r*a,T=i*c-s*a,A=r*c-s*l,S=u*m-d*p,E=u*_-f*p,R=u*g-h*p,D=d*_-f*m,N=d*g-h*m,V=f*g-h*_,z=y*V-x*N+v*D+b*R-T*E+A*S;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/z;return e[0]=(a*V-l*N+c*D)*O,e[1]=(r*N-i*V-s*D)*O,e[2]=(m*A-_*T+g*b)*O,e[3]=(f*T-d*A-h*b)*O,e[4]=(l*R-o*V-c*E)*O,e[5]=(t*V-r*R+s*E)*O,e[6]=(_*v-p*A-g*x)*O,e[7]=(u*A-f*v+h*x)*O,e[8]=(o*N-a*R+c*S)*O,e[9]=(i*R-t*N-s*S)*O,e[10]=(p*T-m*v+g*y)*O,e[11]=(d*v-u*T-h*y)*O,e[12]=(a*E-o*D-l*S)*O,e[13]=(t*D-i*E+r*S)*O,e[14]=(m*x-p*b-_*y)*O,e[15]=(u*b-d*x+f*y)*O,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,d=a+a,f=s*c,h=s*u,p=s*d,m=o*u,_=o*d,g=a*d,y=l*c,x=l*u,v=l*d,b=i.x,T=i.y,A=i.z;return r[0]=(1-(m+g))*b,r[1]=(h+v)*b,r[2]=(p-x)*b,r[3]=0,r[4]=(h-v)*T,r[5]=(1-(f+g))*T,r[6]=(_+y)*T,r[7]=0,r[8]=(p+x)*A,r[9]=(_-y)*A,r[10]=(1-(f+m))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),t.identity(),this;let o=zo.set(r[0],r[1],r[2]).length();const a=zo.set(r[4],r[5],r[6]).length(),l=zo.set(r[8],r[9],r[10]).length();s<0&&(o=-o),$i.copy(this);const c=1/o,u=1/a,d=1/l;return $i.elements[0]*=c,$i.elements[1]*=c,$i.elements[2]*=c,$i.elements[4]*=u,$i.elements[5]*=u,$i.elements[6]*=u,$i.elements[8]*=d,$i.elements[9]*=d,$i.elements[10]*=d,t.setFromRotationMatrix($i),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=_r,l=!1){const c=this.elements,u=2*s/(t-e),d=2*s/(i-r),f=(t+e)/(t-e),h=(i+r)/(i-r);let p,m;if(l)p=s/(o-s),m=o*s/(o-s);else if(a===_r)p=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(a===$u)p=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=_r,l=!1){const c=this.elements,u=2/(t-e),d=2/(i-r),f=-(t+e)/(t-e),h=-(i+r)/(i-r);let p,m;if(l)p=1/(o-s),m=o/(o-s);else if(a===_r)p=-2/(o-s),m=-(o+s)/(o-s);else if(a===$u)p=-1/(o-s),m=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Yu.prototype.isMatrix4=!0;let sn=Yu;const zo=new re,$i=new sn,KR=new re(0,0,0),ZR=new re(1,1,1),as=new re,Pc=new re,_i=new re,Pg=new sn,Dg=new za;class Ao{constructor(e=0,t=0,i=0,r=Ao.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],d=r[2],f=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin(ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(ht(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,h));break;case"XZY":this._z=Math.asin(-ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Pg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Dg.setFromEuler(this),this.setFromQuaternion(Dg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ao.DEFAULT_ORDER="XYZ";class Nm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let JR=0;const Lg=new re,Vo=new za,Rr=new sn,Dc=new re,ja=new re,QR=new re,eC=new za,Ig=new re(1,0,0),Ng=new re(0,1,0),Ug=new re(0,0,1),Fg={type:"added"},tC={type:"removed"},Go={type:"childadded",child:null},lh={type:"childremoved",child:null};class hi extends Co{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:JR++}),this.uuid=rc(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=hi.DEFAULT_UP.clone();const e=new re,t=new Ao,i=new za,r=new re(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new sn},normalMatrix:{value:new tt}}),this.matrix=new sn,this.matrixWorld=new sn,this.matrixAutoUpdate=hi.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vo.setFromAxisAngle(e,t),this.quaternion.multiply(Vo),this}rotateOnWorldAxis(e,t){return Vo.setFromAxisAngle(e,t),this.quaternion.premultiply(Vo),this}rotateX(e){return this.rotateOnAxis(Ig,e)}rotateY(e){return this.rotateOnAxis(Ng,e)}rotateZ(e){return this.rotateOnAxis(Ug,e)}translateOnAxis(e,t){return Lg.copy(e).applyQuaternion(this.quaternion),this.position.add(Lg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ig,e)}translateY(e){return this.translateOnAxis(Ng,e)}translateZ(e){return this.translateOnAxis(Ug,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Rr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Dc.copy(e):Dc.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ja.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rr.lookAt(ja,Dc,this.up):Rr.lookAt(Dc,ja,this.up),this.quaternion.setFromRotationMatrix(Rr),r&&(Rr.extractRotation(r.matrixWorld),Vo.setFromRotationMatrix(Rr),this.quaternion.premultiply(Vo.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fg),Go.child=e,this.dispatchEvent(Go),Go.child=null):pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tC),lh.child=e,this.dispatchEvent(lh),lh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Rr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Rr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Rr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fg),Go.child=e,this.dispatchEvent(Go),Go.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,e,QR),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,eC,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),f=o(e.skeletons),h=o(e.animations),p=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),h.length>0&&(i.animations=h),p.length>0&&(i.nodes=p)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}hi.DEFAULT_UP=new re(0,1,0);hi.DEFAULT_MATRIX_AUTO_UPDATE=!0;hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Lc extends hi{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nC={type:"move"};class ch{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Lc,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Lc,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new re,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new re),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Lc,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new re,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new re,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const m of e.hand.values()){const _=t.getJointPose(m,i),g=this._getHandJoint(c,m);_!==null&&(g.matrix.fromArray(_.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=_.radius),g.visible=_!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,p=.005;c.inputState.pinching&&f>h+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(nC)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Lc;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const uS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ls={h:0,s:0,l:0},Ic={h:0,s:0,l:0};function uh(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class bt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Oi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ft.workingColorSpace){return this.r=e,this.g=t,this.b=i,ft.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ft.workingColorSpace){if(e=GR(e,1),t=ht(t,0,1),i=ht(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=uh(o,s,e+1/3),this.g=uh(o,s,e),this.b=uh(o,s,e-1/3)}return ft.colorSpaceToWorking(this,r),this}setStyle(e,t=Oi){function i(s){s!==void 0&&parseFloat(s)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Oi){const i=uS[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$r(e.r),this.g=$r(e.g),this.b=$r(e.b),this}copyLinearToSRGB(e){return this.r=Sa(e.r),this.g=Sa(e.g),this.b=Sa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Oi){return ft.workingToColorSpace(Fn.copy(this),e),Math.round(ht(Fn.r*255,0,255))*65536+Math.round(ht(Fn.g*255,0,255))*256+Math.round(ht(Fn.b*255,0,255))}getHexString(e=Oi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.workingToColorSpace(Fn.copy(this),t);const i=Fn.r,r=Fn.g,s=Fn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ft.workingColorSpace){return ft.workingToColorSpace(Fn.copy(this),t),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=Oi){ft.workingToColorSpace(Fn.copy(this),e);const t=Fn.r,i=Fn.g,r=Fn.b;return e!==Oi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(ls),this.setHSL(ls.h+e,ls.s+t,ls.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ls),e.getHSL(Ic);const i=ih(ls.h,Ic.h,t),r=ih(ls.s,Ic.s,t),s=ih(ls.l,Ic.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fn=new bt;bt.NAMES=uS;class iC extends hi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ao,this.environmentIntensity=1,this.environmentRotation=new Ao,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const qi=new re,Cr=new re,fh=new re,Pr=new re,Wo=new re,Xo=new re,Og=new re,hh=new re,dh=new re,ph=new re,mh=new tn,_h=new tn,gh=new tn;class Ki{constructor(e=new re,t=new re,i=new re){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),qi.subVectors(e,t),r.cross(qi);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){qi.subVectors(r,t),Cr.subVectors(i,t),fh.subVectors(e,t);const o=qi.dot(qi),a=qi.dot(Cr),l=qi.dot(fh),c=Cr.dot(Cr),u=Cr.dot(fh),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const f=1/d,h=(c*l-a*u)*f,p=(o*u-a*l)*f;return s.set(1-h-p,p,h)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Pr)===null?!1:Pr.x>=0&&Pr.y>=0&&Pr.x+Pr.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Pr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pr.x),l.addScaledVector(o,Pr.y),l.addScaledVector(a,Pr.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return mh.setScalar(0),_h.setScalar(0),gh.setScalar(0),mh.fromBufferAttribute(e,t),_h.fromBufferAttribute(e,i),gh.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(mh,s.x),o.addScaledVector(_h,s.y),o.addScaledVector(gh,s.z),o}static isFrontFacing(e,t,i,r){return qi.subVectors(i,t),Cr.subVectors(e,t),qi.cross(Cr).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qi.subVectors(this.c,this.b),Cr.subVectors(this.a,this.b),qi.cross(Cr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ki.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ki.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Ki.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Ki.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ki.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Wo.subVectors(r,i),Xo.subVectors(s,i),hh.subVectors(e,i);const l=Wo.dot(hh),c=Xo.dot(hh);if(l<=0&&c<=0)return t.copy(i);dh.subVectors(e,r);const u=Wo.dot(dh),d=Xo.dot(dh);if(u>=0&&d<=u)return t.copy(r);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Wo,o);ph.subVectors(e,s);const h=Wo.dot(ph),p=Xo.dot(ph);if(p>=0&&h<=p)return t.copy(s);const m=h*c-l*p;if(m<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(i).addScaledVector(Xo,a);const _=u*p-h*d;if(_<=0&&d-u>=0&&h-p>=0)return Og.subVectors(s,r),a=(d-u)/(d-u+(h-p)),t.copy(r).addScaledVector(Og,a);const g=1/(_+m+f);return o=m*g,a=f*g,t.copy(i).addScaledVector(Wo,o).addScaledVector(Xo,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class sc{constructor(e=new re(1/0,1/0,1/0),t=new re(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Yi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Yi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Yi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Yi):Yi.fromBufferAttribute(s,o),Yi.applyMatrix4(e.matrixWorld),this.expandByPoint(Yi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Nc.copy(i.boundingBox)),Nc.applyMatrix4(e.matrixWorld),this.union(Nc)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yi),Yi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ka),Uc.subVectors(this.max,Ka),$o.subVectors(e.a,Ka),qo.subVectors(e.b,Ka),Yo.subVectors(e.c,Ka),cs.subVectors(qo,$o),us.subVectors(Yo,qo),$s.subVectors($o,Yo);let t=[0,-cs.z,cs.y,0,-us.z,us.y,0,-$s.z,$s.y,cs.z,0,-cs.x,us.z,0,-us.x,$s.z,0,-$s.x,-cs.y,cs.x,0,-us.y,us.x,0,-$s.y,$s.x,0];return!vh(t,$o,qo,Yo,Uc)||(t=[1,0,0,0,1,0,0,0,1],!vh(t,$o,qo,Yo,Uc))?!1:(Fc.crossVectors(cs,us),t=[Fc.x,Fc.y,Fc.z],vh(t,$o,qo,Yo,Uc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Dr=[new re,new re,new re,new re,new re,new re,new re,new re],Yi=new re,Nc=new sc,$o=new re,qo=new re,Yo=new re,cs=new re,us=new re,$s=new re,Ka=new re,Uc=new re,Fc=new re,qs=new re;function vh(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){qs.fromArray(n,s);const a=r.x*Math.abs(qs.x)+r.y*Math.abs(qs.y)+r.z*Math.abs(qs.z),l=e.dot(qs),c=t.dot(qs),u=i.dot(qs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const ln=new re,Oc=new Et;let rC=0;class un extends Co{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rC++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=bg,this.updateRanges=[],this.gpuType=mr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Oc.fromBufferAttribute(this,t),Oc.applyMatrix3(e),this.setXY(t,Oc.x,Oc.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ln.fromBufferAttribute(this,t),ln.applyMatrix3(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ln.fromBufferAttribute(this,t),ln.applyMatrix4(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ln.fromBufferAttribute(this,t),ln.applyNormalMatrix(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ln.fromBufferAttribute(this,t),ln.transformDirection(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ya(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ii(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ya(t,this.array)),t}setX(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ya(t,this.array)),t}setY(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ya(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ya(t,this.array)),t}setW(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),r=ii(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),r=ii(r,this.array),s=ii(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bg&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class fS extends un{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class hS extends un{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class qr extends un{constructor(e,t,i){super(new Float32Array(e),t,i)}}const sC=new sc,Za=new re,xh=new re;class gf{constructor(e=new re,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):sC.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Za.subVectors(e,this.center);const t=Za.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Za,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Za.copy(e.center).add(xh)),this.expandByPoint(Za.copy(e.center).sub(xh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let oC=0;const Ni=new sn,yh=new hi,jo=new re,gi=new sc,Ja=new sc,bn=new re;class nr extends Co{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:oC++}),this.uuid=rc(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kR(e)?hS:fS)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new tt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ni.makeRotationFromQuaternion(e),this.applyMatrix4(Ni),this}rotateX(e){return Ni.makeRotationX(e),this.applyMatrix4(Ni),this}rotateY(e){return Ni.makeRotationY(e),this.applyMatrix4(Ni),this}rotateZ(e){return Ni.makeRotationZ(e),this.applyMatrix4(Ni),this}translate(e,t,i){return Ni.makeTranslation(e,t,i),this.applyMatrix4(Ni),this}scale(e,t,i){return Ni.makeScale(e,t,i),this.applyMatrix4(Ni),this}lookAt(e){return yh.lookAt(e),yh.updateMatrix(),this.applyMatrix4(yh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(jo).negate(),this.translate(jo.x,jo.y,jo.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new qr(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new re(-1/0,-1/0,-1/0),new re(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];gi.setFromBufferAttribute(s),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gf);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new re,1/0);return}if(e){const i=this.boundingSphere.center;if(gi.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Ja.setFromBufferAttribute(a),this.morphTargetsRelative?(bn.addVectors(gi.min,Ja.min),gi.expandByPoint(bn),bn.addVectors(gi.max,Ja.max),gi.expandByPoint(bn)):(gi.expandByPoint(Ja.min),gi.expandByPoint(Ja.max))}gi.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)bn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(bn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)bn.fromBufferAttribute(a,c),l&&(jo.fromBufferAttribute(e,c),bn.add(jo)),r=Math.max(r,i.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new un(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let S=0;S<i.count;S++)a[S]=new re,l[S]=new re;const c=new re,u=new re,d=new re,f=new Et,h=new Et,p=new Et,m=new re,_=new re;function g(S,E,R){c.fromBufferAttribute(i,S),u.fromBufferAttribute(i,E),d.fromBufferAttribute(i,R),f.fromBufferAttribute(s,S),h.fromBufferAttribute(s,E),p.fromBufferAttribute(s,R),u.sub(c),d.sub(c),h.sub(f),p.sub(f);const D=1/(h.x*p.y-p.x*h.y);isFinite(D)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(d,-h.y).multiplyScalar(D),_.copy(d).multiplyScalar(h.x).addScaledVector(u,-p.x).multiplyScalar(D),a[S].add(m),a[E].add(m),a[R].add(m),l[S].add(_),l[E].add(_),l[R].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let S=0,E=y.length;S<E;++S){const R=y[S],D=R.start,N=R.count;for(let V=D,z=D+N;V<z;V+=3)g(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const x=new re,v=new re,b=new re,T=new re;function A(S){b.fromBufferAttribute(r,S),T.copy(b);const E=a[S];x.copy(E),x.sub(b.multiplyScalar(b.dot(E))).normalize(),v.crossVectors(T,E);const D=v.dot(l[S])<0?-1:1;o.setXYZW(S,x.x,x.y,x.z,D)}for(let S=0,E=y.length;S<E;++S){const R=y[S],D=R.start,N=R.count;for(let V=D,z=D+N;V<z;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new un(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,h=i.count;f<h;f++)i.setXYZ(f,0,0,0);const r=new re,s=new re,o=new re,a=new re,l=new re,c=new re,u=new re,d=new re;if(e)for(let f=0,h=e.count;f<h;f+=3){const p=e.getX(f+0),m=e.getX(f+1),_=e.getX(f+2);r.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),o.fromBufferAttribute(t,_),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,m),c.fromBufferAttribute(i,_),a.add(u),l.add(u),c.add(u),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(m,l.x,l.y,l.z),i.setXYZ(_,c.x,c.y,c.z)}else for(let f=0,h=t.count;f<h;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bn.fromBufferAttribute(e,t),bn.normalize(),e.setXYZ(t,bn.x,bn.y,bn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,f=new c.constructor(l.length*u);let h=0,p=0;for(let m=0,_=l.length;m<_;m++){a.isInterleavedBufferAttribute?h=l[m]*a.data.stride+a.offset:h=l[m]*u;for(let g=0;g<u;g++)f[p++]=c[h++]}return new un(f,u,d)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new nr,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){const f=c[u],h=e(f,i);l.push(h)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let aC=0;class oc extends Co{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:aC++}),this.uuid=rc(),this.name="",this.type="Material",this.blending=ya,this.side=Bs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ad,this.blendDst=Rd,this.blendEquation=to,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=Ia,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ko,this.stencilZFail=ko,this.stencilZPass=ko,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ya&&(i.blending=this.blending),this.side!==Bs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ad&&(i.blendSrc=this.blendSrc),this.blendDst!==Rd&&(i.blendDst=this.blendDst),this.blendEquation!==to&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ia&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mg&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ko&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ko&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ko&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Lr=new re,Sh=new re,Bc=new re,fs=new re,Mh=new re,kc=new re,bh=new re;class Um{constructor(e=new re,t=new re(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Lr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Lr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Lr.copy(this.origin).addScaledVector(this.direction,t),Lr.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Sh.copy(e).add(t).multiplyScalar(.5),Bc.copy(t).sub(e).normalize(),fs.copy(this.origin).sub(Sh);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Bc),a=fs.dot(this.direction),l=-fs.dot(Bc),c=fs.lengthSq(),u=Math.abs(1-o*o);let d,f,h,p;if(u>0)if(d=o*l-a,f=o*a-l,p=s*u,d>=0)if(f>=-p)if(f<=p){const m=1/u;d*=m,f*=m,h=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;else f<=-p?(d=Math.max(0,-(-o*s+a)),f=d>0?-s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c):f<=p?(d=0,f=Math.min(Math.max(-s,-l),s),h=f*(f+2*l)+c):(d=Math.max(0,-(o*s+a)),f=d>0?s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c);else f=o>0?-s:s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Sh).addScaledVector(Bc,f),h}intersectSphere(e,t){Lr.subVectors(e.center,this.origin);const i=Lr.dot(this.direction),r=Lr.dot(Lr)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Lr)!==null}intersectTriangle(e,t,i,r,s){Mh.subVectors(t,e),kc.subVectors(i,e),bh.crossVectors(Mh,kc);let o=this.direction.dot(bh),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;fs.subVectors(this.origin,e);const l=a*this.direction.dot(kc.crossVectors(fs,kc));if(l<0)return null;const c=a*this.direction.dot(Mh.cross(fs));if(c<0||l+c>o)return null;const u=-a*fs.dot(bh);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dS extends oc{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ao,this.combine=$y,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Bg=new sn,Ys=new Um,Hc=new gf,kg=new re,zc=new re,Vc=new re,Gc=new re,Eh=new re,Wc=new re,Hg=new re,Xc=new re;class ns extends hi{constructor(e=new nr,t=new dS){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Wc.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],d=s[l];u!==0&&(Eh.fromBufferAttribute(d,e),o?Wc.addScaledVector(Eh,u):Wc.addScaledVector(Eh.sub(t),u))}t.add(Wc)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Hc.copy(i.boundingSphere),Hc.applyMatrix4(s),Ys.copy(e.ray).recast(e.near),!(Hc.containsPoint(Ys.origin)===!1&&(Ys.intersectSphere(Hc,kg)===null||Ys.origin.distanceToSquared(kg)>(e.far-e.near)**2))&&(Bg.copy(s).invert(),Ys.copy(e.ray).applyMatrix4(Bg),!(i.boundingBox!==null&&Ys.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ys)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,m=f.length;p<m;p++){const _=f[p],g=o[_.materialIndex],y=Math.max(_.start,h.start),x=Math.min(a.count,Math.min(_.start+_.count,h.start+h.count));for(let v=y,b=x;v<b;v+=3){const T=a.getX(v),A=a.getX(v+1),S=a.getX(v+2);r=$c(this,g,e,i,c,u,d,T,A,S),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const p=Math.max(0,h.start),m=Math.min(a.count,h.start+h.count);for(let _=p,g=m;_<g;_+=3){const y=a.getX(_),x=a.getX(_+1),v=a.getX(_+2);r=$c(this,o,e,i,c,u,d,y,x,v),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,m=f.length;p<m;p++){const _=f[p],g=o[_.materialIndex],y=Math.max(_.start,h.start),x=Math.min(l.count,Math.min(_.start+_.count,h.start+h.count));for(let v=y,b=x;v<b;v+=3){const T=v,A=v+1,S=v+2;r=$c(this,g,e,i,c,u,d,T,A,S),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const p=Math.max(0,h.start),m=Math.min(l.count,h.start+h.count);for(let _=p,g=m;_<g;_+=3){const y=_,x=_+1,v=_+2;r=$c(this,o,e,i,c,u,d,y,x,v),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}}}function lC(n,e,t,i,r,s,o,a){let l;if(e.side===fi?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Bs,a),l===null)return null;Xc.copy(a),Xc.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Xc);return c<t.near||c>t.far?null:{distance:c,point:Xc.clone(),object:n}}function $c(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,zc),n.getVertexPosition(l,Vc),n.getVertexPosition(c,Gc);const u=lC(n,e,t,i,zc,Vc,Gc,Hg);if(u){const d=new re;Ki.getBarycoord(Hg,zc,Vc,Gc,d),r&&(u.uv=Ki.getInterpolatedAttribute(r,a,l,c,d,new Et)),s&&(u.uv1=Ki.getInterpolatedAttribute(s,a,l,c,d,new Et)),o&&(u.normal=Ki.getInterpolatedAttribute(o,a,l,c,d,new re),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new re,materialIndex:0};Ki.getNormal(zc,Vc,Gc,f.normal),u.face=f,u.barycoord=d}return u}class cC extends Xn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Dn,u=Dn,d,f){super(null,o,a,l,c,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Th=new re,uC=new re,fC=new tt;class _s{constructor(e=new re(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Th.subVectors(i,t).cross(uC.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(Th),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||fC.getNormalMatrix(e),r=this.coplanarPoint(Th).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const js=new gf,hC=new Et(.5,.5),qc=new re;class pS{constructor(e=new _s,t=new _s,i=new _s,r=new _s,s=new _s,o=new _s){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_r,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],d=s[5],f=s[6],h=s[7],p=s[8],m=s[9],_=s[10],g=s[11],y=s[12],x=s[13],v=s[14],b=s[15];if(r[0].setComponents(c-o,h-u,g-p,b-y).normalize(),r[1].setComponents(c+o,h+u,g+p,b+y).normalize(),r[2].setComponents(c+a,h+d,g+m,b+x).normalize(),r[3].setComponents(c-a,h-d,g-m,b-x).normalize(),i)r[4].setComponents(l,f,_,v).normalize(),r[5].setComponents(c-l,h-f,g-_,b-v).normalize();else if(r[4].setComponents(c-l,h-f,g-_,b-v).normalize(),t===_r)r[5].setComponents(c+l,h+f,g+_,b+v).normalize();else if(t===$u)r[5].setComponents(l,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),js.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),js.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(js)}intersectsSprite(e){js.center.set(0,0,0);const t=hC.distanceTo(e.center);return js.radius=.7071067811865476+t,js.applyMatrix4(e.matrixWorld),this.intersectsSphere(js)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(qc.x=r.normal.x>0?e.max.x:e.min.x,qc.y=r.normal.y>0?e.max.y:e.min.y,qc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(qc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class dC extends oc{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const zg=new sn,_p=new Um,Yc=new gf,jc=new re;class pC extends hi{constructor(e=new nr,t=new dC){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Yc.copy(i.boundingSphere),Yc.applyMatrix4(r),Yc.radius+=s,e.ray.intersectsSphere(Yc)===!1)return;zg.copy(r).invert(),_p.copy(e.ray).applyMatrix4(zg);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),h=Math.min(c.count,o.start+o.count);for(let p=f,m=h;p<m;p++){const _=c.getX(p);jc.fromBufferAttribute(d,_),Vg(jc,_,l,r,e,t,this)}}else{const f=Math.max(0,o.start),h=Math.min(d.count,o.start+o.count);for(let p=f,m=h;p<m;p++)jc.fromBufferAttribute(d,p),Vg(jc,p,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Vg(n,e,t,i,r,s,o){const a=_p.distanceSqToPoint(n);if(a<t){const l=new re;_p.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class mS extends Xn{constructor(e=[],t=To,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gg extends Xn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ua extends Xn{constructor(e,t,i=Er,r,s,o,a=Dn,l=Dn,c,u=ts,d=1){if(u!==ts&&u!==so)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Im(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mC extends Ua{constructor(e,t=Er,i=To,r,s,o=Dn,a=Dn,l,c=ts){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _S extends Xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ac extends nr{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],d=[];let f=0,h=0;p("z","y","x",-1,-1,i,t,e,o,s,0),p("z","y","x",1,-1,i,t,-e,o,s,1),p("x","z","y",1,1,e,i,t,r,o,2),p("x","z","y",1,-1,e,i,-t,r,o,3),p("x","y","z",1,-1,e,t,i,r,s,4),p("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new qr(c,3)),this.setAttribute("normal",new qr(u,3)),this.setAttribute("uv",new qr(d,2));function p(m,_,g,y,x,v,b,T,A,S,E){const R=v/A,D=b/S,N=v/2,V=b/2,z=T/2,O=A+1,F=S+1;let k=0,H=0;const X=new re;for(let L=0;L<F;L++){const ue=L*D-V;for(let de=0;de<O;de++){const ke=de*R-N;X[m]=ke*y,X[_]=ue*x,X[g]=z,c.push(X.x,X.y,X.z),X[m]=0,X[_]=0,X[g]=T>0?1:-1,u.push(X.x,X.y,X.z),d.push(de/A),d.push(1-L/S),k+=1}}for(let L=0;L<S;L++)for(let ue=0;ue<A;ue++){const de=f+ue+O*L,ke=f+ue+O*(L+1),ze=f+(ue+1)+O*(L+1),Ne=f+(ue+1)+O*L;l.push(de,ke,Ne),l.push(ke,ze,Ne),H+=6}a.addGroup(h,H,E),h+=H,f+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ac(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class vf extends nr{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,d=e/a,f=t/l,h=[],p=[],m=[],_=[];for(let g=0;g<u;g++){const y=g*f-o;for(let x=0;x<c;x++){const v=x*d-s;p.push(v,-y,0),m.push(0,0,1),_.push(x/a),_.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<a;y++){const x=y+c*g,v=y+c*(g+1),b=y+1+c*(g+1),T=y+1+c*g;h.push(x,v,T),h.push(v,b,T)}this.setIndex(h),this.setAttribute("position",new qr(p,3)),this.setAttribute("normal",new qr(m,3)),this.setAttribute("uv",new qr(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vf(e.width,e.height,e.widthSegments,e.heightSegments)}}function Fa(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(Wg(r))r.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(Wg(r[0])){const s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function jn(n){const e={};for(let t=0;t<n.length;t++){const i=Fa(n[t]);for(const r in i)e[r]=i[r]}return e}function Wg(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function _C(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function gS(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}const gC={clone:Fa,merge:jn};var vC=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xC=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class tr extends oc{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vC,this.fragmentShader=xC,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fa(e.uniforms),this.uniformsGroups=_C(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class yC extends tr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class SC extends oc{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=PR,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class MC extends oc{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Kc=new re,Zc=new za,rr=new re;class vS extends hi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new sn,this.projectionMatrix=new sn,this.projectionMatrixInverse=new sn,this.coordinateSystem=_r,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Kc,Zc,rr),rr.x===1&&rr.y===1&&rr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kc,Zc,rr.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Kc,Zc,rr),rr.x===1&&rr.y===1&&rr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kc,Zc,rr.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const hs=new re,Xg=new Et,$g=new Et;class Hi extends vS{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mp*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(nh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mp*2*Math.atan(Math.tan(nh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){hs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hs.x,hs.y).multiplyScalar(-e/hs.z),hs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hs.x,hs.y).multiplyScalar(-e/hs.z)}getViewSize(e,t){return this.getViewBounds(e,Xg,$g),t.subVectors($g,Xg)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(nh*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class xS extends vS{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ko=-90,Zo=1;class bC extends hi{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Hi(Ko,Zo,e,t);r.layers=this.layers,this.add(r);const s=new Hi(Ko,Zo,e,t);s.layers=this.layers,this.add(s);const o=new Hi(Ko,Zo,e,t);o.layers=this.layers,this.add(o);const a=new Hi(Ko,Zo,e,t);a.layers=this.layers,this.add(a);const l=new Hi(Ko,Zo,e,t);l.layers=this.layers,this.add(l);const c=new Hi(Ko,Zo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===_r)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===$u)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const m=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let _=!1;e.isWebGLRenderer===!0?_=e.state.buffers.depth.getReversed():_=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=m,e.setRenderTarget(i,5,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class EC extends Hi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const qg=new sn;class TC{constructor(e,t,i=0,r=1/0){this.ray=new Um(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Nm,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):pt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return qg.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qg),this}intersectObject(e,t=!0,i=[]){return gp(e,this,i,t),i.sort(Yg),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)gp(e[r],this,i,t);return i.sort(Yg),i}}function Yg(n,e){return n.distance-e.distance}function gp(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)gp(s[o],e,t,!0)}}class wC{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Je("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Hm=class Hm{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};Hm.prototype.isMatrix2=!0;let jg=Hm;function Kg(n,e,t,i){const r=AC(i);switch(t){case sS:return n*e;case aS:return n*e/r.components*r.byteLength;case Rm:return n*e/r.components*r.byteLength;case wo:return n*e*2/r.components*r.byteLength;case Cm:return n*e*2/r.components*r.byteLength;case oS:return n*e*3/r.components*r.byteLength;case Ji:return n*e*4/r.components*r.byteLength;case Pm:return n*e*4/r.components*r.byteLength;case hu:case du:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pu:case mu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case kd:case zd:return Math.max(n,16)*Math.max(e,8)/4;case Bd:case Hd:return Math.max(n,8)*Math.max(e,8)/2;case Vd:case Gd:case Xd:case $d:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wd:case Vu:case qd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case jd:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Kd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Jd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Qd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ep:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case tp:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case np:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ip:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case rp:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case sp:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case op:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ap:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case lp:case cp:case up:return Math.ceil(n/4)*Math.ceil(e/4)*16;case fp:case hp:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Gu:case dp:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function AC(n){switch(n){case zi:case tS:return{byteLength:1,components:1};case Yl:case nS:case es:return{byteLength:2,components:1};case wm:case Am:return{byteLength:2,components:4};case Er:case Tm:case mr:return{byteLength:4,components:1};case iS:case rS:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Em}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Em);function yS(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function RC(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,u),a.onUploadCallback();let h;if(c instanceof Float32Array)h=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?h=n.HALF_FLOAT:h=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=n.SHORT;else if(c instanceof Uint32Array)h=n.UNSIGNED_INT;else if(c instanceof Int32Array)h=n.INT;else if(c instanceof Int8Array)h=n.BYTE;else if(c instanceof Uint8Array)h=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((h,p)=>h.start-p.start);let f=0;for(let h=1;h<d.length;h++){const p=d[f],m=d[h];m.start<=p.start+p.count+1?p.count=Math.max(p.count,m.start+m.count-p.start):(++f,d[f]=m)}d.length=f+1;for(let h=0,p=d.length;h<p;h++){const m=d[h];n.bufferSubData(c,m.start*u.BYTES_PER_ELEMENT,u,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var CC=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,PC=`#ifdef USE_ALPHAHASH
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
#endif`,DC=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,LC=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IC=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,NC=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,UC=`#ifdef USE_AOMAP
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
#endif`,FC=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,OC=`#ifdef USE_BATCHING
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
#endif`,BC=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kC=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,HC=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zC=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,VC=`#ifdef USE_IRIDESCENCE
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
#endif`,GC=`#ifdef USE_BUMPMAP
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
#endif`,WC=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,XC=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$C=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qC=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,YC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,jC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,KC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ZC=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,JC=`#define PI 3.141592653589793
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
} // validated`,QC=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,eP=`vec3 transformedNormal = objectNormal;
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
#endif`,tP=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nP=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,iP=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rP=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sP="gl_FragColor = linearToOutputTexel( gl_FragColor );",oP=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,aP=`#ifdef USE_ENVMAP
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
#endif`,lP=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,cP=`#ifdef USE_ENVMAP
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
#endif`,uP=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fP=`#ifdef USE_ENVMAP
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
#endif`,hP=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dP=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pP=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mP=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_P=`#ifdef USE_GRADIENTMAP
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
}`,gP=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vP=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xP=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yP=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,SP=`#ifdef USE_ENVMAP
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
#endif`,MP=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bP=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,EP=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,TP=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wP=`PhysicalMaterial material;
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
#endif`,AP=`uniform sampler2D dfgLUT;
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
}`,RP=`
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
#endif`,CP=`#if defined( RE_IndirectDiffuse )
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
#endif`,PP=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,DP=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,LP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,IP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,NP=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,UP=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,FP=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,OP=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,BP=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kP=`#if defined( USE_POINTS_UV )
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
#endif`,HP=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zP=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,VP=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,GP=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,WP=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,XP=`#ifdef USE_MORPHTARGETS
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
#endif`,$P=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qP=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,YP=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,jP=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,KP=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZP=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,JP=`#ifdef USE_NORMALMAP
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
#endif`,QP=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eD=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tD=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nD=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iD=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rD=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sD=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oD=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,aD=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lD=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cD=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uD=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fD=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hD=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dD=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pD=`float getShadowMask() {
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
}`,mD=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_D=`#ifdef USE_SKINNING
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
#endif`,gD=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vD=`#ifdef USE_SKINNING
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
#endif`,xD=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yD=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SD=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,MD=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bD=`#ifdef USE_TRANSMISSION
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
#endif`,ED=`#ifdef USE_TRANSMISSION
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
#endif`,TD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RD=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const CD=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PD=`uniform sampler2D t2D;
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
}`,DD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LD=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ID=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ND=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UD=`#include <common>
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
}`,FD=`#if DEPTH_PACKING == 3200
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
}`,OD=`#define DISTANCE
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
}`,BD=`#define DISTANCE
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
}`,kD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,HD=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zD=`uniform float scale;
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
}`,VD=`uniform vec3 diffuse;
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
}`,GD=`#include <common>
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
}`,WD=`uniform vec3 diffuse;
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
}`,XD=`#define LAMBERT
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
}`,$D=`#define LAMBERT
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
}`,qD=`#define MATCAP
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
}`,YD=`#define MATCAP
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
}`,jD=`#define NORMAL
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
}`,KD=`#define NORMAL
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
}`,ZD=`#define PHONG
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
}`,JD=`#define PHONG
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
}`,QD=`#define STANDARD
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
}`,e3=`#define STANDARD
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
}`,t3=`#define TOON
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
}`,n3=`#define TOON
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
}`,i3=`uniform float size;
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
}`,r3=`uniform vec3 diffuse;
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
}`,s3=`#include <common>
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
}`,o3=`uniform vec3 color;
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
}`,a3=`uniform float rotation;
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
}`,l3=`uniform vec3 diffuse;
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
}`,it={alphahash_fragment:CC,alphahash_pars_fragment:PC,alphamap_fragment:DC,alphamap_pars_fragment:LC,alphatest_fragment:IC,alphatest_pars_fragment:NC,aomap_fragment:UC,aomap_pars_fragment:FC,batching_pars_vertex:OC,batching_vertex:BC,begin_vertex:kC,beginnormal_vertex:HC,bsdfs:zC,iridescence_fragment:VC,bumpmap_pars_fragment:GC,clipping_planes_fragment:WC,clipping_planes_pars_fragment:XC,clipping_planes_pars_vertex:$C,clipping_planes_vertex:qC,color_fragment:YC,color_pars_fragment:jC,color_pars_vertex:KC,color_vertex:ZC,common:JC,cube_uv_reflection_fragment:QC,defaultnormal_vertex:eP,displacementmap_pars_vertex:tP,displacementmap_vertex:nP,emissivemap_fragment:iP,emissivemap_pars_fragment:rP,colorspace_fragment:sP,colorspace_pars_fragment:oP,envmap_fragment:aP,envmap_common_pars_fragment:lP,envmap_pars_fragment:cP,envmap_pars_vertex:uP,envmap_physical_pars_fragment:SP,envmap_vertex:fP,fog_vertex:hP,fog_pars_vertex:dP,fog_fragment:pP,fog_pars_fragment:mP,gradientmap_pars_fragment:_P,lightmap_pars_fragment:gP,lights_lambert_fragment:vP,lights_lambert_pars_fragment:xP,lights_pars_begin:yP,lights_toon_fragment:MP,lights_toon_pars_fragment:bP,lights_phong_fragment:EP,lights_phong_pars_fragment:TP,lights_physical_fragment:wP,lights_physical_pars_fragment:AP,lights_fragment_begin:RP,lights_fragment_maps:CP,lights_fragment_end:PP,lightprobes_pars_fragment:DP,logdepthbuf_fragment:LP,logdepthbuf_pars_fragment:IP,logdepthbuf_pars_vertex:NP,logdepthbuf_vertex:UP,map_fragment:FP,map_pars_fragment:OP,map_particle_fragment:BP,map_particle_pars_fragment:kP,metalnessmap_fragment:HP,metalnessmap_pars_fragment:zP,morphinstance_vertex:VP,morphcolor_vertex:GP,morphnormal_vertex:WP,morphtarget_pars_vertex:XP,morphtarget_vertex:$P,normal_fragment_begin:qP,normal_fragment_maps:YP,normal_pars_fragment:jP,normal_pars_vertex:KP,normal_vertex:ZP,normalmap_pars_fragment:JP,clearcoat_normal_fragment_begin:QP,clearcoat_normal_fragment_maps:eD,clearcoat_pars_fragment:tD,iridescence_pars_fragment:nD,opaque_fragment:iD,packing:rD,premultiplied_alpha_fragment:sD,project_vertex:oD,dithering_fragment:aD,dithering_pars_fragment:lD,roughnessmap_fragment:cD,roughnessmap_pars_fragment:uD,shadowmap_pars_fragment:fD,shadowmap_pars_vertex:hD,shadowmap_vertex:dD,shadowmask_pars_fragment:pD,skinbase_vertex:mD,skinning_pars_vertex:_D,skinning_vertex:gD,skinnormal_vertex:vD,specularmap_fragment:xD,specularmap_pars_fragment:yD,tonemapping_fragment:SD,tonemapping_pars_fragment:MD,transmission_fragment:bD,transmission_pars_fragment:ED,uv_pars_fragment:TD,uv_pars_vertex:wD,uv_vertex:AD,worldpos_vertex:RD,background_vert:CD,background_frag:PD,backgroundCube_vert:DD,backgroundCube_frag:LD,cube_vert:ID,cube_frag:ND,depth_vert:UD,depth_frag:FD,distance_vert:OD,distance_frag:BD,equirect_vert:kD,equirect_frag:HD,linedashed_vert:zD,linedashed_frag:VD,meshbasic_vert:GD,meshbasic_frag:WD,meshlambert_vert:XD,meshlambert_frag:$D,meshmatcap_vert:qD,meshmatcap_frag:YD,meshnormal_vert:jD,meshnormal_frag:KD,meshphong_vert:ZD,meshphong_frag:JD,meshphysical_vert:QD,meshphysical_frag:e3,meshtoon_vert:t3,meshtoon_frag:n3,points_vert:i3,points_frag:r3,shadow_vert:s3,shadow_frag:o3,sprite_vert:a3,sprite_frag:l3},Fe={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new Et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new re},probesMax:{value:new re},probesResolution:{value:new re}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},fr={basic:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)},envMapIntensity:{value:1}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:jn([Fe.common,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.roughnessmap,Fe.metalnessmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:jn([Fe.common,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.gradientmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:jn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:jn([Fe.points,Fe.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:jn([Fe.common,Fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:jn([Fe.common,Fe.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:jn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:jn([Fe.sprite,Fe.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distance:{uniforms:jn([Fe.common,Fe.displacementmap,{referencePosition:{value:new re},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distance_vert,fragmentShader:it.distance_frag},shadow:{uniforms:jn([Fe.lights,Fe.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};fr.physical={uniforms:jn([fr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new Et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new Et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new Et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};const Jc={r:0,b:0,g:0},c3=new sn,SS=new tt;SS.set(-1,0,0,0,1,0,0,0,1);function u3(n,e,t,i,r,s){const o=new bt(0);let a=r===!0?0:1,l,c,u=null,d=0,f=null;function h(y){let x=y.isScene===!0?y.background:null;if(x&&x.isTexture){const v=y.backgroundBlurriness>0;x=e.get(x,v)}return x}function p(y){let x=!1;const v=h(y);v===null?_(o,a):v&&v.isColor&&(_(v,1),x=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||x)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,x){const v=h(x);v&&(v.isCubeTexture||v.mapping===_f)?(c===void 0&&(c=new ns(new ac(1,1,1),new tr({name:"BackgroundCubeMaterial",uniforms:Fa(fr.backgroundCube.uniforms),vertexShader:fr.backgroundCube.vertexShader,fragmentShader:fr.backgroundCube.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(c3.makeRotationFromEuler(x.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(SS),c.material.toneMapped=ft.getTransfer(v.colorSpace)!==At,(u!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ns(new vf(2,2),new tr({name:"BackgroundMaterial",uniforms:Fa(fr.background.uniforms),vertexShader:fr.background.vertexShader,fragmentShader:fr.background.fragmentShader,side:Bs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ft.getTransfer(v.colorSpace)!==At,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function _(y,x){y.getRGB(Jc,gS(n)),t.buffers.color.setClear(Jc.r,Jc.g,Jc.b,x,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,x=1){o.set(y),a=x,_(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,_(o,a)},render:p,addToRenderList:m,dispose:g}}function f3(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(D,N,V,z,O){let F=!1;const k=d(D,z,V,N);s!==k&&(s=k,c(s.object)),F=h(D,z,V,O),F&&p(D,z,V,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,v(D,N,V,z),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function u(D){return n.deleteVertexArray(D)}function d(D,N,V,z){const O=z.wireframe===!0;let F=i[N.id];F===void 0&&(F={},i[N.id]=F);const k=D.isInstancedMesh===!0?D.id:0;let H=F[k];H===void 0&&(H={},F[k]=H);let X=H[V.id];X===void 0&&(X={},H[V.id]=X);let L=X[O];return L===void 0&&(L=f(l()),X[O]=L),L}function f(D){const N=[],V=[],z=[];for(let O=0;O<t;O++)N[O]=0,V[O]=0,z[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:V,attributeDivisors:z,object:D,attributes:{},index:null}}function h(D,N,V,z){const O=s.attributes,F=N.attributes;let k=0;const H=V.getAttributes();for(const X in H)if(H[X].location>=0){const ue=O[X];let de=F[X];if(de===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(de=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(de=D.instanceColor)),ue===void 0||ue.attribute!==de||de&&ue.data!==de.data)return!0;k++}return s.attributesNum!==k||s.index!==z}function p(D,N,V,z){const O={},F=N.attributes;let k=0;const H=V.getAttributes();for(const X in H)if(H[X].location>=0){let ue=F[X];ue===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(ue=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(ue=D.instanceColor));const de={};de.attribute=ue,ue&&ue.data&&(de.data=ue.data),O[X]=de,k++}s.attributes=O,s.attributesNum=k,s.index=z}function m(){const D=s.newAttributes;for(let N=0,V=D.length;N<V;N++)D[N]=0}function _(D){g(D,0)}function g(D,N){const V=s.newAttributes,z=s.enabledAttributes,O=s.attributeDivisors;V[D]=1,z[D]===0&&(n.enableVertexAttribArray(D),z[D]=1),O[D]!==N&&(n.vertexAttribDivisor(D,N),O[D]=N)}function y(){const D=s.newAttributes,N=s.enabledAttributes;for(let V=0,z=N.length;V<z;V++)N[V]!==D[V]&&(n.disableVertexAttribArray(V),N[V]=0)}function x(D,N,V,z,O,F,k){k===!0?n.vertexAttribIPointer(D,N,V,O,F):n.vertexAttribPointer(D,N,V,z,O,F)}function v(D,N,V,z){m();const O=z.attributes,F=V.getAttributes(),k=N.defaultAttributeValues;for(const H in F){const X=F[H];if(X.location>=0){let L=O[H];if(L===void 0&&(H==="instanceMatrix"&&D.instanceMatrix&&(L=D.instanceMatrix),H==="instanceColor"&&D.instanceColor&&(L=D.instanceColor)),L!==void 0){const ue=L.normalized,de=L.itemSize,ke=e.get(L);if(ke===void 0)continue;const ze=ke.buffer,Ne=ke.type,ne=ke.bytesPerElement,xe=Ne===n.INT||Ne===n.UNSIGNED_INT||L.gpuType===Tm;if(L.isInterleavedBufferAttribute){const _e=L.data,Le=_e.stride,we=L.offset;if(_e.isInstancedInterleavedBuffer){for(let Te=0;Te<X.locationSize;Te++)g(X.location+Te,_e.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let Te=0;Te<X.locationSize;Te++)_(X.location+Te);n.bindBuffer(n.ARRAY_BUFFER,ze);for(let Te=0;Te<X.locationSize;Te++)x(X.location+Te,de/X.locationSize,Ne,ue,Le*ne,(we+de/X.locationSize*Te)*ne,xe)}else{if(L.isInstancedBufferAttribute){for(let _e=0;_e<X.locationSize;_e++)g(X.location+_e,L.meshPerAttribute);D.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=L.meshPerAttribute*L.count)}else for(let _e=0;_e<X.locationSize;_e++)_(X.location+_e);n.bindBuffer(n.ARRAY_BUFFER,ze);for(let _e=0;_e<X.locationSize;_e++)x(X.location+_e,de/X.locationSize,Ne,ue,de*ne,de/X.locationSize*_e*ne,xe)}}else if(k!==void 0){const ue=k[H];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(X.location,ue);break;case 3:n.vertexAttrib3fv(X.location,ue);break;case 4:n.vertexAttrib4fv(X.location,ue);break;default:n.vertexAttrib1fv(X.location,ue)}}}}y()}function b(){E();for(const D in i){const N=i[D];for(const V in N){const z=N[V];for(const O in z){const F=z[O];for(const k in F)u(F[k].object),delete F[k];delete z[O]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const N=i[D.id];for(const V in N){const z=N[V];for(const O in z){const F=z[O];for(const k in F)u(F[k].object),delete F[k];delete z[O]}}delete i[D.id]}function A(D){for(const N in i){const V=i[N];for(const z in V){const O=V[z];if(O[D.id]===void 0)continue;const F=O[D.id];for(const k in F)u(F[k].object),delete F[k];delete O[D.id]}}}function S(D){for(const N in i){const V=i[N],z=D.isInstancedMesh===!0?D.id:0,O=V[z];if(O!==void 0){for(const F in O){const k=O[F];for(const H in k)u(k[H].object),delete k[H];delete O[F]}delete V[z],Object.keys(V).length===0&&delete i[N]}}}function E(){R(),o=!0,s!==r&&(s=r,c(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:E,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:S,releaseStatesOfProgram:A,initAttributes:m,enableAttribute:_,disableUnusedAttributes:y}}function h3(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let f=0;for(let h=0;h<u;h++)f+=c[h];t.update(f,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function d3(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Ji&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const S=A===es&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==zi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==mr&&!S)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Je("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,maxSamples:b,samples:T}}function p3(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new _s,a=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||i!==0||r;return r=f,i=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){const p=d.clippingPlanes,m=d.clipIntersection,_=d.clipShadows,g=n.get(d);if(!r||p===null||p.length===0||s&&!_)s?u(null):c();else{const y=s?0:i,x=y*4;let v=g.clippingState||null;l.value=v,v=u(p,f,x,h);for(let b=0;b!==x;++b)v[b]=t[b];g.clippingState=v,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,h,p){const m=d!==null?d.length:0;let _=null;if(m!==0){if(_=l.value,p!==!0||_===null){const g=h+m*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(_===null||_.length<g)&&(_=new Float32Array(g));for(let x=0,v=h;x!==m;++x,v+=4)o.copy(d[x]).applyMatrix4(y,a),o.normal.toArray(_,v),_[v+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,_}}const As=4,Zg=[.125,.215,.35,.446,.526,.582],no=20,m3=256,Qa=new xS,Jg=new bt;let wh=null,Ah=0,Rh=0,Ch=!1;const _3=new re;class Qg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=_3}=s;wh=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Rh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=n0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=t0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(wh,Ah,Rh),this._renderer.xr.enabled=Ch,e.scissorTest=!1,Jo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===To||e.mapping===Na?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wh=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Rh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:es,format:Ji,colorSpace:Wu,depthBuffer:!1},r=e0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=e0(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=g3(s)),this._blurMaterial=x3(s,e,t),this._ggxMaterial=v3(s,e,t)}return r}_compileMaterial(e){const t=new ns(new nr,e);this._renderer.compile(t,Qa)}_sceneToCubeUV(e,t,i,r,s){const l=new Hi(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(Jg),d.toneMapping=xr,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ns(new ac,new dS({name:"PMREM.Background",side:fi,depthWrite:!1,depthTest:!1})));const m=this._backgroundBox,_=m.material;let g=!1;const y=e.background;y?y.isColor&&(_.color.copy(y),e.background=null,g=!0):(_.color.copy(Jg),g=!0);for(let x=0;x<6;x++){const v=x%3;v===0?(l.up.set(0,c[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[x],s.y,s.z)):v===1?(l.up.set(0,0,c[x]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[x],s.z)):(l.up.set(0,c[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[x]));const b=this._cubeSize;Jo(r,v*b,x>2?b:0,b,b),d.setRenderTarget(r),g&&d.render(m,l),d.render(e,l)}d.toneMapping=h,d.autoClear=f,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===To||e.mapping===Na;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=n0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=t0());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Jo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Qa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=0+c*1.25,h=d*f,{_lodMax:p}=this,m=this._sizeLods[i],_=3*m*(i>p-As?i-p+As:0),g=4*(this._cubeSize-m);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=p-t,Jo(s,_,g,3*m,2*m),r.setRenderTarget(s),r.render(a,Qa),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-i,Jo(e,_,g,3*m,2*m),r.setRenderTarget(e),r.render(a,Qa)}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&pt("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[r];d.material=c;const f=c.uniforms,h=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*no-1),m=s/p,_=isFinite(s)?1+Math.floor(u*m):no;_>no&&Je(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${no}`);const g=[];let y=0;for(let A=0;A<no;++A){const S=A/m,E=Math.exp(-S*S/2);g.push(E),A===0?y+=E:A<_&&(y+=2*E)}for(let A=0;A<g.length;A++)g[A]=g[A]/y;f.envMap.value=e.texture,f.samples.value=_,f.weights.value=g,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=p,f.mipInt.value=x-i;const v=this._sizeLods[r],b=3*v*(r>x-As?r-x+As:0),T=4*(this._cubeSize-v);Jo(t,b,T,3*v,2*v),l.setRenderTarget(t),l.render(d,Qa)}}function g3(n){const e=[],t=[],i=[];let r=n;const s=n-As+1+Zg.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>n-As?l=Zg[o-n+As-1]:o===0&&(l=0),t.push(l);const c=1/(a-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,p=6,m=3,_=2,g=1,y=new Float32Array(m*p*h),x=new Float32Array(_*p*h),v=new Float32Array(g*p*h);for(let T=0;T<h;T++){const A=T%3*2/3-1,S=T>2?0:-1,E=[A,S,0,A+2/3,S,0,A+2/3,S+1,0,A,S,0,A+2/3,S+1,0,A,S+1,0];y.set(E,m*p*T),x.set(f,_*p*T);const R=[T,T,T,T,T,T];v.set(R,g*p*T)}const b=new nr;b.setAttribute("position",new un(y,m)),b.setAttribute("uv",new un(x,_)),b.setAttribute("faceIndex",new un(v,g)),i.push(new ns(b,null)),r>As&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function e0(n,e,t){const i=new yr(n,e,t);return i.texture.mapping=_f,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Jo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function v3(n,e,t){return new tr({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:m3,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xf(),fragmentShader:`

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
		`,blending:Xr,depthTest:!1,depthWrite:!1})}function x3(n,e,t){const i=new Float32Array(no),r=new re(0,1,0);return new tr({name:"SphericalGaussianBlur",defines:{n:no,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:xf(),fragmentShader:`

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
		`,blending:Xr,depthTest:!1,depthWrite:!1})}function t0(){return new tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xf(),fragmentShader:`

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
		`,blending:Xr,depthTest:!1,depthWrite:!1})}function n0(){return new tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xr,depthTest:!1,depthWrite:!1})}function xf(){return`

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
	`}class MS extends yr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new mS(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ac(5,5,5),s=new tr({name:"CubemapFromEquirect",uniforms:Fa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:fi,blending:Xr});s.uniforms.tEquirect.value=t;const o=new ns(r,s),a=t.minFilter;return t.minFilter===ws&&(t.minFilter=gn),new bC(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}function y3(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,h=!1){return f==null?null:h?o(f):s(f)}function s(f){if(f&&f.isTexture){const h=f.mapping;if(h===Qf||h===eh)if(e.has(f)){const p=e.get(f).texture;return a(p,f.mapping)}else{const p=f.image;if(p&&p.height>0){const m=new MS(p.height);return m.fromEquirectangularTexture(n,f),e.set(f,m),f.addEventListener("dispose",c),a(m.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const h=f.mapping,p=h===Qf||h===eh,m=h===To||h===Na;if(p||m){let _=t.get(f);const g=_!==void 0?_.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return i===null&&(i=new Qg(n)),_=p?i.fromEquirectangular(f,_):i.fromCubemap(f,_),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),_.texture;if(_!==void 0)return _.texture;{const y=f.image;return p&&y&&y.height>0||m&&y&&l(y)?(i===null&&(i=new Qg(n)),_=p?i.fromEquirectangular(f):i.fromCubemap(f),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),f.addEventListener("dispose",u),_.texture):null}}}return f}function a(f,h){return h===Qf?f.mapping=To:h===eh&&(f.mapping=Na),f}function l(f){let h=0;const p=6;for(let m=0;m<p;m++)f[m]!==void 0&&h++;return h===p}function c(f){const h=f.target;h.removeEventListener("dispose",c);const p=e.get(h);p!==void 0&&(e.delete(h),p.dispose())}function u(f){const h=f.target;h.removeEventListener("dispose",u);const p=t.get(h);p!==void 0&&(t.delete(h),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function S3(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&pp("WebGLRenderer: "+i+" extension not supported."),r}}}function M3(n,e,t,i){const r={},s=new WeakMap;function o(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete r[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(d,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const h in f)e.update(f[h],n.ARRAY_BUFFER)}function c(d){const f=[],h=d.index,p=d.attributes.position;let m=0;if(p===void 0)return;if(h!==null){const y=h.array;m=h.version;for(let x=0,v=y.length;x<v;x+=3){const b=y[x+0],T=y[x+1],A=y[x+2];f.push(b,T,T,A,A,b)}}else{const y=p.array;m=p.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const b=x+0,T=x+1,A=x+2;f.push(b,T,T,A,A,b)}}const _=new(p.count>=65535?hS:fS)(f,1);_.version=m;const g=s.get(d);g&&e.remove(g),s.set(d,_)}function u(d){const f=s.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function b3(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function c(d,f,h){h!==0&&(n.drawElementsInstanced(i,f,s,d*o,h),t.update(f,i,h))}function u(d,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,h);let m=0;for(let _=0;_<h;_++)m+=f[_];t.update(m,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function E3(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:pt("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function T3(n,e,t){const i=new WeakMap,r=new tn;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==d){let E=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const h=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let x=0;h===!0&&(x=1),p===!0&&(x=2),m===!0&&(x=3);let v=a.attributes.position.count*x,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*b*4*d),A=new cS(T,v,b,d);A.type=mr,A.needsUpdate=!0;const S=x*4;for(let R=0;R<d;R++){const D=_[R],N=g[R],V=y[R],z=v*b*4*R;for(let O=0;O<D.count;O++){const F=O*S;h===!0&&(r.fromBufferAttribute(D,O),T[z+F+0]=r.x,T[z+F+1]=r.y,T[z+F+2]=r.z,T[z+F+3]=0),p===!0&&(r.fromBufferAttribute(N,O),T[z+F+4]=r.x,T[z+F+5]=r.y,T[z+F+6]=r.z,T[z+F+7]=0),m===!0&&(r.fromBufferAttribute(V,O),T[z+F+8]=r.x,T[z+F+9]=r.y,T[z+F+10]=r.z,T[z+F+11]=V.itemSize===4?r.w:1)}}f={count:d,texture:A,size:new Et(v,b)},i.set(a,f),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let h=0;for(let m=0;m<c.length;m++)h+=c[m];const p=a.morphTargetsRelative?1:1-h;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function w3(n,e,t,i,r){let s=new WeakMap;function o(c){const u=r.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==u&&(h.update(),s.set(h,u))}return f}function a(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}const A3={[qy]:"LINEAR_TONE_MAPPING",[Yy]:"REINHARD_TONE_MAPPING",[jy]:"CINEON_TONE_MAPPING",[Ky]:"ACES_FILMIC_TONE_MAPPING",[Jy]:"AGX_TONE_MAPPING",[Qy]:"NEUTRAL_TONE_MAPPING",[Zy]:"CUSTOM_TONE_MAPPING"};function R3(n,e,t,i,r){const s=new yr(e,t,{type:n,depthBuffer:i,stencilBuffer:r,depthTexture:i?new Ua(e,t):void 0}),o=new yr(e,t,{type:es,depthBuffer:!1,stencilBuffer:!1}),a=new nr;a.setAttribute("position",new qr([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new qr([0,2,0,0,2,0],2));const l=new yC({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ns(a,l),u=new xS(-1,1,1,-1,0,1);let d=null,f=null,h=!1,p,m=null,_=[],g=!1;this.setSize=function(y,x){s.setSize(y,x),o.setSize(y,x);for(let v=0;v<_.length;v++){const b=_[v];b.setSize&&b.setSize(y,x)}},this.setEffects=function(y){_=y,g=_.length>0&&_[0].isRenderPass===!0;const x=s.width,v=s.height;for(let b=0;b<_.length;b++){const T=_[b];T.setSize&&T.setSize(x,v)}},this.begin=function(y,x){if(h||y.toneMapping===xr&&_.length===0)return!1;if(m=x,x!==null){const v=x.width,b=x.height;(s.width!==v||s.height!==b)&&this.setSize(v,b)}return g===!1&&y.setRenderTarget(s),p=y.toneMapping,y.toneMapping=xr,!0},this.hasRenderPass=function(){return g},this.end=function(y,x){y.toneMapping=p,h=!0;let v=s,b=o;for(let T=0;T<_.length;T++){const A=_[T];if(A.enabled!==!1&&(A.render(y,b,v,x),A.needsSwap!==!1)){const S=v;v=b,b=S}}if(d!==y.outputColorSpace||f!==y.toneMapping){d=y.outputColorSpace,f=y.toneMapping,l.defines={},ft.getTransfer(d)===At&&(l.defines.SRGB_TRANSFER="");const T=A3[f];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=v.texture,y.setRenderTarget(m),y.render(c,u),m=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const bS=new Xn,vp=new Ua(1,1),ES=new cS,TS=new jR,wS=new mS,i0=[],r0=[],s0=new Float32Array(16),o0=new Float32Array(9),a0=new Float32Array(4);function Va(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=i0[r];if(s===void 0&&(s=new Float32Array(r),i0[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function vn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function xn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function yf(n,e){let t=r0[e];t===void 0&&(t=new Int32Array(e),r0[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function C3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function P3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2fv(this.addr,e),xn(t,e)}}function D3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vn(t,e))return;n.uniform3fv(this.addr,e),xn(t,e)}}function L3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4fv(this.addr,e),xn(t,e)}}function I3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),xn(t,e)}else{if(vn(t,i))return;a0.set(i),n.uniformMatrix2fv(this.addr,!1,a0),xn(t,i)}}function N3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),xn(t,e)}else{if(vn(t,i))return;o0.set(i),n.uniformMatrix3fv(this.addr,!1,o0),xn(t,i)}}function U3(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),xn(t,e)}else{if(vn(t,i))return;s0.set(i),n.uniformMatrix4fv(this.addr,!1,s0),xn(t,i)}}function F3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function O3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2iv(this.addr,e),xn(t,e)}}function B3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;n.uniform3iv(this.addr,e),xn(t,e)}}function k3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4iv(this.addr,e),xn(t,e)}}function H3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function z3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2uiv(this.addr,e),xn(t,e)}}function V3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;n.uniform3uiv(this.addr,e),xn(t,e)}}function G3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4uiv(this.addr,e),xn(t,e)}}function W3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(vp.compareFunction=t.isReversedDepthBuffer()?Lm:Dm,s=vp):s=bS,t.setTexture2D(e||s,r)}function X3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||TS,r)}function $3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||wS,r)}function q3(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||ES,r)}function Y3(n){switch(n){case 5126:return C3;case 35664:return P3;case 35665:return D3;case 35666:return L3;case 35674:return I3;case 35675:return N3;case 35676:return U3;case 5124:case 35670:return F3;case 35667:case 35671:return O3;case 35668:case 35672:return B3;case 35669:case 35673:return k3;case 5125:return H3;case 36294:return z3;case 36295:return V3;case 36296:return G3;case 35678:case 36198:case 36298:case 36306:case 35682:return W3;case 35679:case 36299:case 36307:return X3;case 35680:case 36300:case 36308:case 36293:return $3;case 36289:case 36303:case 36311:case 36292:return q3}}function j3(n,e){n.uniform1fv(this.addr,e)}function K3(n,e){const t=Va(e,this.size,2);n.uniform2fv(this.addr,t)}function Z3(n,e){const t=Va(e,this.size,3);n.uniform3fv(this.addr,t)}function J3(n,e){const t=Va(e,this.size,4);n.uniform4fv(this.addr,t)}function Q3(n,e){const t=Va(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function e2(n,e){const t=Va(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function t2(n,e){const t=Va(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function n2(n,e){n.uniform1iv(this.addr,e)}function i2(n,e){n.uniform2iv(this.addr,e)}function r2(n,e){n.uniform3iv(this.addr,e)}function s2(n,e){n.uniform4iv(this.addr,e)}function o2(n,e){n.uniform1uiv(this.addr,e)}function a2(n,e){n.uniform2uiv(this.addr,e)}function l2(n,e){n.uniform3uiv(this.addr,e)}function c2(n,e){n.uniform4uiv(this.addr,e)}function u2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=vp:o=bS;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function f2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||TS,s[o])}function h2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||wS,s[o])}function d2(n,e,t){const i=this.cache,r=e.length,s=yf(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),xn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||ES,s[o])}function p2(n){switch(n){case 5126:return j3;case 35664:return K3;case 35665:return Z3;case 35666:return J3;case 35674:return Q3;case 35675:return e2;case 35676:return t2;case 5124:case 35670:return n2;case 35667:case 35671:return i2;case 35668:case 35672:return r2;case 35669:case 35673:return s2;case 5125:return o2;case 36294:return a2;case 36295:return l2;case 36296:return c2;case 35678:case 36198:case 36298:case 36306:case 35682:return u2;case 35679:case 36299:case 36307:return f2;case 35680:case 36300:case 36308:case 36293:return h2;case 36289:case 36303:case 36311:case 36292:return d2}}class m2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Y3(t.type)}}class _2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=p2(t.type)}}class g2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ph=/(\w+)(\])?(\[|\.)?/g;function l0(n,e){n.seq.push(e),n.map[e.id]=e}function v2(n,e,t){const i=n.name,r=i.length;for(Ph.lastIndex=0;;){const s=Ph.exec(i),o=Ph.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){l0(t,c===void 0?new m2(a,n,e):new _2(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new g2(a),l0(t,d)),t=d}}}class _u{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);v2(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function c0(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const x2=37297;let y2=0;function S2(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const u0=new tt;function M2(n){ft._getMatrix(u0,ft.workingColorSpace,n);const e=`mat3( ${u0.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(n)){case Xu:return[e,"LinearTransferOETF"];case At:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function f0(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+S2(n.getShaderSource(e),a)}else return s}function b2(n,e){const t=M2(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const E2={[qy]:"Linear",[Yy]:"Reinhard",[jy]:"Cineon",[Ky]:"ACESFilmic",[Jy]:"AgX",[Qy]:"Neutral",[Zy]:"Custom"};function T2(n,e){const t=E2[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Qc=new re;function w2(){ft.getLuminanceCoefficients(Qc);const n=Qc.x.toFixed(4),e=Qc.y.toFixed(4),t=Qc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function A2(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fl).join(`
`)}function R2(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function C2(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function fl(n){return n!==""}function h0(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function d0(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const P2=/^[ \t]*#include +<([\w\d./]+)>/gm;function xp(n){return n.replace(P2,L2)}const D2=new Map;function L2(n,e){let t=it[e];if(t===void 0){const i=D2.get(e);if(i!==void 0)t=it[i],Je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return xp(t)}const I2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function p0(n){return n.replace(I2,N2)}function N2(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function m0(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const U2={[fu]:"SHADOWMAP_TYPE_PCF",[ul]:"SHADOWMAP_TYPE_VSM"};function F2(n){return U2[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const O2={[To]:"ENVMAP_TYPE_CUBE",[Na]:"ENVMAP_TYPE_CUBE",[_f]:"ENVMAP_TYPE_CUBE_UV"};function B2(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":O2[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const k2={[Na]:"ENVMAP_MODE_REFRACTION"};function H2(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":k2[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const z2={[$y]:"ENVMAP_BLENDING_MULTIPLY",[AR]:"ENVMAP_BLENDING_MIX",[RR]:"ENVMAP_BLENDING_ADD"};function V2(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":z2[n.combine]||"ENVMAP_BLENDING_NONE"}function G2(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function W2(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=F2(t),c=B2(t),u=H2(t),d=V2(t),f=G2(t),h=A2(t),p=R2(s),m=r.createProgram();let _,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(fl).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(fl).join(`
`),g.length>0&&(g+=`
`)):(_=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fl).join(`
`),g=[m0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==xr?"#define TONE_MAPPING":"",t.toneMapping!==xr?it.tonemapping_pars_fragment:"",t.toneMapping!==xr?T2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,b2("linearToOutputTexel",t.outputColorSpace),w2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fl).join(`
`)),o=xp(o),o=h0(o,t),o=d0(o,t),a=xp(a),a=h0(a,t),a=d0(a,t),o=p0(o),a=p0(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===Eg?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Eg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const x=y+_+o,v=y+g+a,b=c0(r,r.VERTEX_SHADER,x),T=c0(r,r.FRAGMENT_SHADER,v);r.attachShader(m,b),r.attachShader(m,T),t.index0AttributeName!==void 0?r.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(m,0,"position"),r.linkProgram(m);function A(D){if(n.debug.checkShaderErrors){const N=r.getProgramInfoLog(m)||"",V=r.getShaderInfoLog(b)||"",z=r.getShaderInfoLog(T)||"",O=N.trim(),F=V.trim(),k=z.trim();let H=!0,X=!0;if(r.getProgramParameter(m,r.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,m,b,T);else{const L=f0(r,b,"vertex"),ue=f0(r,T,"fragment");pt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(m,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+O+`
`+L+`
`+ue)}else O!==""?Je("WebGLProgram: Program Info Log:",O):(F===""||k==="")&&(X=!1);X&&(D.diagnostics={runnable:H,programLog:O,vertexShader:{log:F,prefix:_},fragmentShader:{log:k,prefix:g}})}r.deleteShader(b),r.deleteShader(T),S=new _u(r,m),E=C2(r,m)}let S;this.getUniforms=function(){return S===void 0&&A(this),S};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(m,x2)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=y2++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=T,this}let X2=0;class $2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new q2(e),t.set(e,i)),i}}class q2{constructor(e){this.id=X2++,this.code=e,this.usedTimes=0}}function Y2(n){return n===wo||n===Vu||n===Gu}function j2(n,e,t,i,r,s){const o=new Nm,a=new $2,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer;let f=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,E,R,D,N,V){const z=D.fog,O=N.geometry,F=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?D.environment:null,k=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,H=e.get(S.envMap||F,k),X=H&&H.mapping===_f?H.image.height:null,L=h[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&Je("WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const ue=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,de=ue!==void 0?ue.length:0;let ke=0;O.morphAttributes.position!==void 0&&(ke=1),O.morphAttributes.normal!==void 0&&(ke=2),O.morphAttributes.color!==void 0&&(ke=3);let ze,Ne,ne,xe;if(L){const Re=fr[L];ze=Re.vertexShader,Ne=Re.fragmentShader}else ze=S.vertexShader,Ne=S.fragmentShader,a.update(S),ne=a.getVertexShaderID(S),xe=a.getFragmentShaderID(S);const _e=n.getRenderTarget(),Le=n.state.buffers.depth.getReversed(),we=N.isInstancedMesh===!0,Te=N.isBatchedMesh===!0,Be=!!S.map,P=!!S.matcap,B=!!H,$=!!S.aoMap,Q=!!S.lightMap,U=!!S.bumpMap,oe=!!S.normalMap,be=!!S.displacementMap,I=!!S.emissiveMap,K=!!S.metalnessMap,Y=!!S.roughnessMap,pe=S.anisotropy>0,q=S.clearcoat>0,he=S.dispersion>0,w=S.iridescence>0,M=S.sheen>0,G=S.transmission>0,Z=pe&&!!S.anisotropyMap,ae=q&&!!S.clearcoatMap,ce=q&&!!S.clearcoatNormalMap,fe=q&&!!S.clearcoatRoughnessMap,ie=w&&!!S.iridescenceMap,le=w&&!!S.iridescenceThicknessMap,Ce=M&&!!S.sheenColorMap,ge=M&&!!S.sheenRoughnessMap,ve=!!S.specularMap,Me=!!S.specularColorMap,Pe=!!S.specularIntensityMap,Xe=G&&!!S.transmissionMap,Ke=G&&!!S.thicknessMap,W=!!S.gradientMap,me=!!S.alphaMap,ee=S.alphaTest>0,De=!!S.alphaHash,Ae=!!S.extensions;let ye=xr;S.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(ye=n.toneMapping);const Ee={shaderID:L,shaderType:S.type,shaderName:S.name,vertexShader:ze,fragmentShader:Ne,defines:S.defines,customVertexShaderID:ne,customFragmentShaderID:xe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Te,batchingColor:Te&&N._colorsTexture!==null,instancing:we,instancingColor:we&&N.instanceColor!==null,instancingMorph:we&&N.morphTexture!==null,outputColorSpace:_e===null?n.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:ft.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:Be,matcap:P,envMap:B,envMapMode:B&&H.mapping,envMapCubeUVHeight:X,aoMap:$,lightMap:Q,bumpMap:U,normalMap:oe,displacementMap:be,emissiveMap:I,normalMapObjectSpace:oe&&S.normalMapType===DR,normalMapTangentSpace:oe&&S.normalMapType===Sg,packedNormalMap:oe&&S.normalMapType===Sg&&Y2(S.normalMap.format),metalnessMap:K,roughnessMap:Y,anisotropy:pe,anisotropyMap:Z,clearcoat:q,clearcoatMap:ae,clearcoatNormalMap:ce,clearcoatRoughnessMap:fe,dispersion:he,iridescence:w,iridescenceMap:ie,iridescenceThicknessMap:le,sheen:M,sheenColorMap:Ce,sheenRoughnessMap:ge,specularMap:ve,specularColorMap:Me,specularIntensityMap:Pe,transmission:G,transmissionMap:Xe,thicknessMap:Ke,gradientMap:W,opaque:S.transparent===!1&&S.blending===ya&&S.alphaToCoverage===!1,alphaMap:me,alphaTest:ee,alphaHash:De,combine:S.combine,mapUv:Be&&p(S.map.channel),aoMapUv:$&&p(S.aoMap.channel),lightMapUv:Q&&p(S.lightMap.channel),bumpMapUv:U&&p(S.bumpMap.channel),normalMapUv:oe&&p(S.normalMap.channel),displacementMapUv:be&&p(S.displacementMap.channel),emissiveMapUv:I&&p(S.emissiveMap.channel),metalnessMapUv:K&&p(S.metalnessMap.channel),roughnessMapUv:Y&&p(S.roughnessMap.channel),anisotropyMapUv:Z&&p(S.anisotropyMap.channel),clearcoatMapUv:ae&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:ce&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:le&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:ge&&p(S.sheenRoughnessMap.channel),specularMapUv:ve&&p(S.specularMap.channel),specularColorMapUv:Me&&p(S.specularColorMap.channel),specularIntensityMapUv:Pe&&p(S.specularIntensityMap.channel),transmissionMapUv:Xe&&p(S.transmissionMap.channel),thicknessMapUv:Ke&&p(S.thicknessMap.channel),alphaMapUv:me&&p(S.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(oe||pe),vertexNormals:!!O.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(Be||me),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||O.attributes.normal===void 0&&oe===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Le,skinning:N.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:ke,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ye,decodeVideoTexture:Be&&S.map.isVideoTexture===!0&&ft.getTransfer(S.map.colorSpace)===At,decodeVideoTextureEmissive:I&&S.emissiveMap.isVideoTexture===!0&&ft.getTransfer(S.emissiveMap.colorSpace)===At,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Hr,flipSided:S.side===fi,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ae&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&S.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function _(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)E.push(R),E.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(g(E,S),y(E,S),E.push(n.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function g(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function y(S,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),S.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),S.push(o.mask)}function x(S){const E=h[S.type];let R;if(E){const D=fr[E];R=gC.clone(D.uniforms)}else R=S.uniforms;return R}function v(S,E){let R=u.get(E);return R!==void 0?++R.usedTimes:(R=new W2(n,E,S,r),c.push(R),u.set(E,R)),R}function b(S){if(--S.usedTimes===0){const E=c.indexOf(S);c[E]=c[c.length-1],c.pop(),u.delete(S.cacheKey),S.destroy()}}function T(S){a.remove(S)}function A(){a.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:x,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:A}}function K2(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Z2(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function _0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function g0(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function a(f,h,p,m,_,g){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:h,material:p,materialVariant:o(f),groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},n[e]=y):(y.id=f.id,y.object=f,y.geometry=h,y.material=p,y.materialVariant=o(f),y.groupOrder=m,y.renderOrder=f.renderOrder,y.z=_,y.group=g),e++,y}function l(f,h,p,m,_,g){const y=a(f,h,p,m,_,g);p.transmission>0?i.push(y):p.transparent===!0?r.push(y):t.push(y)}function c(f,h,p,m,_,g){const y=a(f,h,p,m,_,g);p.transmission>0?i.unshift(y):p.transparent===!0?r.unshift(y):t.unshift(y)}function u(f,h){t.length>1&&t.sort(f||Z2),i.length>1&&i.sort(h||_0),r.length>1&&r.sort(h||_0)}function d(){for(let f=e,h=n.length;f<h;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function J2(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new g0,n.set(i,[o])):r>=s.length?(o=new g0,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Q2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new re,color:new bt};break;case"SpotLight":t={position:new re,direction:new re,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new re,color:new bt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new re,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":t={color:new bt,position:new re,halfWidth:new re,halfHeight:new re};break}return n[e.id]=t,t}}}function eL(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let tL=0;function nL(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function iL(n){const e=new Q2,t=eL(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new re);const r=new re,s=new sn,o=new sn;function a(c){let u=0,d=0,f=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let h=0,p=0,m=0,_=0,g=0,y=0,x=0,v=0,b=0,T=0,A=0;c.sort(nL);for(let E=0,R=c.length;E<R;E++){const D=c[E],N=D.color,V=D.intensity,z=D.distance;let O=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===wo?O=D.shadow.map.texture:O=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=N.r*V,d+=N.g*V,f+=N.b*V;else if(D.isLightProbe){for(let F=0;F<9;F++)i.probe[F].addScaledVector(D.sh.coefficients[F],V);A++}else if(D.isDirectionalLight){const F=e.get(D);if(F.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const k=D.shadow,H=t.get(D);H.shadowIntensity=k.intensity,H.shadowBias=k.bias,H.shadowNormalBias=k.normalBias,H.shadowRadius=k.radius,H.shadowMapSize=k.mapSize,i.directionalShadow[h]=H,i.directionalShadowMap[h]=O,i.directionalShadowMatrix[h]=D.shadow.matrix,y++}i.directional[h]=F,h++}else if(D.isSpotLight){const F=e.get(D);F.position.setFromMatrixPosition(D.matrixWorld),F.color.copy(N).multiplyScalar(V),F.distance=z,F.coneCos=Math.cos(D.angle),F.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),F.decay=D.decay,i.spot[m]=F;const k=D.shadow;if(D.map&&(i.spotLightMap[b]=D.map,b++,k.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[m]=k.matrix,D.castShadow){const H=t.get(D);H.shadowIntensity=k.intensity,H.shadowBias=k.bias,H.shadowNormalBias=k.normalBias,H.shadowRadius=k.radius,H.shadowMapSize=k.mapSize,i.spotShadow[m]=H,i.spotShadowMap[m]=O,v++}m++}else if(D.isRectAreaLight){const F=e.get(D);F.color.copy(N).multiplyScalar(V),F.halfWidth.set(D.width*.5,0,0),F.halfHeight.set(0,D.height*.5,0),i.rectArea[_]=F,_++}else if(D.isPointLight){const F=e.get(D);if(F.color.copy(D.color).multiplyScalar(D.intensity),F.distance=D.distance,F.decay=D.decay,D.castShadow){const k=D.shadow,H=t.get(D);H.shadowIntensity=k.intensity,H.shadowBias=k.bias,H.shadowNormalBias=k.normalBias,H.shadowRadius=k.radius,H.shadowMapSize=k.mapSize,H.shadowCameraNear=k.camera.near,H.shadowCameraFar=k.camera.far,i.pointShadow[p]=H,i.pointShadowMap[p]=O,i.pointShadowMatrix[p]=D.shadow.matrix,x++}i.point[p]=F,p++}else if(D.isHemisphereLight){const F=e.get(D);F.skyColor.copy(D.color).multiplyScalar(V),F.groundColor.copy(D.groundColor).multiplyScalar(V),i.hemi[g]=F,g++}}_>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Fe.LTC_FLOAT_1,i.rectAreaLTC2=Fe.LTC_FLOAT_2):(i.rectAreaLTC1=Fe.LTC_HALF_1,i.rectAreaLTC2=Fe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const S=i.hash;(S.directionalLength!==h||S.pointLength!==p||S.spotLength!==m||S.rectAreaLength!==_||S.hemiLength!==g||S.numDirectionalShadows!==y||S.numPointShadows!==x||S.numSpotShadows!==v||S.numSpotMaps!==b||S.numLightProbes!==A)&&(i.directional.length=h,i.spot.length=m,i.rectArea.length=_,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+b-T,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,S.directionalLength=h,S.pointLength=p,S.spotLength=m,S.rectAreaLength=_,S.hemiLength=g,S.numDirectionalShadows=y,S.numPointShadows=x,S.numSpotShadows=v,S.numSpotMaps=b,S.numLightProbes=A,i.version=tL++)}function l(c,u){let d=0,f=0,h=0,p=0,m=0;const _=u.matrixWorldInverse;for(let g=0,y=c.length;g<y;g++){const x=c[g];if(x.isDirectionalLight){const v=i.directional[d];v.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(_),d++}else if(x.isSpotLight){const v=i.spot[h];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(_),v.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(_),h++}else if(x.isRectAreaLight){const v=i.rectArea[p];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(_),o.identity(),s.copy(x.matrixWorld),s.premultiply(_),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(x.isPointLight){const v=i.point[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(_),f++}else if(x.isHemisphereLight){const v=i.hemi[m];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(_),m++}}}return{setup:a,setupView:l,state:i}}function v0(n){const e=new iL(n),t=[],i=[],r=[];function s(f){d.camera=f,t.length=0,i.length=0,r.length=0}function o(f){t.push(f)}function a(f){i.push(f)}function l(f){r.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function rL(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new v0(n),e.set(r,[a])):s>=o.length?(a=new v0(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const sL=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oL=`uniform sampler2D shadow_pass;
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
}`,aL=[new re(1,0,0),new re(-1,0,0),new re(0,1,0),new re(0,-1,0),new re(0,0,1),new re(0,0,-1)],lL=[new re(0,-1,0),new re(0,-1,0),new re(0,0,1),new re(0,0,-1),new re(0,-1,0),new re(0,-1,0)],x0=new sn,el=new re,Dh=new re;function cL(n,e,t){let i=new pS;const r=new Et,s=new Et,o=new tn,a=new SC,l=new MC,c={},u=t.maxTextureSize,d={[Bs]:fi,[fi]:Bs,[Hr]:Hr},f=new tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Et},radius:{value:4}},vertexShader:sL,fragmentShader:oL}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const p=new nr;p.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new ns(p,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fu;let g=this.type;this.render=function(T,A,S){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||T.length===0)return;this.type===lR&&(Je("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=fu);const E=n.getRenderTarget(),R=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),N=n.state;N.setBlending(Xr),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const V=g!==this.type;V&&A.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(O=>O.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,O=T.length;z<O;z++){const F=T[z],k=F.shadow;if(k===void 0){Je("WebGLShadowMap:",F,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const H=k.getFrameExtents();r.multiply(H),s.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/H.x),r.x=s.x*H.x,k.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/H.y),r.y=s.y*H.y,k.mapSize.y=s.y));const X=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=X,k.map===null||V===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===ul){if(F.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new yr(r.x,r.y,{format:wo,type:es,minFilter:gn,magFilter:gn,generateMipmaps:!1}),k.map.texture.name=F.name+".shadowMap",k.map.depthTexture=new Ua(r.x,r.y,mr),k.map.depthTexture.name=F.name+".shadowMapDepth",k.map.depthTexture.format=ts,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Dn,k.map.depthTexture.magFilter=Dn}else F.isPointLight?(k.map=new MS(r.x),k.map.depthTexture=new mC(r.x,Er)):(k.map=new yr(r.x,r.y),k.map.depthTexture=new Ua(r.x,r.y,Er)),k.map.depthTexture.name=F.name+".shadowMap",k.map.depthTexture.format=ts,this.type===fu?(k.map.depthTexture.compareFunction=X?Lm:Dm,k.map.depthTexture.minFilter=gn,k.map.depthTexture.magFilter=gn):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Dn,k.map.depthTexture.magFilter=Dn);k.camera.updateProjectionMatrix()}const L=k.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<L;ue++){if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ue),n.clear();else{ue===0&&(n.setRenderTarget(k.map),n.clear());const de=k.getViewport(ue);o.set(s.x*de.x,s.y*de.y,s.x*de.z,s.y*de.w),N.viewport(o)}if(F.isPointLight){const de=k.camera,ke=k.matrix,ze=F.distance||de.far;ze!==de.far&&(de.far=ze,de.updateProjectionMatrix()),el.setFromMatrixPosition(F.matrixWorld),de.position.copy(el),Dh.copy(de.position),Dh.add(aL[ue]),de.up.copy(lL[ue]),de.lookAt(Dh),de.updateMatrixWorld(),ke.makeTranslation(-el.x,-el.y,-el.z),x0.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),k._frustum.setFromProjectionMatrix(x0,de.coordinateSystem,de.reversedDepth)}else k.updateMatrices(F);i=k.getFrustum(),v(A,S,k.camera,F,this.type)}k.isPointLightShadow!==!0&&this.type===ul&&y(k,S),k.needsUpdate=!1}g=this.type,_.needsUpdate=!1,n.setRenderTarget(E,R,D)};function y(T,A){const S=e.update(m);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,h.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new yr(r.x,r.y,{format:wo,type:es})),f.uniforms.shadow_pass.value=T.map.depthTexture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,S,f,m,null),h.uniforms.shadow_pass.value=T.mapPass.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,S,h,m,null)}function x(T,A,S,E){let R=null;const D=S.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)R=D;else if(R=S.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const N=R.uuid,V=A.uuid;let z=c[N];z===void 0&&(z={},c[N]=z);let O=z[V];O===void 0&&(O=R.clone(),z[V]=O,A.addEventListener("dispose",b)),R=O}if(R.visible=A.visible,R.wireframe=A.wireframe,E===ul?R.side=A.shadowSide!==null?A.shadowSide:A.side:R.side=A.shadowSide!==null?A.shadowSide:d[A.side],R.alphaMap=A.alphaMap,R.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,R.map=A.map,R.clipShadows=A.clipShadows,R.clippingPlanes=A.clippingPlanes,R.clipIntersection=A.clipIntersection,R.displacementMap=A.displacementMap,R.displacementScale=A.displacementScale,R.displacementBias=A.displacementBias,R.wireframeLinewidth=A.wireframeLinewidth,R.linewidth=A.linewidth,S.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const N=n.properties.get(R);N.light=S}return R}function v(T,A,S,E,R){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===ul)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,T.matrixWorld);const V=e.update(T),z=T.material;if(Array.isArray(z)){const O=V.groups;for(let F=0,k=O.length;F<k;F++){const H=O[F],X=z[H.materialIndex];if(X&&X.visible){const L=x(T,X,E,R);T.onBeforeShadow(n,T,A,S,V,L,H),n.renderBufferDirect(S,null,V,L,T,H),T.onAfterShadow(n,T,A,S,V,L,H)}}}else if(z.visible){const O=x(T,z,E,R);T.onBeforeShadow(n,T,A,S,V,O,null),n.renderBufferDirect(S,null,V,O,T,null),T.onAfterShadow(n,T,A,S,V,O,null)}}const N=T.children;for(let V=0,z=N.length;V<z;V++)v(N[V],A,S,E,R)}function b(T){T.target.removeEventListener("dispose",b);for(const S in c){const E=c[S],R=T.target.uuid;R in E&&(E[R].dispose(),delete E[R])}}}function uL(n,e){function t(){let W=!1;const me=new tn;let ee=null;const De=new tn(0,0,0,0);return{setMask:function(Ae){ee!==Ae&&!W&&(n.colorMask(Ae,Ae,Ae,Ae),ee=Ae)},setLocked:function(Ae){W=Ae},setClear:function(Ae,ye,Ee,Re,je){je===!0&&(Ae*=Re,ye*=Re,Ee*=Re),me.set(Ae,ye,Ee,Re),De.equals(me)===!1&&(n.clearColor(Ae,ye,Ee,Re),De.copy(me))},reset:function(){W=!1,ee=null,De.set(-1,0,0,0)}}}function i(){let W=!1,me=!1,ee=null,De=null,Ae=null;return{setReversed:function(ye){if(me!==ye){const Ee=e.get("EXT_clip_control");ye?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),me=ye;const Re=Ae;Ae=null,this.setClear(Re)}},getReversed:function(){return me},setTest:function(ye){ye?_e(n.DEPTH_TEST):Le(n.DEPTH_TEST)},setMask:function(ye){ee!==ye&&!W&&(n.depthMask(ye),ee=ye)},setFunc:function(ye){if(me&&(ye=VR[ye]),De!==ye){switch(ye){case Cd:n.depthFunc(n.NEVER);break;case Pd:n.depthFunc(n.ALWAYS);break;case Dd:n.depthFunc(n.LESS);break;case Ia:n.depthFunc(n.LEQUAL);break;case Ld:n.depthFunc(n.EQUAL);break;case Id:n.depthFunc(n.GEQUAL);break;case Nd:n.depthFunc(n.GREATER);break;case Ud:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}De=ye}},setLocked:function(ye){W=ye},setClear:function(ye){Ae!==ye&&(Ae=ye,me&&(ye=1-ye),n.clearDepth(ye))},reset:function(){W=!1,ee=null,De=null,Ae=null,me=!1}}}function r(){let W=!1,me=null,ee=null,De=null,Ae=null,ye=null,Ee=null,Re=null,je=null;return{setTest:function(Se){W||(Se?_e(n.STENCIL_TEST):Le(n.STENCIL_TEST))},setMask:function(Se){me!==Se&&!W&&(n.stencilMask(Se),me=Se)},setFunc:function(Se,$e,He){(ee!==Se||De!==$e||Ae!==He)&&(n.stencilFunc(Se,$e,He),ee=Se,De=$e,Ae=He)},setOp:function(Se,$e,He){(ye!==Se||Ee!==$e||Re!==He)&&(n.stencilOp(Se,$e,He),ye=Se,Ee=$e,Re=He)},setLocked:function(Se){W=Se},setClear:function(Se){je!==Se&&(n.clearStencil(Se),je=Se)},reset:function(){W=!1,me=null,ee=null,De=null,Ae=null,ye=null,Ee=null,Re=null,je=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},d={},f={},h=new WeakMap,p=[],m=null,_=!1,g=null,y=null,x=null,v=null,b=null,T=null,A=null,S=new bt(0,0,0),E=0,R=!1,D=null,N=null,V=null,z=null,O=null;const F=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,H=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(X)[1]),k=H>=1):X.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),k=H>=2);let L=null,ue={};const de=n.getParameter(n.SCISSOR_BOX),ke=n.getParameter(n.VIEWPORT),ze=new tn().fromArray(de),Ne=new tn().fromArray(ke);function ne(W,me,ee,De){const Ae=new Uint8Array(4),ye=n.createTexture();n.bindTexture(W,ye),n.texParameteri(W,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(W,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ee=0;Ee<ee;Ee++)W===n.TEXTURE_3D||W===n.TEXTURE_2D_ARRAY?n.texImage3D(me,0,n.RGBA,1,1,De,0,n.RGBA,n.UNSIGNED_BYTE,Ae):n.texImage2D(me+Ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ae);return ye}const xe={};xe[n.TEXTURE_2D]=ne(n.TEXTURE_2D,n.TEXTURE_2D,1),xe[n.TEXTURE_CUBE_MAP]=ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[n.TEXTURE_2D_ARRAY]=ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),xe[n.TEXTURE_3D]=ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),_e(n.DEPTH_TEST),o.setFunc(Ia),U(!1),oe(gg),_e(n.CULL_FACE),$(Xr);function _e(W){u[W]!==!0&&(n.enable(W),u[W]=!0)}function Le(W){u[W]!==!1&&(n.disable(W),u[W]=!1)}function we(W,me){return f[W]!==me?(n.bindFramebuffer(W,me),f[W]=me,W===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=me),W===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=me),!0):!1}function Te(W,me){let ee=p,De=!1;if(W){ee=h.get(me),ee===void 0&&(ee=[],h.set(me,ee));const Ae=W.textures;if(ee.length!==Ae.length||ee[0]!==n.COLOR_ATTACHMENT0){for(let ye=0,Ee=Ae.length;ye<Ee;ye++)ee[ye]=n.COLOR_ATTACHMENT0+ye;ee.length=Ae.length,De=!0}}else ee[0]!==n.BACK&&(ee[0]=n.BACK,De=!0);De&&n.drawBuffers(ee)}function Be(W){return m!==W?(n.useProgram(W),m=W,!0):!1}const P={[to]:n.FUNC_ADD,[uR]:n.FUNC_SUBTRACT,[fR]:n.FUNC_REVERSE_SUBTRACT};P[hR]=n.MIN,P[dR]=n.MAX;const B={[pR]:n.ZERO,[mR]:n.ONE,[_R]:n.SRC_COLOR,[Ad]:n.SRC_ALPHA,[MR]:n.SRC_ALPHA_SATURATE,[yR]:n.DST_COLOR,[vR]:n.DST_ALPHA,[gR]:n.ONE_MINUS_SRC_COLOR,[Rd]:n.ONE_MINUS_SRC_ALPHA,[SR]:n.ONE_MINUS_DST_COLOR,[xR]:n.ONE_MINUS_DST_ALPHA,[bR]:n.CONSTANT_COLOR,[ER]:n.ONE_MINUS_CONSTANT_COLOR,[TR]:n.CONSTANT_ALPHA,[wR]:n.ONE_MINUS_CONSTANT_ALPHA};function $(W,me,ee,De,Ae,ye,Ee,Re,je,Se){if(W===Xr){_===!0&&(Le(n.BLEND),_=!1);return}if(_===!1&&(_e(n.BLEND),_=!0),W!==cR){if(W!==g||Se!==R){if((y!==to||b!==to)&&(n.blendEquation(n.FUNC_ADD),y=to,b=to),Se)switch(W){case ya:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vg:n.blendFunc(n.ONE,n.ONE);break;case xg:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yg:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:pt("WebGLState: Invalid blending: ",W);break}else switch(W){case ya:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vg:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xg:pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yg:pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:pt("WebGLState: Invalid blending: ",W);break}x=null,v=null,T=null,A=null,S.set(0,0,0),E=0,g=W,R=Se}return}Ae=Ae||me,ye=ye||ee,Ee=Ee||De,(me!==y||Ae!==b)&&(n.blendEquationSeparate(P[me],P[Ae]),y=me,b=Ae),(ee!==x||De!==v||ye!==T||Ee!==A)&&(n.blendFuncSeparate(B[ee],B[De],B[ye],B[Ee]),x=ee,v=De,T=ye,A=Ee),(Re.equals(S)===!1||je!==E)&&(n.blendColor(Re.r,Re.g,Re.b,je),S.copy(Re),E=je),g=W,R=!1}function Q(W,me){W.side===Hr?Le(n.CULL_FACE):_e(n.CULL_FACE);let ee=W.side===fi;me&&(ee=!ee),U(ee),W.blending===ya&&W.transparent===!1?$(Xr):$(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),s.setMask(W.colorWrite);const De=W.stencilWrite;a.setTest(De),De&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),I(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?_e(n.SAMPLE_ALPHA_TO_COVERAGE):Le(n.SAMPLE_ALPHA_TO_COVERAGE)}function U(W){D!==W&&(W?n.frontFace(n.CW):n.frontFace(n.CCW),D=W)}function oe(W){W!==oR?(_e(n.CULL_FACE),W!==N&&(W===gg?n.cullFace(n.BACK):W===aR?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Le(n.CULL_FACE),N=W}function be(W){W!==V&&(k&&n.lineWidth(W),V=W)}function I(W,me,ee){W?(_e(n.POLYGON_OFFSET_FILL),(z!==me||O!==ee)&&(z=me,O=ee,o.getReversed()&&(me=-me),n.polygonOffset(me,ee))):Le(n.POLYGON_OFFSET_FILL)}function K(W){W?_e(n.SCISSOR_TEST):Le(n.SCISSOR_TEST)}function Y(W){W===void 0&&(W=n.TEXTURE0+F-1),L!==W&&(n.activeTexture(W),L=W)}function pe(W,me,ee){ee===void 0&&(L===null?ee=n.TEXTURE0+F-1:ee=L);let De=ue[ee];De===void 0&&(De={type:void 0,texture:void 0},ue[ee]=De),(De.type!==W||De.texture!==me)&&(L!==ee&&(n.activeTexture(ee),L=ee),n.bindTexture(W,me||xe[W]),De.type=W,De.texture=me)}function q(){const W=ue[L];W!==void 0&&W.type!==void 0&&(n.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function he(){try{n.compressedTexImage2D(...arguments)}catch(W){pt("WebGLState:",W)}}function w(){try{n.compressedTexImage3D(...arguments)}catch(W){pt("WebGLState:",W)}}function M(){try{n.texSubImage2D(...arguments)}catch(W){pt("WebGLState:",W)}}function G(){try{n.texSubImage3D(...arguments)}catch(W){pt("WebGLState:",W)}}function Z(){try{n.compressedTexSubImage2D(...arguments)}catch(W){pt("WebGLState:",W)}}function ae(){try{n.compressedTexSubImage3D(...arguments)}catch(W){pt("WebGLState:",W)}}function ce(){try{n.texStorage2D(...arguments)}catch(W){pt("WebGLState:",W)}}function fe(){try{n.texStorage3D(...arguments)}catch(W){pt("WebGLState:",W)}}function ie(){try{n.texImage2D(...arguments)}catch(W){pt("WebGLState:",W)}}function le(){try{n.texImage3D(...arguments)}catch(W){pt("WebGLState:",W)}}function Ce(W){return d[W]!==void 0?d[W]:n.getParameter(W)}function ge(W,me){d[W]!==me&&(n.pixelStorei(W,me),d[W]=me)}function ve(W){ze.equals(W)===!1&&(n.scissor(W.x,W.y,W.z,W.w),ze.copy(W))}function Me(W){Ne.equals(W)===!1&&(n.viewport(W.x,W.y,W.z,W.w),Ne.copy(W))}function Pe(W,me){let ee=c.get(me);ee===void 0&&(ee=new WeakMap,c.set(me,ee));let De=ee.get(W);De===void 0&&(De=n.getUniformBlockIndex(me,W.name),ee.set(W,De))}function Xe(W,me){const De=c.get(me).get(W);l.get(me)!==De&&(n.uniformBlockBinding(me,De,W.__bindingPointIndex),l.set(me,De))}function Ke(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},L=null,ue={},f={},h=new WeakMap,p=[],m=null,_=!1,g=null,y=null,x=null,v=null,b=null,T=null,A=null,S=new bt(0,0,0),E=0,R=!1,D=null,N=null,V=null,z=null,O=null,ze.set(0,0,n.canvas.width,n.canvas.height),Ne.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:_e,disable:Le,bindFramebuffer:we,drawBuffers:Te,useProgram:Be,setBlending:$,setMaterial:Q,setFlipSided:U,setCullFace:oe,setLineWidth:be,setPolygonOffset:I,setScissorTest:K,activeTexture:Y,bindTexture:pe,unbindTexture:q,compressedTexImage2D:he,compressedTexImage3D:w,texImage2D:ie,texImage3D:le,pixelStorei:ge,getParameter:Ce,updateUBOMapping:Pe,uniformBlockBinding:Xe,texStorage2D:ce,texStorage3D:fe,texSubImage2D:M,texSubImage3D:G,compressedTexSubImage2D:Z,compressedTexSubImage3D:ae,scissor:ve,viewport:Me,reset:Ke}}function fL(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Et,u=new WeakMap,d=new Set;let f;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,M){return p?new OffscreenCanvas(w,M):qu("canvas")}function _(w,M,G){let Z=1;const ae=he(w);if((ae.width>G||ae.height>G)&&(Z=G/Math.max(ae.width,ae.height)),Z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ce=Math.floor(Z*ae.width),fe=Math.floor(Z*ae.height);f===void 0&&(f=m(ce,fe));const ie=M?m(ce,fe):f;return ie.width=ce,ie.height=fe,ie.getContext("2d").drawImage(w,0,0,ce,fe),Je("WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+ce+"x"+fe+")."),ie}else return"data"in w&&Je("WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),w;return w}function g(w){return w.generateMipmaps}function y(w){n.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(w,M,G,Z,ae,ce=!1){if(w!==null){if(n[w]!==void 0)return n[w];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let fe;Z&&(fe=e.get("EXT_texture_norm16"),fe||Je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ie=M;if(M===n.RED&&(G===n.FLOAT&&(ie=n.R32F),G===n.HALF_FLOAT&&(ie=n.R16F),G===n.UNSIGNED_BYTE&&(ie=n.R8),G===n.UNSIGNED_SHORT&&fe&&(ie=fe.R16_EXT),G===n.SHORT&&fe&&(ie=fe.R16_SNORM_EXT)),M===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(ie=n.R8UI),G===n.UNSIGNED_SHORT&&(ie=n.R16UI),G===n.UNSIGNED_INT&&(ie=n.R32UI),G===n.BYTE&&(ie=n.R8I),G===n.SHORT&&(ie=n.R16I),G===n.INT&&(ie=n.R32I)),M===n.RG&&(G===n.FLOAT&&(ie=n.RG32F),G===n.HALF_FLOAT&&(ie=n.RG16F),G===n.UNSIGNED_BYTE&&(ie=n.RG8),G===n.UNSIGNED_SHORT&&fe&&(ie=fe.RG16_EXT),G===n.SHORT&&fe&&(ie=fe.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(ie=n.RG8UI),G===n.UNSIGNED_SHORT&&(ie=n.RG16UI),G===n.UNSIGNED_INT&&(ie=n.RG32UI),G===n.BYTE&&(ie=n.RG8I),G===n.SHORT&&(ie=n.RG16I),G===n.INT&&(ie=n.RG32I)),M===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(ie=n.RGB8UI),G===n.UNSIGNED_SHORT&&(ie=n.RGB16UI),G===n.UNSIGNED_INT&&(ie=n.RGB32UI),G===n.BYTE&&(ie=n.RGB8I),G===n.SHORT&&(ie=n.RGB16I),G===n.INT&&(ie=n.RGB32I)),M===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(ie=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(ie=n.RGBA16UI),G===n.UNSIGNED_INT&&(ie=n.RGBA32UI),G===n.BYTE&&(ie=n.RGBA8I),G===n.SHORT&&(ie=n.RGBA16I),G===n.INT&&(ie=n.RGBA32I)),M===n.RGB&&(G===n.UNSIGNED_SHORT&&fe&&(ie=fe.RGB16_EXT),G===n.SHORT&&fe&&(ie=fe.RGB16_SNORM_EXT),G===n.UNSIGNED_INT_5_9_9_9_REV&&(ie=n.RGB9_E5),G===n.UNSIGNED_INT_10F_11F_11F_REV&&(ie=n.R11F_G11F_B10F)),M===n.RGBA){const le=ce?Xu:ft.getTransfer(ae);G===n.FLOAT&&(ie=n.RGBA32F),G===n.HALF_FLOAT&&(ie=n.RGBA16F),G===n.UNSIGNED_BYTE&&(ie=le===At?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT&&fe&&(ie=fe.RGBA16_EXT),G===n.SHORT&&fe&&(ie=fe.RGBA16_SNORM_EXT),G===n.UNSIGNED_SHORT_4_4_4_4&&(ie=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(ie=n.RGB5_A1)}return(ie===n.R16F||ie===n.R32F||ie===n.RG16F||ie===n.RG32F||ie===n.RGBA16F||ie===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function b(w,M){let G;return w?M===null||M===Er||M===jl?G=n.DEPTH24_STENCIL8:M===mr?G=n.DEPTH32F_STENCIL8:M===Yl&&(G=n.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Er||M===jl?G=n.DEPTH_COMPONENT24:M===mr?G=n.DEPTH_COMPONENT32F:M===Yl&&(G=n.DEPTH_COMPONENT16),G}function T(w,M){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==Dn&&w.minFilter!==gn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function A(w){const M=w.target;M.removeEventListener("dispose",A),E(M),M.isVideoTexture&&u.delete(M),M.isHTMLTexture&&d.delete(M)}function S(w){const M=w.target;M.removeEventListener("dispose",S),D(M)}function E(w){const M=i.get(w);if(M.__webglInit===void 0)return;const G=w.source,Z=h.get(G);if(Z){const ae=Z[M.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&R(w),Object.keys(Z).length===0&&h.delete(G)}i.remove(w)}function R(w){const M=i.get(w);n.deleteTexture(M.__webglTexture);const G=w.source,Z=h.get(G);delete Z[M.__cacheKey],o.memory.textures--}function D(w){const M=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(M.__webglFramebuffer[Z]))for(let ae=0;ae<M.__webglFramebuffer[Z].length;ae++)n.deleteFramebuffer(M.__webglFramebuffer[Z][ae]);else n.deleteFramebuffer(M.__webglFramebuffer[Z]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[Z])}else{if(Array.isArray(M.__webglFramebuffer))for(let Z=0;Z<M.__webglFramebuffer.length;Z++)n.deleteFramebuffer(M.__webglFramebuffer[Z]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Z=0;Z<M.__webglColorRenderbuffer.length;Z++)M.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[Z]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const G=w.textures;for(let Z=0,ae=G.length;Z<ae;Z++){const ce=i.get(G[Z]);ce.__webglTexture&&(n.deleteTexture(ce.__webglTexture),o.memory.textures--),i.remove(G[Z])}i.remove(w)}let N=0;function V(){N=0}function z(){return N}function O(w){N=w}function F(){const w=N;return w>=r.maxTextures&&Je("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),N+=1,w}function k(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function H(w,M){const G=i.get(w);if(w.isVideoTexture&&pe(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&G.__version!==w.version){const Z=w.image;if(Z===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{Le(G,w,M);return}}else w.isExternalTexture&&(G.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+M)}function X(w,M){const G=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){Le(G,w,M);return}else w.isExternalTexture&&(G.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+M)}function L(w,M){const G=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){Le(G,w,M);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+M)}function ue(w,M){const G=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&G.__version!==w.version){we(G,w,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+M)}const de={[Fd]:n.REPEAT,[Zi]:n.CLAMP_TO_EDGE,[Od]:n.MIRRORED_REPEAT},ke={[Dn]:n.NEAREST,[CR]:n.NEAREST_MIPMAP_NEAREST,[Cc]:n.NEAREST_MIPMAP_LINEAR,[gn]:n.LINEAR,[th]:n.LINEAR_MIPMAP_NEAREST,[ws]:n.LINEAR_MIPMAP_LINEAR},ze={[LR]:n.NEVER,[OR]:n.ALWAYS,[IR]:n.LESS,[Dm]:n.LEQUAL,[NR]:n.EQUAL,[Lm]:n.GEQUAL,[UR]:n.GREATER,[FR]:n.NOTEQUAL};function Ne(w,M){if(M.type===mr&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===gn||M.magFilter===th||M.magFilter===Cc||M.magFilter===ws||M.minFilter===gn||M.minFilter===th||M.minFilter===Cc||M.minFilter===ws)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,de[M.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,de[M.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,de[M.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,ke[M.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,ke[M.minFilter]),M.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,ze[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Dn||M.minFilter!==Cc&&M.minFilter!==ws||M.type===mr&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function ne(w,M){let G=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",A));const Z=M.source;let ae=h.get(Z);ae===void 0&&(ae={},h.set(Z,ae));const ce=k(M);if(ce!==w.__cacheKey){ae[ce]===void 0&&(ae[ce]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ae[ce].usedTimes++;const fe=ae[w.__cacheKey];fe!==void 0&&(ae[w.__cacheKey].usedTimes--,fe.usedTimes===0&&R(M)),w.__cacheKey=ce,w.__webglTexture=ae[ce].texture}return G}function xe(w,M,G){return Math.floor(Math.floor(w/G)/M)}function _e(w,M,G,Z){const ce=w.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,G,Z,M.data);else{ce.sort((ge,ve)=>ge.start-ve.start);let fe=0;for(let ge=1;ge<ce.length;ge++){const ve=ce[fe],Me=ce[ge],Pe=ve.start+ve.count,Xe=xe(Me.start,M.width,4),Ke=xe(ve.start,M.width,4);Me.start<=Pe+1&&Xe===Ke&&xe(Me.start+Me.count-1,M.width,4)===Xe?ve.count=Math.max(ve.count,Me.start+Me.count-ve.start):(++fe,ce[fe]=Me)}ce.length=fe+1;const ie=t.getParameter(n.UNPACK_ROW_LENGTH),le=t.getParameter(n.UNPACK_SKIP_PIXELS),Ce=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let ge=0,ve=ce.length;ge<ve;ge++){const Me=ce[ge],Pe=Math.floor(Me.start/4),Xe=Math.ceil(Me.count/4),Ke=Pe%M.width,W=Math.floor(Pe/M.width),me=Xe,ee=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ke),t.pixelStorei(n.UNPACK_SKIP_ROWS,W),t.texSubImage2D(n.TEXTURE_2D,0,Ke,W,me,ee,G,Z,M.data)}w.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,ie),t.pixelStorei(n.UNPACK_SKIP_PIXELS,le),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Le(w,M,G){let Z=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Z=n.TEXTURE_3D);const ae=ne(w,M),ce=M.source;t.bindTexture(Z,w.__webglTexture,n.TEXTURE0+G);const fe=i.get(ce);if(ce.version!==fe.__version||ae===!0){if(t.activeTexture(n.TEXTURE0+G),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const ee=ft.getPrimaries(ft.workingColorSpace),De=M.colorSpace===xs?null:ft.getPrimaries(M.colorSpace),Ae=M.colorSpace===xs||ee===De?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let le=_(M.image,!1,r.maxTextureSize);le=q(M,le);const Ce=s.convert(M.format,M.colorSpace),ge=s.convert(M.type);let ve=v(M.internalFormat,Ce,ge,M.normalized,M.colorSpace,M.isVideoTexture);Ne(Z,M);let Me;const Pe=M.mipmaps,Xe=M.isVideoTexture!==!0,Ke=fe.__version===void 0||ae===!0,W=ce.dataReady,me=T(M,le);if(M.isDepthTexture)ve=b(M.format===so,M.type),Ke&&(Xe?t.texStorage2D(n.TEXTURE_2D,1,ve,le.width,le.height):t.texImage2D(n.TEXTURE_2D,0,ve,le.width,le.height,0,Ce,ge,null));else if(M.isDataTexture)if(Pe.length>0){Xe&&Ke&&t.texStorage2D(n.TEXTURE_2D,me,ve,Pe[0].width,Pe[0].height);for(let ee=0,De=Pe.length;ee<De;ee++)Me=Pe[ee],Xe?W&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,Me.width,Me.height,Ce,ge,Me.data):t.texImage2D(n.TEXTURE_2D,ee,ve,Me.width,Me.height,0,Ce,ge,Me.data);M.generateMipmaps=!1}else Xe?(Ke&&t.texStorage2D(n.TEXTURE_2D,me,ve,le.width,le.height),W&&_e(M,le,Ce,ge)):t.texImage2D(n.TEXTURE_2D,0,ve,le.width,le.height,0,Ce,ge,le.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Xe&&Ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,ve,Pe[0].width,Pe[0].height,le.depth);for(let ee=0,De=Pe.length;ee<De;ee++)if(Me=Pe[ee],M.format!==Ji)if(Ce!==null)if(Xe){if(W)if(M.layerUpdates.size>0){const Ae=Kg(Me.width,Me.height,M.format,M.type);for(const ye of M.layerUpdates){const Ee=Me.data.subarray(ye*Ae/Me.data.BYTES_PER_ELEMENT,(ye+1)*Ae/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,ye,Me.width,Me.height,1,Ce,Ee)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,Me.width,Me.height,le.depth,Ce,Me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ee,ve,Me.width,Me.height,le.depth,0,Me.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?W&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,Me.width,Me.height,le.depth,Ce,ge,Me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ee,ve,Me.width,Me.height,le.depth,0,Ce,ge,Me.data)}else{Xe&&Ke&&t.texStorage2D(n.TEXTURE_2D,me,ve,Pe[0].width,Pe[0].height);for(let ee=0,De=Pe.length;ee<De;ee++)Me=Pe[ee],M.format!==Ji?Ce!==null?Xe?W&&t.compressedTexSubImage2D(n.TEXTURE_2D,ee,0,0,Me.width,Me.height,Ce,Me.data):t.compressedTexImage2D(n.TEXTURE_2D,ee,ve,Me.width,Me.height,0,Me.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?W&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,Me.width,Me.height,Ce,ge,Me.data):t.texImage2D(n.TEXTURE_2D,ee,ve,Me.width,Me.height,0,Ce,ge,Me.data)}else if(M.isDataArrayTexture)if(Xe){if(Ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,ve,le.width,le.height,le.depth),W)if(M.layerUpdates.size>0){const ee=Kg(le.width,le.height,M.format,M.type);for(const De of M.layerUpdates){const Ae=le.data.subarray(De*ee/le.data.BYTES_PER_ELEMENT,(De+1)*ee/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,De,le.width,le.height,1,Ce,ge,Ae)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Ce,ge,le.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ve,le.width,le.height,le.depth,0,Ce,ge,le.data);else if(M.isData3DTexture)Xe?(Ke&&t.texStorage3D(n.TEXTURE_3D,me,ve,le.width,le.height,le.depth),W&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Ce,ge,le.data)):t.texImage3D(n.TEXTURE_3D,0,ve,le.width,le.height,le.depth,0,Ce,ge,le.data);else if(M.isFramebufferTexture){if(Ke)if(Xe)t.texStorage2D(n.TEXTURE_2D,me,ve,le.width,le.height);else{let ee=le.width,De=le.height;for(let Ae=0;Ae<me;Ae++)t.texImage2D(n.TEXTURE_2D,Ae,ve,ee,De,0,Ce,ge,null),ee>>=1,De>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const ee=n.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),le.parentNode!==ee){ee.appendChild(le),d.add(M),ee.onpaint=Re=>{const je=Re.changedElements;for(const Se of d)je.includes(Se.image)&&(Se.needsUpdate=!0)},ee.requestPaint();return}const De=0,Ae=n.RGBA,ye=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,De,Ae,ye,Ee,le),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(Xe&&Ke){const ee=he(Pe[0]);t.texStorage2D(n.TEXTURE_2D,me,ve,ee.width,ee.height)}for(let ee=0,De=Pe.length;ee<De;ee++)Me=Pe[ee],Xe?W&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,Ce,ge,Me):t.texImage2D(n.TEXTURE_2D,ee,ve,Ce,ge,Me);M.generateMipmaps=!1}else if(Xe){if(Ke){const ee=he(le);t.texStorage2D(n.TEXTURE_2D,me,ve,ee.width,ee.height)}W&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ce,ge,le)}else t.texImage2D(n.TEXTURE_2D,0,ve,Ce,ge,le);g(M)&&y(Z),fe.__version=ce.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function we(w,M,G){if(M.image.length!==6)return;const Z=ne(w,M),ae=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+G);const ce=i.get(ae);if(ae.version!==ce.__version||Z===!0){t.activeTexture(n.TEXTURE0+G);const fe=ft.getPrimaries(ft.workingColorSpace),ie=M.colorSpace===xs?null:ft.getPrimaries(M.colorSpace),le=M.colorSpace===xs||fe===ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const Ce=M.isCompressedTexture||M.image[0].isCompressedTexture,ge=M.image[0]&&M.image[0].isDataTexture,ve=[];for(let ye=0;ye<6;ye++)!Ce&&!ge?ve[ye]=_(M.image[ye],!0,r.maxCubemapSize):ve[ye]=ge?M.image[ye].image:M.image[ye],ve[ye]=q(M,ve[ye]);const Me=ve[0],Pe=s.convert(M.format,M.colorSpace),Xe=s.convert(M.type),Ke=v(M.internalFormat,Pe,Xe,M.normalized,M.colorSpace),W=M.isVideoTexture!==!0,me=ce.__version===void 0||Z===!0,ee=ae.dataReady;let De=T(M,Me);Ne(n.TEXTURE_CUBE_MAP,M);let Ae;if(Ce){W&&me&&t.texStorage2D(n.TEXTURE_CUBE_MAP,De,Ke,Me.width,Me.height);for(let ye=0;ye<6;ye++){Ae=ve[ye].mipmaps;for(let Ee=0;Ee<Ae.length;Ee++){const Re=Ae[Ee];M.format!==Ji?Pe!==null?W?ee&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee,0,0,Re.width,Re.height,Pe,Re.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee,Ke,Re.width,Re.height,0,Re.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee,0,0,Re.width,Re.height,Pe,Xe,Re.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee,Ke,Re.width,Re.height,0,Pe,Xe,Re.data)}}}else{if(Ae=M.mipmaps,W&&me){Ae.length>0&&De++;const ye=he(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,De,Ke,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(ge){W?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,ve[ye].width,ve[ye].height,Pe,Xe,ve[ye].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ke,ve[ye].width,ve[ye].height,0,Pe,Xe,ve[ye].data);for(let Ee=0;Ee<Ae.length;Ee++){const je=Ae[Ee].image[ye].image;W?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee+1,0,0,je.width,je.height,Pe,Xe,je.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee+1,Ke,je.width,je.height,0,Pe,Xe,je.data)}}else{W?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Pe,Xe,ve[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ke,Pe,Xe,ve[ye]);for(let Ee=0;Ee<Ae.length;Ee++){const Re=Ae[Ee];W?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee+1,0,0,Pe,Xe,Re.image[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ee+1,Ke,Pe,Xe,Re.image[ye])}}}g(M)&&y(n.TEXTURE_CUBE_MAP),ce.__version=ae.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function Te(w,M,G,Z,ae,ce){const fe=s.convert(G.format,G.colorSpace),ie=s.convert(G.type),le=v(G.internalFormat,fe,ie,G.normalized,G.colorSpace),Ce=i.get(M),ge=i.get(G);if(ge.__renderTarget=M,!Ce.__hasExternalTextures){const ve=Math.max(1,M.width>>ce),Me=Math.max(1,M.height>>ce);ae===n.TEXTURE_3D||ae===n.TEXTURE_2D_ARRAY?t.texImage3D(ae,ce,le,ve,Me,M.depth,0,fe,ie,null):t.texImage2D(ae,ce,le,ve,Me,0,fe,ie,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),Y(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,ae,ge.__webglTexture,0,K(M)):(ae===n.TEXTURE_2D||ae>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,ae,ge.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Be(w,M,G){if(n.bindRenderbuffer(n.RENDERBUFFER,w),M.depthBuffer){const Z=M.depthTexture,ae=Z&&Z.isDepthTexture?Z.type:null,ce=b(M.stencilBuffer,ae),fe=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Y(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K(M),ce,M.width,M.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,K(M),ce,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ce,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,w)}else{const Z=M.textures;for(let ae=0;ae<Z.length;ae++){const ce=Z[ae],fe=s.convert(ce.format,ce.colorSpace),ie=s.convert(ce.type),le=v(ce.internalFormat,fe,ie,ce.normalized,ce.colorSpace);Y(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K(M),le,M.width,M.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,K(M),le,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,le,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function P(w,M,G){const Z=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ae=i.get(M.depthTexture);if(ae.__renderTarget=M,(!ae.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Z){if(ae.__webglInit===void 0&&(ae.__webglInit=!0,M.depthTexture.addEventListener("dispose",A)),ae.__webglTexture===void 0){ae.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ae.__webglTexture),Ne(n.TEXTURE_CUBE_MAP,M.depthTexture);const Ce=s.convert(M.depthTexture.format),ge=s.convert(M.depthTexture.type);let ve;M.depthTexture.format===ts?ve=n.DEPTH_COMPONENT24:M.depthTexture.format===so&&(ve=n.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,ve,M.width,M.height,0,Ce,ge,null)}}else H(M.depthTexture,0);const ce=ae.__webglTexture,fe=K(M),ie=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+G:n.TEXTURE_2D,le=M.depthTexture.format===so?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===ts)Y(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,le,ie,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,le,ie,ce,0);else if(M.depthTexture.format===so)Y(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,le,ie,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,le,ie,ce,0);else throw new Error("Unknown depthTexture format")}function B(w){const M=i.get(w),G=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const Z=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Z){const ae=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Z.removeEventListener("dispose",ae)};Z.addEventListener("dispose",ae),M.__depthDisposeCallback=ae}M.__boundDepthTexture=Z}if(w.depthTexture&&!M.__autoAllocateDepthBuffer)if(G)for(let Z=0;Z<6;Z++)P(M.__webglFramebuffer[Z],w,Z);else{const Z=w.texture.mipmaps;Z&&Z.length>0?P(M.__webglFramebuffer[0],w,0):P(M.__webglFramebuffer,w,0)}else if(G){M.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[Z]),M.__webglDepthbuffer[Z]===void 0)M.__webglDepthbuffer[Z]=n.createRenderbuffer(),Be(M.__webglDepthbuffer[Z],w,!1);else{const ae=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ae,n.RENDERBUFFER,ce)}}else{const Z=w.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),Be(M.__webglDepthbuffer,w,!1);else{const ae=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ae,n.RENDERBUFFER,ce)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function $(w,M,G){const Z=i.get(w);M!==void 0&&Te(Z.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&B(w)}function Q(w){const M=w.texture,G=i.get(w),Z=i.get(M);w.addEventListener("dispose",S);const ae=w.textures,ce=w.isWebGLCubeRenderTarget===!0,fe=ae.length>1;if(fe||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=M.version,o.memory.textures++),ce){G.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[ie]=[];for(let le=0;le<M.mipmaps.length;le++)G.__webglFramebuffer[ie][le]=n.createFramebuffer()}else G.__webglFramebuffer[ie]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)G.__webglFramebuffer[ie]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(fe)for(let ie=0,le=ae.length;ie<le;ie++){const Ce=i.get(ae[ie]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),o.memory.textures++)}if(w.samples>0&&Y(w)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ie=0;ie<ae.length;ie++){const le=ae[ie];G.__webglColorRenderbuffer[ie]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[ie]);const Ce=s.convert(le.format,le.colorSpace),ge=s.convert(le.type),ve=v(le.internalFormat,Ce,ge,le.normalized,le.colorSpace,w.isXRRenderTarget===!0),Me=K(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,Me,ve,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ie,n.RENDERBUFFER,G.__webglColorRenderbuffer[ie])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),Be(G.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Ne(n.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)Te(G.__webglFramebuffer[ie][le],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,le);else Te(G.__webglFramebuffer[ie],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);g(M)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let ie=0,le=ae.length;ie<le;ie++){const Ce=ae[ie],ge=i.get(Ce);let ve=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ve=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ve,ge.__webglTexture),Ne(ve,Ce),Te(G.__webglFramebuffer,w,Ce,n.COLOR_ATTACHMENT0+ie,ve,0),g(Ce)&&y(ve)}t.unbindTexture()}else{let ie=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ie=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,Z.__webglTexture),Ne(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)Te(G.__webglFramebuffer[le],w,M,n.COLOR_ATTACHMENT0,ie,le);else Te(G.__webglFramebuffer,w,M,n.COLOR_ATTACHMENT0,ie,0);g(M)&&y(ie),t.unbindTexture()}w.depthBuffer&&B(w)}function U(w){const M=w.textures;for(let G=0,Z=M.length;G<Z;G++){const ae=M[G];if(g(ae)){const ce=x(w),fe=i.get(ae).__webglTexture;t.bindTexture(ce,fe),y(ce),t.unbindTexture()}}}const oe=[],be=[];function I(w){if(w.samples>0){if(Y(w)===!1){const M=w.textures,G=w.width,Z=w.height;let ae=n.COLOR_BUFFER_BIT;const ce=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=i.get(w),ie=M.length>1;if(ie)for(let Ce=0;Ce<M.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);const le=w.texture.mipmaps;le&&le.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let Ce=0;Ce<M.length;Ce++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ae|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ae|=n.STENCIL_BUFFER_BIT)),ie){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,fe.__webglColorRenderbuffer[Ce]);const ge=i.get(M[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ge,0)}n.blitFramebuffer(0,0,G,Z,0,0,G,Z,ae,n.NEAREST),l===!0&&(oe.length=0,be.length=0,oe.push(n.COLOR_ATTACHMENT0+Ce),w.depthBuffer&&w.resolveDepthBuffer===!1&&(oe.push(ce),be.push(ce),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,be)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,oe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ie)for(let Ce=0;Ce<M.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,fe.__webglColorRenderbuffer[Ce]);const ge=i.get(M[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,ge,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const M=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function K(w){return Math.min(r.maxSamples,w.samples)}function Y(w){const M=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function pe(w){const M=o.render.frame;u.get(w)!==M&&(u.set(w,M),w.update())}function q(w,M){const G=w.colorSpace,Z=w.format,ae=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||G!==Wu&&G!==xs&&(ft.getTransfer(G)===At?(Z!==Ji||ae!==zi)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):pt("WebGLTextures: Unsupported texture color space:",G)),M}function he(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=V,this.getTextureUnits=z,this.setTextureUnits=O,this.setTexture2D=H,this.setTexture2DArray=X,this.setTexture3D=L,this.setTextureCube=ue,this.rebindTextures=$,this.setupRenderTarget=Q,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=I,this.setupDepthRenderbuffer=B,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=Y,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function hL(n,e){function t(i,r=xs){let s;const o=ft.getTransfer(r);if(i===zi)return n.UNSIGNED_BYTE;if(i===wm)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Am)return n.UNSIGNED_SHORT_5_5_5_1;if(i===iS)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===rS)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===tS)return n.BYTE;if(i===nS)return n.SHORT;if(i===Yl)return n.UNSIGNED_SHORT;if(i===Tm)return n.INT;if(i===Er)return n.UNSIGNED_INT;if(i===mr)return n.FLOAT;if(i===es)return n.HALF_FLOAT;if(i===sS)return n.ALPHA;if(i===oS)return n.RGB;if(i===Ji)return n.RGBA;if(i===ts)return n.DEPTH_COMPONENT;if(i===so)return n.DEPTH_STENCIL;if(i===aS)return n.RED;if(i===Rm)return n.RED_INTEGER;if(i===wo)return n.RG;if(i===Cm)return n.RG_INTEGER;if(i===Pm)return n.RGBA_INTEGER;if(i===hu||i===du||i===pu||i===mu)if(o===At)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===hu)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===du)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===mu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===hu)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===du)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pu)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===mu)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bd||i===kd||i===Hd||i===zd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Bd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===kd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Hd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===zd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Vd||i===Gd||i===Wd||i===Xd||i===$d||i===Vu||i===qd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Vd||i===Gd)return o===At?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Wd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Xd)return s.COMPRESSED_R11_EAC;if(i===$d)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Vu)return s.COMPRESSED_RG11_EAC;if(i===qd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Yd||i===jd||i===Kd||i===Zd||i===Jd||i===Qd||i===ep||i===tp||i===np||i===ip||i===rp||i===sp||i===op||i===ap)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Yd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Kd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Jd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qd)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ep)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===tp)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===np)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ip)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rp)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sp)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===op)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ap)return o===At?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===lp||i===cp||i===up)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===lp)return o===At?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===cp)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===up)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fp||i===hp||i===Gu||i===dp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===fp)return s.COMPRESSED_RED_RGTC1_EXT;if(i===hp)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Gu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===dp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===jl?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const dL=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,pL=`
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

}`;class mL{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new _S(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new tr({vertexShader:dL,fragmentShader:pL,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ns(new vf(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _L extends Co{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,p=null;const m=typeof XRWebGLBinding<"u",_=new mL,g={},y=t.getContextAttributes();let x=null,v=null;const b=[],T=[],A=new Et;let S=null;const E=new Hi;E.viewport=new tn;const R=new Hi;R.viewport=new tn;const D=[E,R],N=new EC;let V=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let xe=b[ne];return xe===void 0&&(xe=new ch,b[ne]=xe),xe.getTargetRaySpace()},this.getControllerGrip=function(ne){let xe=b[ne];return xe===void 0&&(xe=new ch,b[ne]=xe),xe.getGripSpace()},this.getHand=function(ne){let xe=b[ne];return xe===void 0&&(xe=new ch,b[ne]=xe),xe.getHandSpace()};function O(ne){const xe=T.indexOf(ne.inputSource);if(xe===-1)return;const _e=b[xe];_e!==void 0&&(_e.update(ne.inputSource,ne.frame,c||o),_e.dispatchEvent({type:ne.type,data:ne.inputSource}))}function F(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",k);for(let ne=0;ne<b.length;ne++){const xe=T[ne];xe!==null&&(T[ne]=null,b[ne].disconnect(xe))}V=null,z=null,_.reset();for(const ne in g)delete g[ne];e.setRenderTarget(x),h=null,f=null,d=null,r=null,v=null,Ne.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){s=ne,i.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){a=ne,i.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&m&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(ne){if(r=ne,r!==null){if(x=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",F),r.addEventListener("inputsourceschange",k),y.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(A),m&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Le=null,we=null;y.depth&&(we=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=y.stencil?so:ts,Le=y.stencil?jl:Er);const Te={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(Te),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new yr(f.textureWidth,f.textureHeight,{format:Ji,type:zi,depthTexture:new Ua(f.textureWidth,f.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const _e={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,t,_e),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),v=new yr(h.framebufferWidth,h.framebufferHeight,{format:Ji,type:zi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ne.setContext(r),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(ne){for(let xe=0;xe<ne.removed.length;xe++){const _e=ne.removed[xe],Le=T.indexOf(_e);Le>=0&&(T[Le]=null,b[Le].disconnect(_e))}for(let xe=0;xe<ne.added.length;xe++){const _e=ne.added[xe];let Le=T.indexOf(_e);if(Le===-1){for(let Te=0;Te<b.length;Te++)if(Te>=T.length){T.push(_e),Le=Te;break}else if(T[Te]===null){T[Te]=_e,Le=Te;break}if(Le===-1)break}const we=b[Le];we&&we.connect(_e)}}const H=new re,X=new re;function L(ne,xe,_e){H.setFromMatrixPosition(xe.matrixWorld),X.setFromMatrixPosition(_e.matrixWorld);const Le=H.distanceTo(X),we=xe.projectionMatrix.elements,Te=_e.projectionMatrix.elements,Be=we[14]/(we[10]-1),P=we[14]/(we[10]+1),B=(we[9]+1)/we[5],$=(we[9]-1)/we[5],Q=(we[8]-1)/we[0],U=(Te[8]+1)/Te[0],oe=Be*Q,be=Be*U,I=Le/(-Q+U),K=I*-Q;if(xe.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(K),ne.translateZ(I),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),we[10]===-1)ne.projectionMatrix.copy(xe.projectionMatrix),ne.projectionMatrixInverse.copy(xe.projectionMatrixInverse);else{const Y=Be+I,pe=P+I,q=oe-K,he=be+(Le-K),w=B*P/pe*Y,M=$*P/pe*Y;ne.projectionMatrix.makePerspective(q,he,w,M,Y,pe),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function ue(ne,xe){xe===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(xe.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(r===null)return;let xe=ne.near,_e=ne.far;_.texture!==null&&(_.depthNear>0&&(xe=_.depthNear),_.depthFar>0&&(_e=_.depthFar)),N.near=R.near=E.near=xe,N.far=R.far=E.far=_e,(V!==N.near||z!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),V=N.near,z=N.far),N.layers.mask=ne.layers.mask|6,E.layers.mask=N.layers.mask&-5,R.layers.mask=N.layers.mask&-3;const Le=ne.parent,we=N.cameras;ue(N,Le);for(let Te=0;Te<we.length;Te++)ue(we[Te],Le);we.length===2?L(N,E,R):N.projectionMatrix.copy(E.projectionMatrix),de(ne,N,Le)};function de(ne,xe,_e){_e===null?ne.matrix.copy(xe.matrixWorld):(ne.matrix.copy(_e.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(xe.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(xe.projectionMatrix),ne.projectionMatrixInverse.copy(xe.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=mp*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(ne){l=ne,f!==null&&(f.fixedFoveation=ne),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=ne)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(N)},this.getCameraTexture=function(ne){return g[ne]};let ke=null;function ze(ne,xe){if(u=xe.getViewerPose(c||o),p=xe,u!==null){const _e=u.views;h!==null&&(e.setRenderTargetFramebuffer(v,h.framebuffer),e.setRenderTarget(v));let Le=!1;_e.length!==N.cameras.length&&(N.cameras.length=0,Le=!0);for(let P=0;P<_e.length;P++){const B=_e[P];let $=null;if(h!==null)$=h.getViewport(B);else{const U=d.getViewSubImage(f,B);$=U.viewport,P===0&&(e.setRenderTargetTextures(v,U.colorTexture,U.depthStencilTexture),e.setRenderTarget(v))}let Q=D[P];Q===void 0&&(Q=new Hi,Q.layers.enable(P),Q.viewport=new tn,D[P]=Q),Q.matrix.fromArray(B.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(B.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set($.x,$.y,$.width,$.height),P===0&&(N.matrix.copy(Q.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Le===!0&&N.cameras.push(Q)}const we=r.enabledFeatures;if(we&&we.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&m){d=i.getBinding();const P=d.getDepthInformation(_e[0]);P&&P.isValid&&P.texture&&_.init(P,r.renderState)}if(we&&we.includes("camera-access")&&m){e.state.unbindTexture(),d=i.getBinding();for(let P=0;P<_e.length;P++){const B=_e[P].camera;if(B){let $=g[B];$||($=new _S,g[B]=$);const Q=d.getCameraImage(B);$.sourceTexture=Q}}}}for(let _e=0;_e<b.length;_e++){const Le=T[_e],we=b[_e];Le!==null&&we!==void 0&&we.update(Le,xe,c||o)}ke&&ke(ne,xe),xe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:xe}),p=null}const Ne=new yS;Ne.setAnimationLoop(ze),this.setAnimationLoop=function(ne){ke=ne},this.dispose=function(){}}}const gL=new sn,AS=new tt;AS.set(-1,0,0,0,1,0,0,0,1);function vL(n,e){function t(_,g){_.matrixAutoUpdate===!0&&_.updateMatrix(),g.value.copy(_.matrix)}function i(_,g){g.color.getRGB(_.fogColor.value,gS(n)),g.isFog?(_.fogNear.value=g.near,_.fogFar.value=g.far):g.isFogExp2&&(_.fogDensity.value=g.density)}function r(_,g,y,x,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(_,g):g.isMeshLambertMaterial?(s(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(_,g),d(_,g)):g.isMeshPhongMaterial?(s(_,g),u(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(_,g),f(_,g),g.isMeshPhysicalMaterial&&h(_,g,v)):g.isMeshMatcapMaterial?(s(_,g),p(_,g)):g.isMeshDepthMaterial?s(_,g):g.isMeshDistanceMaterial?(s(_,g),m(_,g)):g.isMeshNormalMaterial?s(_,g):g.isLineBasicMaterial?(o(_,g),g.isLineDashedMaterial&&a(_,g)):g.isPointsMaterial?l(_,g,y,x):g.isSpriteMaterial?c(_,g):g.isShadowMaterial?(_.color.value.copy(g.color),_.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(_,g){_.opacity.value=g.opacity,g.color&&_.diffuse.value.copy(g.color),g.emissive&&_.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.bumpMap&&(_.bumpMap.value=g.bumpMap,t(g.bumpMap,_.bumpMapTransform),_.bumpScale.value=g.bumpScale,g.side===fi&&(_.bumpScale.value*=-1)),g.normalMap&&(_.normalMap.value=g.normalMap,t(g.normalMap,_.normalMapTransform),_.normalScale.value.copy(g.normalScale),g.side===fi&&_.normalScale.value.negate()),g.displacementMap&&(_.displacementMap.value=g.displacementMap,t(g.displacementMap,_.displacementMapTransform),_.displacementScale.value=g.displacementScale,_.displacementBias.value=g.displacementBias),g.emissiveMap&&(_.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,_.emissiveMapTransform)),g.specularMap&&(_.specularMap.value=g.specularMap,t(g.specularMap,_.specularMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest);const y=e.get(g),x=y.envMap,v=y.envMapRotation;x&&(_.envMap.value=x,_.envMapRotation.value.setFromMatrix4(gL.makeRotationFromEuler(v)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(AS),_.reflectivity.value=g.reflectivity,_.ior.value=g.ior,_.refractionRatio.value=g.refractionRatio),g.lightMap&&(_.lightMap.value=g.lightMap,_.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,_.lightMapTransform)),g.aoMap&&(_.aoMap.value=g.aoMap,_.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,_.aoMapTransform))}function o(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform))}function a(_,g){_.dashSize.value=g.dashSize,_.totalSize.value=g.dashSize+g.gapSize,_.scale.value=g.scale}function l(_,g,y,x){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.size.value=g.size*y,_.scale.value=x*.5,g.map&&(_.map.value=g.map,t(g.map,_.uvTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function c(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.rotation.value=g.rotation,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function u(_,g){_.specular.value.copy(g.specular),_.shininess.value=Math.max(g.shininess,1e-4)}function d(_,g){g.gradientMap&&(_.gradientMap.value=g.gradientMap)}function f(_,g){_.metalness.value=g.metalness,g.metalnessMap&&(_.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,_.metalnessMapTransform)),_.roughness.value=g.roughness,g.roughnessMap&&(_.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,_.roughnessMapTransform)),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)}function h(_,g,y){_.ior.value=g.ior,g.sheen>0&&(_.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),_.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(_.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,_.sheenColorMapTransform)),g.sheenRoughnessMap&&(_.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,_.sheenRoughnessMapTransform))),g.clearcoat>0&&(_.clearcoat.value=g.clearcoat,_.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(_.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,_.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(_.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===fi&&_.clearcoatNormalScale.value.negate())),g.dispersion>0&&(_.dispersion.value=g.dispersion),g.iridescence>0&&(_.iridescence.value=g.iridescence,_.iridescenceIOR.value=g.iridescenceIOR,_.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(_.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,_.iridescenceMapTransform)),g.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),g.transmission>0&&(_.transmission.value=g.transmission,_.transmissionSamplerMap.value=y.texture,_.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(_.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,_.transmissionMapTransform)),_.thickness.value=g.thickness,g.thicknessMap&&(_.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=g.attenuationDistance,_.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(_.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(_.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=g.specularIntensity,_.specularColor.value.copy(g.specularColor),g.specularColorMap&&(_.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,_.specularColorMapTransform)),g.specularIntensityMap&&(_.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,_.specularIntensityMapTransform))}function p(_,g){g.matcap&&(_.matcap.value=g.matcap)}function m(_,g){const y=e.get(g).light;_.referencePosition.value.setFromMatrixPosition(y.matrixWorld),_.nearDistance.value=y.shadow.camera.near,_.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function xL(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=r[y.id];v===void 0&&(p(y),v=u(y),r[y.id]=v,y.addEventListener("dispose",_));const b=x.program;i.updateUBOMapping(y,b);const T=e.render.frame;s[y.id]!==T&&(f(y),s[y.id]=T)}function u(y){const x=d();y.__bindingPointIndex=x;const v=n.createBuffer(),b=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,b,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return pt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const x=r[y.id],v=y.uniforms,b=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let T=0,A=v.length;T<A;T++){const S=Array.isArray(v[T])?v[T]:[v[T]];for(let E=0,R=S.length;E<R;E++){const D=S[E];if(h(D,T,E,b)===!0){const N=D.__offset,V=Array.isArray(D.value)?D.value:[D.value];let z=0;for(let O=0;O<V.length;O++){const F=V[O],k=m(F);typeof F=="number"||typeof F=="boolean"?(D.__data[0]=F,n.bufferSubData(n.UNIFORM_BUFFER,N+z,D.__data)):F.isMatrix3?(D.__data[0]=F.elements[0],D.__data[1]=F.elements[1],D.__data[2]=F.elements[2],D.__data[3]=0,D.__data[4]=F.elements[3],D.__data[5]=F.elements[4],D.__data[6]=F.elements[5],D.__data[7]=0,D.__data[8]=F.elements[6],D.__data[9]=F.elements[7],D.__data[10]=F.elements[8],D.__data[11]=0):ArrayBuffer.isView(F)?D.__data.set(new F.constructor(F.buffer,F.byteOffset,D.__data.length)):(F.toArray(D.__data,z),z+=k.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,N,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(y,x,v,b){const T=y.value,A=x+"_"+v;if(b[A]===void 0)return typeof T=="number"||typeof T=="boolean"?b[A]=T:ArrayBuffer.isView(T)?b[A]=T.slice():b[A]=T.clone(),!0;{const S=b[A];if(typeof T=="number"||typeof T=="boolean"){if(S!==T)return b[A]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(S.equals(T)===!1)return S.copy(T),!0}}return!1}function p(y){const x=y.uniforms;let v=0;const b=16;for(let A=0,S=x.length;A<S;A++){const E=Array.isArray(x[A])?x[A]:[x[A]];for(let R=0,D=E.length;R<D;R++){const N=E[R],V=Array.isArray(N.value)?N.value:[N.value];for(let z=0,O=V.length;z<O;z++){const F=V[z],k=m(F),H=v%b,X=H%k.boundary,L=H+X;v+=X,L!==0&&b-L<k.storage&&(v+=b-L),N.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=k.storage}}}const T=v%b;return T>0&&(v+=b-T),y.__size=v,y.__cache={},this}function m(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(x.boundary=16,x.storage=y.byteLength):Je("WebGLRenderer: Unsupported uniform value type.",y),x}function _(y){const x=y.target;x.removeEventListener("dispose",_);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function g(){for(const y in r)n.deleteBuffer(r[y]);o=[],r={},s={}}return{bind:l,update:c,dispose:g}}const yL=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let sr=null;function SL(){return sr===null&&(sr=new cC(yL,16,16,wo,es),sr.name="DFG_LUT",sr.minFilter=gn,sr.magFilter=gn,sr.wrapS=Zi,sr.wrapT=Zi,sr.generateMipmaps=!1,sr.needsUpdate=!0),sr}class ML{constructor(e={}){const{canvas:t=HR(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:h=zi}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const m=h,_=new Set([Pm,Cm,Rm]),g=new Set([zi,Er,Yl,jl,wm,Am]),y=new Uint32Array(4),x=new Int32Array(4),v=new re;let b=null,T=null;const A=[],S=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=xr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let D=!1,N=null;this._outputColorSpace=Oi;let V=0,z=0,O=null,F=-1,k=null;const H=new tn,X=new tn;let L=null;const ue=new bt(0);let de=0,ke=t.width,ze=t.height,Ne=1,ne=null,xe=null;const _e=new tn(0,0,ke,ze),Le=new tn(0,0,ke,ze);let we=!1;const Te=new pS;let Be=!1,P=!1;const B=new sn,$=new re,Q=new tn,U={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let oe=!1;function be(){return O===null?Ne:1}let I=i;function K(C,j){return t.getContext(C,j)}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Em}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Re,!1),I===null){const j="webgl2";if(I=K(j,C),I===null)throw K(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw pt("WebGLRenderer: "+C.message),C}let Y,pe,q,he,w,M,G,Z,ae,ce,fe,ie,le,Ce,ge,ve,Me,Pe,Xe,Ke,W,me,ee;function De(){Y=new S3(I),Y.init(),W=new hL(I,Y),pe=new d3(I,Y,e,W),q=new uL(I,Y),pe.reversedDepthBuffer&&f&&q.buffers.depth.setReversed(!0),he=new E3(I),w=new K2,M=new fL(I,Y,q,w,pe,W,he),G=new y3(R),Z=new RC(I),me=new f3(I,Z),ae=new M3(I,Z,he,me),ce=new w3(I,ae,Z,me,he),Pe=new T3(I,pe,M),ge=new p3(w),fe=new j2(R,G,Y,pe,me,ge),ie=new vL(R,w),le=new J2,Ce=new rL(Y),Me=new u3(R,G,q,ce,p,l),ve=new cL(R,ce,pe),ee=new xL(I,he,pe,q),Xe=new h3(I,Y,he),Ke=new b3(I,Y,he),he.programs=fe.programs,R.capabilities=pe,R.extensions=Y,R.properties=w,R.renderLists=le,R.shadowMap=ve,R.state=q,R.info=he}De(),m!==zi&&(E=new R3(m,t.width,t.height,r,s));const Ae=new _L(R,I);this.xr=Ae,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const C=Y.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Y.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return Ne},this.setPixelRatio=function(C){C!==void 0&&(Ne=C,this.setSize(ke,ze,!1))},this.getSize=function(C){return C.set(ke,ze)},this.setSize=function(C,j,se=!0){if(Ae.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}ke=C,ze=j,t.width=Math.floor(C*Ne),t.height=Math.floor(j*Ne),se===!0&&(t.style.width=C+"px",t.style.height=j+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,C,j)},this.getDrawingBufferSize=function(C){return C.set(ke*Ne,ze*Ne).floor()},this.setDrawingBufferSize=function(C,j,se){ke=C,ze=j,Ne=se,t.width=Math.floor(C*se),t.height=Math.floor(j*se),this.setViewport(0,0,C,j)},this.setEffects=function(C){if(m===zi){pt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let j=0;j<C.length;j++)if(C[j].isOutputPass===!0){Je("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(H)},this.getViewport=function(C){return C.copy(_e)},this.setViewport=function(C,j,se,J){C.isVector4?_e.set(C.x,C.y,C.z,C.w):_e.set(C,j,se,J),q.viewport(H.copy(_e).multiplyScalar(Ne).round())},this.getScissor=function(C){return C.copy(Le)},this.setScissor=function(C,j,se,J){C.isVector4?Le.set(C.x,C.y,C.z,C.w):Le.set(C,j,se,J),q.scissor(X.copy(Le).multiplyScalar(Ne).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(C){q.setScissorTest(we=C)},this.setOpaqueSort=function(C){ne=C},this.setTransparentSort=function(C){xe=C},this.getClearColor=function(C){return C.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(C=!0,j=!0,se=!0){let J=0;if(C){let te=!1;if(O!==null){const Ie=O.texture.format;te=_.has(Ie)}if(te){const Ie=O.texture.type,Ue=g.has(Ie),Oe=Me.getClearColor(),We=Me.getClearAlpha(),qe=Oe.r,nt=Oe.g,st=Oe.b;Ue?(y[0]=qe,y[1]=nt,y[2]=st,y[3]=We,I.clearBufferuiv(I.COLOR,0,y)):(x[0]=qe,x[1]=nt,x[2]=st,x[3]=We,I.clearBufferiv(I.COLOR,0,x))}else J|=I.COLOR_BUFFER_BIT}j&&(J|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),se&&(J|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),J!==0&&I.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),N=C},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Re,!1),Me.dispose(),le.dispose(),Ce.dispose(),w.dispose(),G.dispose(),ce.dispose(),me.dispose(),ee.dispose(),fe.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",at),Ae.removeEventListener("sessionend",Ht),zt.stop()};function ye(C){C.preventDefault(),wg("WebGLRenderer: Context Lost."),D=!0}function Ee(){wg("WebGLRenderer: Context Restored."),D=!1;const C=he.autoReset,j=ve.enabled,se=ve.autoUpdate,J=ve.needsUpdate,te=ve.type;De(),he.autoReset=C,ve.enabled=j,ve.autoUpdate=se,ve.needsUpdate=J,ve.type=te}function Re(C){pt("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function je(C){const j=C.target;j.removeEventListener("dispose",je),Se(j)}function Se(C){$e(C),w.remove(C)}function $e(C){const j=w.get(C).programs;j!==void 0&&(j.forEach(function(se){fe.releaseProgram(se)}),C.isShaderMaterial&&fe.releaseShaderCache(C))}this.renderBufferDirect=function(C,j,se,J,te,Ie){j===null&&(j=U);const Ue=te.isMesh&&te.matrixWorld.determinant()<0,Oe=Sn(C,j,se,J,te);q.setMaterial(J,Ue);let We=se.index,qe=1;if(J.wireframe===!0){if(We=ae.getWireframeAttribute(se),We===void 0)return;qe=2}const nt=se.drawRange,st=se.attributes.position;let Ye=nt.start*qe,Rt=(nt.start+nt.count)*qe;Ie!==null&&(Ye=Math.max(Ye,Ie.start*qe),Rt=Math.min(Rt,(Ie.start+Ie.count)*qe)),We!==null?(Ye=Math.max(Ye,0),Rt=Math.min(Rt,We.count)):st!=null&&(Ye=Math.max(Ye,0),Rt=Math.min(Rt,st.count));const Kt=Rt-Ye;if(Kt<0||Kt===1/0)return;me.setup(te,J,Oe,se,We);let qt,Dt=Xe;if(We!==null&&(qt=Z.get(We),Dt=Ke,Dt.setIndex(qt)),te.isMesh)J.wireframe===!0?(q.setLineWidth(J.wireframeLinewidth*be()),Dt.setMode(I.LINES)):Dt.setMode(I.TRIANGLES);else if(te.isLine){let Nn=J.linewidth;Nn===void 0&&(Nn=1),q.setLineWidth(Nn*be()),te.isLineSegments?Dt.setMode(I.LINES):te.isLineLoop?Dt.setMode(I.LINE_LOOP):Dt.setMode(I.LINE_STRIP)}else te.isPoints?Dt.setMode(I.POINTS):te.isSprite&&Dt.setMode(I.TRIANGLES);if(te.isBatchedMesh)if(Y.get("WEBGL_multi_draw"))Dt.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const Nn=te._multiDrawStarts,Ve=te._multiDrawCounts,mi=te._multiDrawCount,mt=We?Z.get(We).bytesPerElement:1,Ii=w.get(J).currentProgram.getUniforms();for(let ir=0;ir<mi;ir++)Ii.setValue(I,"_gl_DrawID",ir),Dt.render(Nn[ir]/mt,Ve[ir])}else if(te.isInstancedMesh)Dt.renderInstances(Ye,Kt,te.count);else if(se.isInstancedBufferGeometry){const Nn=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Ve=Math.min(se.instanceCount,Nn);Dt.renderInstances(Ye,Kt,Ve)}else Dt.render(Ye,Kt)};function He(C,j,se){C.transparent===!0&&C.side===Hr&&C.forceSinglePass===!1?(C.side=fi,C.needsUpdate=!0,yn(C,j,se),C.side=Bs,C.needsUpdate=!0,yn(C,j,se),C.side=Hr):yn(C,j,se)}this.compile=function(C,j,se=null){se===null&&(se=C),T=Ce.get(se),T.init(j),S.push(T),se.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(T.pushLight(te),te.castShadow&&T.pushShadow(te))}),C!==se&&C.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(T.pushLight(te),te.castShadow&&T.pushShadow(te))}),T.setupLights();const J=new Set;return C.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Ie=te.material;if(Ie)if(Array.isArray(Ie))for(let Ue=0;Ue<Ie.length;Ue++){const Oe=Ie[Ue];He(Oe,se,te),J.add(Oe)}else He(Ie,se,te),J.add(Ie)}),T=S.pop(),J},this.compileAsync=function(C,j,se=null){const J=this.compile(C,j,se);return new Promise(te=>{function Ie(){if(J.forEach(function(Ue){w.get(Ue).currentProgram.isReady()&&J.delete(Ue)}),J.size===0){te(C);return}setTimeout(Ie,10)}Y.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let Qe=null;function on(C){Qe&&Qe(C)}function at(){zt.stop()}function Ht(){zt.start()}const zt=new yS;zt.setAnimationLoop(on),typeof self<"u"&&zt.setContext(self),this.setAnimationLoop=function(C){Qe=C,Ae.setAnimationLoop(C),C===null?zt.stop():zt.start()},Ae.addEventListener("sessionstart",at),Ae.addEventListener("sessionend",Ht),this.render=function(C,j){if(j!==void 0&&j.isCamera!==!0){pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(C,j);const se=Ae.enabled===!0&&Ae.isPresenting===!0,J=E!==null&&(O===null||se)&&E.begin(R,O);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(j),j=Ae.getCamera()),C.isScene===!0&&C.onBeforeRender(R,C,j,O),T=Ce.get(C,S.length),T.init(j),T.state.textureUnits=M.getTextureUnits(),S.push(T),B.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Te.setFromProjectionMatrix(B,_r,j.reversedDepth),P=this.localClippingEnabled,Be=ge.init(this.clippingPlanes,P),b=le.get(C,A.length),b.init(),A.push(b),Ae.enabled===!0&&Ae.isPresenting===!0){const Ue=R.xr.getDepthSensingMesh();Ue!==null&&Ut(Ue,j,-1/0,R.sortObjects)}Ut(C,j,0,R.sortObjects),b.finish(),R.sortObjects===!0&&b.sort(ne,xe),oe=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,oe&&Me.addToRenderList(b,C),this.info.render.frame++,Be===!0&&ge.beginShadows();const te=T.state.shadowsArray;if(ve.render(te,C,j),Be===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(J&&E.hasRenderPass())===!1){const Ue=b.opaque,Oe=b.transmissive;if(T.setupLights(),j.isArrayCamera){const We=j.cameras;if(Oe.length>0)for(let qe=0,nt=We.length;qe<nt;qe++){const st=We[qe];xt(Ue,Oe,C,st)}oe&&Me.render(C);for(let qe=0,nt=We.length;qe<nt;qe++){const st=We[qe];Pt(b,C,st,st.viewport)}}else Oe.length>0&&xt(Ue,Oe,C,j),oe&&Me.render(C),Pt(b,C,j)}O!==null&&z===0&&(M.updateMultisampleRenderTarget(O),M.updateRenderTargetMipmap(O)),J&&E.end(R),C.isScene===!0&&C.onAfterRender(R,C,j),me.resetDefaultState(),F=-1,k=null,S.pop(),S.length>0?(T=S[S.length-1],M.setTextureUnits(T.state.textureUnits),Be===!0&&ge.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?b=A[A.length-1]:b=null,N!==null&&N.renderEnd()};function Ut(C,j,se,J){if(C.visible===!1)return;if(C.layers.test(j.layers)){if(C.isGroup)se=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(j);else if(C.isLightProbeGrid)T.pushLightProbeGrid(C);else if(C.isLight)T.pushLight(C),C.castShadow&&T.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Te.intersectsSprite(C)){J&&Q.setFromMatrixPosition(C.matrixWorld).applyMatrix4(B);const Ue=ce.update(C),Oe=C.material;Oe.visible&&b.push(C,Ue,Oe,se,Q.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Te.intersectsObject(C))){const Ue=ce.update(C),Oe=C.material;if(J&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Q.copy(C.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),Q.copy(Ue.boundingSphere.center)),Q.applyMatrix4(C.matrixWorld).applyMatrix4(B)),Array.isArray(Oe)){const We=Ue.groups;for(let qe=0,nt=We.length;qe<nt;qe++){const st=We[qe],Ye=Oe[st.materialIndex];Ye&&Ye.visible&&b.push(C,Ue,Ye,se,Q.z,st)}}else Oe.visible&&b.push(C,Ue,Oe,se,Q.z,null)}}const Ie=C.children;for(let Ue=0,Oe=Ie.length;Ue<Oe;Ue++)Ut(Ie[Ue],j,se,J)}function Pt(C,j,se,J){const{opaque:te,transmissive:Ie,transparent:Ue}=C;T.setupLightsView(se),Be===!0&&ge.setGlobalState(R.clippingPlanes,se),J&&q.viewport(H.copy(J)),te.length>0&&In(te,j,se),Ie.length>0&&In(Ie,j,se),Ue.length>0&&In(Ue,j,se),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function xt(C,j,se,J){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[J.id]===void 0){const Ye=Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[J.id]=new yr(1,1,{generateMipmaps:!0,type:Ye?es:zi,minFilter:ws,samples:Math.max(4,pe.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ft.workingColorSpace})}const Ie=T.state.transmissionRenderTarget[J.id],Ue=J.viewport||H;Ie.setSize(Ue.z*R.transmissionResolutionScale,Ue.w*R.transmissionResolutionScale);const Oe=R.getRenderTarget(),We=R.getActiveCubeFace(),qe=R.getActiveMipmapLevel();R.setRenderTarget(Ie),R.getClearColor(ue),de=R.getClearAlpha(),de<1&&R.setClearColor(16777215,.5),R.clear(),oe&&Me.render(se);const nt=R.toneMapping;R.toneMapping=xr;const st=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),T.setupLightsView(J),Be===!0&&ge.setGlobalState(R.clippingPlanes,J),In(C,se,J),M.updateMultisampleRenderTarget(Ie),M.updateRenderTargetMipmap(Ie),Y.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let Rt=0,Kt=j.length;Rt<Kt;Rt++){const qt=j[Rt],{object:Dt,geometry:Nn,material:Ve,group:mi}=qt;if(Ve.side===Hr&&Dt.layers.test(J.layers)){const mt=Ve.side;Ve.side=fi,Ve.needsUpdate=!0,Ft(Dt,se,J,Nn,Ve,mi),Ve.side=mt,Ve.needsUpdate=!0,Ye=!0}}Ye===!0&&(M.updateMultisampleRenderTarget(Ie),M.updateRenderTargetMipmap(Ie))}R.setRenderTarget(Oe,We,qe),R.setClearColor(ue,de),st!==void 0&&(J.viewport=st),R.toneMapping=nt}function In(C,j,se){const J=j.isScene===!0?j.overrideMaterial:null;for(let te=0,Ie=C.length;te<Ie;te++){const Ue=C[te],{object:Oe,geometry:We,group:qe}=Ue;let nt=Ue.material;nt.allowOverride===!0&&J!==null&&(nt=J),Oe.layers.test(se.layers)&&Ft(Oe,j,se,We,nt,qe)}}function Ft(C,j,se,J,te,Ie){C.onBeforeRender(R,j,se,J,te,Ie),C.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),te.onBeforeRender(R,j,se,J,C,Ie),te.transparent===!0&&te.side===Hr&&te.forceSinglePass===!1?(te.side=fi,te.needsUpdate=!0,R.renderBufferDirect(se,j,J,te,C,Ie),te.side=Bs,te.needsUpdate=!0,R.renderBufferDirect(se,j,J,te,C,Ie),te.side=Hr):R.renderBufferDirect(se,j,J,te,C,Ie),C.onAfterRender(R,j,se,J,te,Ie)}function yn(C,j,se){j.isScene!==!0&&(j=U);const J=w.get(C),te=T.state.lights,Ie=T.state.shadowsArray,Ue=te.state.version,Oe=fe.getParameters(C,te.state,Ie,j,se,T.state.lightProbeGridArray),We=fe.getProgramCacheKey(Oe);let qe=J.programs;J.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?j.environment:null,J.fog=j.fog;const nt=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;J.envMap=G.get(C.envMap||J.environment,nt),J.envMapRotation=J.environment!==null&&C.envMap===null?j.environmentRotation:C.envMapRotation,qe===void 0&&(C.addEventListener("dispose",je),qe=new Map,J.programs=qe);let st=qe.get(We);if(st!==void 0){if(J.currentProgram===st&&J.lightsStateVersion===Ue)return an(C,Oe),st}else Oe.uniforms=fe.getUniforms(C),N!==null&&C.isNodeMaterial&&N.build(C,se,Oe),C.onBeforeCompile(Oe,R),st=fe.acquireProgram(Oe,We),qe.set(We,st),J.uniforms=Oe.uniforms;const Ye=J.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ye.clippingPlanes=ge.uniform),an(C,Oe),J.needsLights=Po(C),J.lightsStateVersion=Ue,J.needsLights&&(Ye.ambientLightColor.value=te.state.ambient,Ye.lightProbe.value=te.state.probe,Ye.directionalLights.value=te.state.directional,Ye.directionalLightShadows.value=te.state.directionalShadow,Ye.spotLights.value=te.state.spot,Ye.spotLightShadows.value=te.state.spotShadow,Ye.rectAreaLights.value=te.state.rectArea,Ye.ltc_1.value=te.state.rectAreaLTC1,Ye.ltc_2.value=te.state.rectAreaLTC2,Ye.pointLights.value=te.state.point,Ye.pointLightShadows.value=te.state.pointShadow,Ye.hemisphereLights.value=te.state.hemi,Ye.directionalShadowMatrix.value=te.state.directionalShadowMatrix,Ye.spotLightMatrix.value=te.state.spotLightMatrix,Ye.spotLightMap.value=te.state.spotLightMap,Ye.pointShadowMatrix.value=te.state.pointShadowMatrix),J.lightProbeGrid=T.state.lightProbeGridArray.length>0,J.currentProgram=st,J.uniformsList=null,st}function pi(C){if(C.uniformsList===null){const j=C.currentProgram.getUniforms();C.uniformsList=_u.seqWithValue(j.seq,C.uniforms)}return C.uniformsList}function an(C,j){const se=w.get(C);se.outputColorSpace=j.outputColorSpace,se.batching=j.batching,se.batchingColor=j.batchingColor,se.instancing=j.instancing,se.instancingColor=j.instancingColor,se.instancingMorph=j.instancingMorph,se.skinning=j.skinning,se.morphTargets=j.morphTargets,se.morphNormals=j.morphNormals,se.morphColors=j.morphColors,se.morphTargetsCount=j.morphTargetsCount,se.numClippingPlanes=j.numClippingPlanes,se.numIntersection=j.numClipIntersection,se.vertexAlphas=j.vertexAlphas,se.vertexTangents=j.vertexTangents,se.toneMapping=j.toneMapping}function hn(C,j){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;v.setFromMatrixPosition(j.matrixWorld);for(let se=0,J=C.length;se<J;se++){const te=C[se];if(te.texture!==null&&te.boundingBox.containsPoint(v))return te}return null}function Sn(C,j,se,J,te){j.isScene!==!0&&(j=U),M.resetTextureUnits();const Ie=j.fog,Ue=J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial?j.environment:null,Oe=O===null?R.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:ft.workingColorSpace,We=J.isMeshStandardMaterial||J.isMeshLambertMaterial&&!J.envMap||J.isMeshPhongMaterial&&!J.envMap,qe=G.get(J.envMap||Ue,We),nt=J.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,st=!!se.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ye=!!se.morphAttributes.position,Rt=!!se.morphAttributes.normal,Kt=!!se.morphAttributes.color;let qt=xr;J.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(qt=R.toneMapping);const Dt=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,Nn=Dt!==void 0?Dt.length:0,Ve=w.get(J),mi=T.state.lights;if(Be===!0&&(P===!0||C!==k)){const Ot=C===k&&J.id===F;ge.setState(J,C,Ot)}let mt=!1;J.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==mi.state.version||Ve.outputColorSpace!==Oe||te.isBatchedMesh&&Ve.batching===!1||!te.isBatchedMesh&&Ve.batching===!0||te.isBatchedMesh&&Ve.batchingColor===!0&&te.colorTexture===null||te.isBatchedMesh&&Ve.batchingColor===!1&&te.colorTexture!==null||te.isInstancedMesh&&Ve.instancing===!1||!te.isInstancedMesh&&Ve.instancing===!0||te.isSkinnedMesh&&Ve.skinning===!1||!te.isSkinnedMesh&&Ve.skinning===!0||te.isInstancedMesh&&Ve.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&Ve.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&Ve.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&Ve.instancingMorph===!1&&te.morphTexture!==null||Ve.envMap!==qe||J.fog===!0&&Ve.fog!==Ie||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==ge.numPlanes||Ve.numIntersection!==ge.numIntersection)||Ve.vertexAlphas!==nt||Ve.vertexTangents!==st||Ve.morphTargets!==Ye||Ve.morphNormals!==Rt||Ve.morphColors!==Kt||Ve.toneMapping!==qt||Ve.morphTargetsCount!==Nn||!!Ve.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Ve.__version=J.version);let Ii=Ve.currentProgram;mt===!0&&(Ii=yn(J,j,te),N&&J.isNodeMaterial&&N.onUpdateProgram(J,Ii,Ve));let ir=!1,rs=!1,Do=!1;const Lt=Ii.getUniforms(),Zt=Ve.uniforms;if(q.useProgram(Ii.program)&&(ir=!0,rs=!0,Do=!0),J.id!==F&&(F=J.id,rs=!0),Ve.needsLights){const Ot=hn(T.state.lightProbeGridArray,te);Ve.lightProbeGrid!==Ot&&(Ve.lightProbeGrid=Ot,rs=!0)}if(ir||k!==C){q.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Lt.setValue(I,"projectionMatrix",C.projectionMatrix),Lt.setValue(I,"viewMatrix",C.matrixWorldInverse);const os=Lt.map.cameraPosition;os!==void 0&&os.setValue(I,$.setFromMatrixPosition(C.matrixWorld)),pe.logarithmicDepthBuffer&&Lt.setValue(I,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&Lt.setValue(I,"isOrthographic",C.isOrthographicCamera===!0),k!==C&&(k=C,rs=!0,Do=!0)}if(Ve.needsLights&&(mi.state.directionalShadowMap.length>0&&Lt.setValue(I,"directionalShadowMap",mi.state.directionalShadowMap,M),mi.state.spotShadowMap.length>0&&Lt.setValue(I,"spotShadowMap",mi.state.spotShadowMap,M),mi.state.pointShadowMap.length>0&&Lt.setValue(I,"pointShadowMap",mi.state.pointShadowMap,M)),te.isSkinnedMesh){Lt.setOptional(I,te,"bindMatrix"),Lt.setOptional(I,te,"bindMatrixInverse");const Ot=te.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Lt.setValue(I,"boneTexture",Ot.boneTexture,M))}te.isBatchedMesh&&(Lt.setOptional(I,te,"batchingTexture"),Lt.setValue(I,"batchingTexture",te._matricesTexture,M),Lt.setOptional(I,te,"batchingIdTexture"),Lt.setValue(I,"batchingIdTexture",te._indirectTexture,M),Lt.setOptional(I,te,"batchingColorTexture"),te._colorsTexture!==null&&Lt.setValue(I,"batchingColorTexture",te._colorsTexture,M));const ss=se.morphAttributes;if((ss.position!==void 0||ss.normal!==void 0||ss.color!==void 0)&&Pe.update(te,se,Ii),(rs||Ve.receiveShadow!==te.receiveShadow)&&(Ve.receiveShadow=te.receiveShadow,Lt.setValue(I,"receiveShadow",te.receiveShadow)),(J.isMeshStandardMaterial||J.isMeshLambertMaterial||J.isMeshPhongMaterial)&&J.envMap===null&&j.environment!==null&&(Zt.envMapIntensity.value=j.environmentIntensity),Zt.dfgLUT!==void 0&&(Zt.dfgLUT.value=SL()),rs){if(Lt.setValue(I,"toneMappingExposure",R.toneMappingExposure),Ve.needsLights&&wr(Zt,Do),Ie&&J.fog===!0&&ie.refreshFogUniforms(Zt,Ie),ie.refreshMaterialUniforms(Zt,J,Ne,ze,T.state.transmissionRenderTarget[C.id]),Ve.needsLights&&Ve.lightProbeGrid){const Ot=Ve.lightProbeGrid;Zt.probesSH.value=Ot.texture,Zt.probesMin.value.copy(Ot.boundingBox.min),Zt.probesMax.value.copy(Ot.boundingBox.max),Zt.probesResolution.value.copy(Ot.resolution)}_u.upload(I,pi(Ve),Zt,M)}if(J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(_u.upload(I,pi(Ve),Zt,M),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&Lt.setValue(I,"center",te.center),Lt.setValue(I,"modelViewMatrix",te.modelViewMatrix),Lt.setValue(I,"normalMatrix",te.normalMatrix),Lt.setValue(I,"modelMatrix",te.matrixWorld),J.uniformsGroups!==void 0){const Ot=J.uniformsGroups;for(let os=0,Lo=Ot.length;os<Lo;os++){const zm=Ot[os];ee.update(zm,Ii),ee.bind(zm,Ii)}}return Ii}function wr(C,j){C.ambientLightColor.needsUpdate=j,C.lightProbe.needsUpdate=j,C.directionalLights.needsUpdate=j,C.directionalLightShadows.needsUpdate=j,C.pointLights.needsUpdate=j,C.pointLightShadows.needsUpdate=j,C.spotLights.needsUpdate=j,C.spotLightShadows.needsUpdate=j,C.rectAreaLights.needsUpdate=j,C.hemisphereLights.needsUpdate=j}function Po(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(C,j,se){const J=w.get(C);J.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),w.get(C.texture).__webglTexture=j,w.get(C.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:se,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,j){const se=w.get(C);se.__webglFramebuffer=j,se.__useDefaultFramebuffer=j===void 0};const Mn=I.createFramebuffer();this.setRenderTarget=function(C,j=0,se=0){O=C,V=j,z=se;let J=null,te=!1,Ie=!1;if(C){const Oe=w.get(C);if(Oe.__useDefaultFramebuffer!==void 0){q.bindFramebuffer(I.FRAMEBUFFER,Oe.__webglFramebuffer),H.copy(C.viewport),X.copy(C.scissor),L=C.scissorTest,q.viewport(H),q.scissor(X),q.setScissorTest(L),F=-1;return}else if(Oe.__webglFramebuffer===void 0)M.setupRenderTarget(C);else if(Oe.__hasExternalTextures)M.rebindTextures(C,w.get(C.texture).__webglTexture,w.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const nt=C.depthTexture;if(Oe.__boundDepthTexture!==nt){if(nt!==null&&w.has(nt)&&(C.width!==nt.image.width||C.height!==nt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");M.setupDepthRenderbuffer(C)}}const We=C.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Ie=!0);const qe=w.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(qe[j])?J=qe[j][se]:J=qe[j],te=!0):C.samples>0&&M.useMultisampledRTT(C)===!1?J=w.get(C).__webglMultisampledFramebuffer:Array.isArray(qe)?J=qe[se]:J=qe,H.copy(C.viewport),X.copy(C.scissor),L=C.scissorTest}else H.copy(_e).multiplyScalar(Ne).floor(),X.copy(Le).multiplyScalar(Ne).floor(),L=we;if(se!==0&&(J=Mn),q.bindFramebuffer(I.FRAMEBUFFER,J)&&q.drawBuffers(C,J),q.viewport(H),q.scissor(X),q.setScissorTest(L),te){const Oe=w.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+j,Oe.__webglTexture,se)}else if(Ie){const Oe=j;for(let We=0;We<C.textures.length;We++){const qe=w.get(C.textures[We]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+We,qe.__webglTexture,se,Oe)}}else if(C!==null&&se!==0){const Oe=w.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Oe.__webglTexture,se)}F=-1},this.readRenderTargetPixels=function(C,j,se,J,te,Ie,Ue,Oe=0){if(!(C&&C.isWebGLRenderTarget)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=w.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ue!==void 0&&(We=We[Ue]),We){q.bindFramebuffer(I.FRAMEBUFFER,We);try{const qe=C.textures[Oe],nt=qe.format,st=qe.type;if(C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Oe),!pe.textureFormatReadable(nt)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pe.textureTypeReadable(st)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=C.width-J&&se>=0&&se<=C.height-te&&I.readPixels(j,se,J,te,W.convert(nt),W.convert(st),Ie)}finally{const qe=O!==null?w.get(O).__webglFramebuffer:null;q.bindFramebuffer(I.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(C,j,se,J,te,Ie,Ue,Oe=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=w.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ue!==void 0&&(We=We[Ue]),We)if(j>=0&&j<=C.width-J&&se>=0&&se<=C.height-te){q.bindFramebuffer(I.FRAMEBUFFER,We);const qe=C.textures[Oe],nt=qe.format,st=qe.type;if(C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Oe),!pe.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pe.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ye=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ye),I.bufferData(I.PIXEL_PACK_BUFFER,Ie.byteLength,I.STREAM_READ),I.readPixels(j,se,J,te,W.convert(nt),W.convert(st),0);const Rt=O!==null?w.get(O).__webglFramebuffer:null;q.bindFramebuffer(I.FRAMEBUFFER,Rt);const Kt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await zR(I,Kt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ye),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,Ie),I.deleteBuffer(Ye),I.deleteSync(Kt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,j=null,se=0){const J=Math.pow(2,-se),te=Math.floor(C.image.width*J),Ie=Math.floor(C.image.height*J),Ue=j!==null?j.x:0,Oe=j!==null?j.y:0;M.setTexture2D(C,0),I.copyTexSubImage2D(I.TEXTURE_2D,se,0,0,Ue,Oe,te,Ie),q.unbindTexture()};const jt=I.createFramebuffer(),Li=I.createFramebuffer();this.copyTextureToTexture=function(C,j,se=null,J=null,te=0,Ie=0){let Ue,Oe,We,qe,nt,st,Ye,Rt,Kt;const qt=C.isCompressedTexture?C.mipmaps[Ie]:C.image;if(se!==null)Ue=se.max.x-se.min.x,Oe=se.max.y-se.min.y,We=se.isBox3?se.max.z-se.min.z:1,qe=se.min.x,nt=se.min.y,st=se.isBox3?se.min.z:0;else{const Zt=Math.pow(2,-te);Ue=Math.floor(qt.width*Zt),Oe=Math.floor(qt.height*Zt),C.isDataArrayTexture?We=qt.depth:C.isData3DTexture?We=Math.floor(qt.depth*Zt):We=1,qe=0,nt=0,st=0}J!==null?(Ye=J.x,Rt=J.y,Kt=J.z):(Ye=0,Rt=0,Kt=0);const Dt=W.convert(j.format),Nn=W.convert(j.type);let Ve;j.isData3DTexture?(M.setTexture3D(j,0),Ve=I.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(M.setTexture2DArray(j,0),Ve=I.TEXTURE_2D_ARRAY):(M.setTexture2D(j,0),Ve=I.TEXTURE_2D),q.activeTexture(I.TEXTURE0),q.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,j.flipY),q.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),q.pixelStorei(I.UNPACK_ALIGNMENT,j.unpackAlignment);const mi=q.getParameter(I.UNPACK_ROW_LENGTH),mt=q.getParameter(I.UNPACK_IMAGE_HEIGHT),Ii=q.getParameter(I.UNPACK_SKIP_PIXELS),ir=q.getParameter(I.UNPACK_SKIP_ROWS),rs=q.getParameter(I.UNPACK_SKIP_IMAGES);q.pixelStorei(I.UNPACK_ROW_LENGTH,qt.width),q.pixelStorei(I.UNPACK_IMAGE_HEIGHT,qt.height),q.pixelStorei(I.UNPACK_SKIP_PIXELS,qe),q.pixelStorei(I.UNPACK_SKIP_ROWS,nt),q.pixelStorei(I.UNPACK_SKIP_IMAGES,st);const Do=C.isDataArrayTexture||C.isData3DTexture,Lt=j.isDataArrayTexture||j.isData3DTexture;if(C.isDepthTexture){const Zt=w.get(C),ss=w.get(j),Ot=w.get(Zt.__renderTarget),os=w.get(ss.__renderTarget);q.bindFramebuffer(I.READ_FRAMEBUFFER,Ot.__webglFramebuffer),q.bindFramebuffer(I.DRAW_FRAMEBUFFER,os.__webglFramebuffer);for(let Lo=0;Lo<We;Lo++)Do&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,w.get(C).__webglTexture,te,st+Lo),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,w.get(j).__webglTexture,Ie,Kt+Lo)),I.blitFramebuffer(qe,nt,Ue,Oe,Ye,Rt,Ue,Oe,I.DEPTH_BUFFER_BIT,I.NEAREST);q.bindFramebuffer(I.READ_FRAMEBUFFER,null),q.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(te!==0||C.isRenderTargetTexture||w.has(C)){const Zt=w.get(C),ss=w.get(j);q.bindFramebuffer(I.READ_FRAMEBUFFER,jt),q.bindFramebuffer(I.DRAW_FRAMEBUFFER,Li);for(let Ot=0;Ot<We;Ot++)Do?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Zt.__webglTexture,te,st+Ot):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Zt.__webglTexture,te),Lt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ss.__webglTexture,Ie,Kt+Ot):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ss.__webglTexture,Ie),te!==0?I.blitFramebuffer(qe,nt,Ue,Oe,Ye,Rt,Ue,Oe,I.COLOR_BUFFER_BIT,I.NEAREST):Lt?I.copyTexSubImage3D(Ve,Ie,Ye,Rt,Kt+Ot,qe,nt,Ue,Oe):I.copyTexSubImage2D(Ve,Ie,Ye,Rt,qe,nt,Ue,Oe);q.bindFramebuffer(I.READ_FRAMEBUFFER,null),q.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Lt?C.isDataTexture||C.isData3DTexture?I.texSubImage3D(Ve,Ie,Ye,Rt,Kt,Ue,Oe,We,Dt,Nn,qt.data):j.isCompressedArrayTexture?I.compressedTexSubImage3D(Ve,Ie,Ye,Rt,Kt,Ue,Oe,We,Dt,qt.data):I.texSubImage3D(Ve,Ie,Ye,Rt,Kt,Ue,Oe,We,Dt,Nn,qt):C.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,Ie,Ye,Rt,Ue,Oe,Dt,Nn,qt.data):C.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,Ie,Ye,Rt,qt.width,qt.height,Dt,qt.data):I.texSubImage2D(I.TEXTURE_2D,Ie,Ye,Rt,Ue,Oe,Dt,Nn,qt);q.pixelStorei(I.UNPACK_ROW_LENGTH,mi),q.pixelStorei(I.UNPACK_IMAGE_HEIGHT,mt),q.pixelStorei(I.UNPACK_SKIP_PIXELS,Ii),q.pixelStorei(I.UNPACK_SKIP_ROWS,ir),q.pixelStorei(I.UNPACK_SKIP_IMAGES,rs),Ie===0&&j.generateMipmaps&&I.generateMipmap(Ve),q.unbindTexture()},this.initRenderTarget=function(C){w.get(C).__webglFramebuffer===void 0&&M.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?M.setTextureCube(C,0):C.isData3DTexture?M.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?M.setTexture2DArray(C,0):M.setTexture2D(C,0),q.unbindTexture()},this.resetState=function(){V=0,z=0,O=null,q.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _r}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}}const RS=""+new URL("face.CkBiYO94.png",import.meta.url).href,y0="AMFOBI7501<>/\\[]{}#%&@十人工智慧能力未來",bL=480,EL=Tr({__name:"SymbolFace",props:ZM({src:{type:String,default:RS},chars:{type:Array,default:()=>["M","F","O","A","B","I","7","5"]},color:{type:[String,Array],default:"#88beef"},colorMode:{type:String,default:"tone"},sampleStep:{type:Number,default:6},fitWidth:{type:Number,default:500},fitHeight:{type:Number,default:500},worldScale:{type:Number,default:1},minDensity:{type:Number,default:.8},densityGamma:{type:Number,default:2},darkBoost:{type:Number,default:1.8},sizeMin:{type:Number,default:18},sizeMax:{type:Number,default:36},maxParticles:{type:Number,default:6e3},bgColor:{type:String,default:"#ffffff"},revealDuration:{type:Number,default:3},disperseDuration:{type:Number,default:2.2},disperseSpread:{type:Array,default:()=>[900,520,240]},floatAmp:{type:Number,default:22},floatMicro:{type:Number,default:4},floatSpeed:{type:Number,default:1},holeRadius:{type:Number,default:90},holeSpread:{type:Number,default:140},stiffness:{type:Number,default:40},damping:{type:Number,default:3.5},impulseStrength:{type:Number,default:3600},groupShift:{type:Number,default:11},groupShiftNear:{type:Number,default:120},groupShiftFar:{type:Number,default:380},mouseEase:{type:Number,default:8},autoMouse:{type:Boolean,default:!1},autoMouseSpeed:{type:Number,default:1},phrases:{type:Array,default:()=>["1","2","3","4","5","6"]},gridCols:{type:Number,default:3},gridRows:{type:Number,default:2},phraseColor:{type:String,default:"#ffffff"}},{dispersed:{type:Boolean,default:!1},dispersedModifiers:{}}),emits:["update:dispersed"],setup(n){const e=n,t=vt(null),i=vt(null),r=vt(-1),s=vt("");let o=0;const a=f=>{if(cancelAnimationFrame(o),!f){s.value="";return}const h=performance.now(),p=m=>{const _=Math.min((m-h)/bL,1),g=Math.floor(_*f.length);let y="";for(let x=0;x<f.length;x++){const v=f[x];y+=x<g||v===" "?v:y0[Math.floor(Math.random()*y0.length)]}s.value=y,_<1?o=requestAnimationFrame(p):s.value=f};o=requestAnimationFrame(p)};ca(r,f=>{a(f>=0?e.phrases[f]??"":"")}),Zr(()=>cancelAnimationFrame(o));const l=sb(n,"dispersed");let c=null;ca(l,()=>c?.(!0));const u=f=>{const p=Math.ceil(Math.sqrt(f.length)),m=Math.ceil(f.length/p),_=document.createElement("canvas");_.width=p*64,_.height=m*64;const g=_.getContext("2d");g.fillStyle="#fff",g.font=`bold ${64*.78}px "Courier New", monospace`,g.textAlign="center",g.textBaseline="middle",f.forEach((x,v)=>{const b=v%p*64+32,T=Math.floor(v/p)*64+64/2;g.fillText(x,b,T)});const y=new Gg(_);return y.minFilter=ws,y.magFilter=gn,{texture:y,cols:p,rows:m}},d=f=>{const h=Array.isArray(f)?f:[f],p=256,m=document.createElement("canvas");m.width=p,m.height=1;const _=m.getContext("2d");if(h.length===1)_.fillStyle=h[0],_.fillRect(0,0,p,1);else{const y=_.createLinearGradient(0,0,p,0);h.forEach((x,v)=>y.addColorStop(v/(h.length-1),x)),_.fillStyle=y,_.fillRect(0,0,p,1)}const g=new Gg(m);return g.minFilter=gn,g.magFilter=gn,g.wrapS=Zi,g.wrapT=Zi,g};return Kr(()=>{const f=t.value;if(!f)return;const h=f.clientWidth,p=f.clientHeight,m=new iC;m.background=new bt(e.bgColor);const _=new Hi(50,h/p,.1,2e3);_.position.z=600;const g=new ML({antialias:!0,alpha:!0});g.setPixelRatio(Math.min(window.devicePixelRatio,2)),g.setSize(h,p),f.appendChild(g.domElement);const y=new re(9999,9999,0),x=new re(9999,9999,0);let v=0,b=0;const T=new Et,A=new TC,S=new _s(new re(0,0,1),0),E=new re,R=I=>{const K=g.domElement.getBoundingClientRect();T.x=(I.clientX-K.left)/K.width*2-1,T.y=-((I.clientY-K.top)/K.height)*2+1,A.setFromCamera(T,_),A.ray.intersectPlane(S,E)&&(y.copy(E),v=1)},D=()=>{v=0};g.domElement.addEventListener("pointermove",R),g.domElement.addEventListener("pointerleave",D);const N=u(e.chars),V=d(e.color);let z=null,O=null,F=!1,k=null,H=null,X=null,L=null,ue=0,de=0,ke=0,ze=150,Ne=150;const ne=I=>{const K=I.naturalWidth,Y=I.naturalHeight,pe=document.createElement("canvas");pe.width=K,pe.height=Y;const q=pe.getContext("2d");q.drawImage(I,0,0);const he=q.getImageData(0,0,K,Y).data,w=Math.min(e.fitWidth/K,e.fitHeight/Y)*e.worldScale;de=K*w/2,ke=Y*w/2,ze=de*.7,Ne=ke*.7;const M=[],G=[],Z=[],ae=e.sampleStep;for(let me=0;me<Y;me+=ae)for(let ee=0;ee<K;ee+=ae){let De=0,Ae=0,ye=0;for(let Se=0;Se<ae&&me+Se<Y;Se++)for(let $e=0;$e<ae&&ee+$e<K;$e++){const He=((me+Se)*K+(ee+$e))*4;De+=(.299*(he[He]??0)+.587*(he[He+1]??0)+.114*(he[He+2]??0))/255,Ae+=(he[He+3]??0)/255,ye++}const Ee=Ae/ye;if(Ee<.5)continue;const Re=Math.min(1,(1-De/ye)*e.darkBoost),je=(e.minDensity+(1-e.minDensity)*Math.pow(Re,e.densityGamma))*Ee;Math.random()>je||(M.push((ee-K/2)*w,-(me-Y/2)*w,(Math.random()-.5)*8),G.push(e.sizeMin+(e.sizeMax-e.sizeMin)*Re),Z.push(Re))}let ce=M.length/3;if(ce>e.maxParticles){const me=e.maxParticles/ce;let ee=0;for(let De=0;De<ce;De++)Math.random()>me||(M[ee*3]=M[De*3],M[ee*3+1]=M[De*3+1],M[ee*3+2]=M[De*3+2],G[ee]=G[De],Z[ee]=Z[De],ee++);M.length=ee*3,G.length=ee,Z.length=ee,ce=ee}const fe=new Float32Array(M),ie=new Float32Array(ce*3),le=new Float32Array(ce*3),Ce=new Float32Array(ce),ge=new Float32Array(G),ve=new Float32Array(ce),Me=new Float32Array(ce),Pe=e.disperseSpread[0]??900,Xe=e.disperseSpread[1]??520,Ke=e.disperseSpread[2]??240;for(let me=0;me<ce;me++){const ee=me*3,De=Math.random()*Math.PI*2,Ae=80+Math.random()*120;ie[ee]=fe[ee]+Math.cos(De)*Ae,ie[ee+1]=fe[ee+1]+Math.sin(De)*Ae,ie[ee+2]=fe[ee+2],le[ee]=(Math.random()-.5)*Pe,le[ee+1]=(Math.random()-.5)*Xe,le[ee+2]=(Math.random()-.5)*Ke,Ce[me]=Math.random()*.85,ve[me]=Math.floor(Math.random()*e.chars.length),Me[me]=Math.random()}z=new nr,z.setAttribute("position",new un(ie.slice(),3)),z.setAttribute("aStart",new un(ie,3)),z.setAttribute("aTarget",new un(fe,3)),z.setAttribute("aFloat",new un(le,3)),z.setAttribute("aOrder",new un(Ce,1)),z.setAttribute("aSize",new un(ge,1)),z.setAttribute("aDark",new un(new Float32Array(Z),1)),z.setAttribute("aGlyph",new un(ve,1)),z.setAttribute("aSeed",new un(Me,1)),k=new Float32Array(ce*3),H=new Float32Array(ce*3),X=fe,ue=ce,L=new un(k,3),L.setUsage(BR),z.setAttribute("aDisp",L),O=new tr({transparent:!0,depthWrite:!1,uniforms:{uProgress:{value:0},uTime:{value:0},uDisperse:{value:0},uMouse:{value:new re(9999,9999,0)},uMouseInfluence:{value:0},uPixelRatio:{value:g.getPixelRatio()},uFloatAmp:{value:e.floatAmp},uFloatMicro:{value:e.floatMicro},uFloatSpeed:{value:e.floatSpeed},uHoleRadius:{value:e.holeRadius},uHoleSpread:{value:e.holeSpread},uGroupShift:{value:e.groupShift},uGroupNear:{value:e.groupShiftNear},uGroupFar:{value:e.groupShiftFar},uAtlas:{value:N.texture},uAtlasGrid:{value:new Et(N.cols,N.rows)},uGlyphCount:{value:e.chars.length},uColorRamp:{value:V},uColorRandom:{value:e.colorMode==="random"?1:0}},vertexShader:`
        attribute vec3 aStart;
        attribute vec3 aTarget;
        attribute vec3 aFloat;
        attribute vec3 aDisp;
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

          // 慣性位移：游標斥力/回彈改由 CPU 端彈簧-阻尼積分（見 animate()），
          // 結果存在 aDisp，這裡直接疊加 → 撞散後帶動量 overshoot、再慢慢歸位（脫離磁吸感）。
          // 散場時讓位移淡出，交棒給 drift。
          pos += aDisp * (1.0 - uDisperse);

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
      `});const W=new pC(z,O);m.add(W),Le(),c=(me=!0)=>{if(!O)return;const ee=l.value?1:0;_n.killTweensOf(O.uniforms.uDisperse),me?_n.to(O.uniforms.uDisperse,{value:ee,duration:e.disperseDuration,ease:"power2.inOut"}):O.uniforms.uDisperse.value=ee},c(!1)};let xe=!1,_e=!1;const Le=()=>{!xe||!O||_e||(_e=!0,_n.to(O.uniforms.uProgress,{value:1,duration:e.revealDuration,ease:"power2.inOut"}))},we=new IntersectionObserver(I=>{I.some(K=>K.isIntersecting)&&(xe=!0,Le(),we.disconnect())},{threshold:.3});we.observe(f);const Te=new Image;Te.src=e.src,Te.onload=()=>{F||ne(Te)};const Be=new wC;let P=0,B=0;const $=new re;let Q=h,U=p;i.value&&(i.value.style.color=e.phraseColor);const oe=()=>{const I=Be.getElapsedTime(),K=Math.min(I-B,.1);if(B=I,e.autoMouse){const q=I*e.autoMouseSpeed;y.set(Math.sin(q*.7)*ze*.6+Math.sin(q*.23+1.3)*ze*.4,Math.cos(q*.53)*Ne*.6+Math.cos(q*.31+.7)*Ne*.4,0),v=1}const Y=1-Math.exp(-e.mouseEase*K);if(b<.001&&v>0?x.copy(y):x.lerp(y,Y),b+=(v-b)*Y,O&&(O.uniforms.uTime.value=I,O.uniforms.uMouse.value.copy(x),O.uniforms.uMouseInfluence.value=b),k&&H&&X&&L){const q=k,he=H,w=X,M=e.stiffness,G=Math.exp(-e.damping*K),Z=e.holeRadius+e.holeSpread,ae=Z*Z,ce=!l.value&&b>.01,fe=x.x,ie=x.y,le=e.impulseStrength*b;for(let Ce=0;Ce<ue;Ce++){const ge=Ce*3;let ve=(he[ge]-M*q[ge]*K)*G,Me=(he[ge+1]-M*q[ge+1]*K)*G,Pe=(he[ge+2]-M*q[ge+2]*K)*G;if(ce){const Xe=w[ge]+q[ge]-fe,Ke=w[ge+1]+q[ge+1]-ie,W=Xe*Xe+Ke*Ke;if(W<ae){const me=Math.sqrt(W)+1e-4,ee=1-me/Z,De=le*ee*ee*K/me;ve+=Xe*De,Me+=Ke*De}}he[ge]=ve,he[ge+1]=Me,he[ge+2]=Pe,q[ge]=q[ge]+ve*K,q[ge+1]=q[ge+1]+Me*K,q[ge+2]=q[ge+2]+Pe*K}L.needsUpdate=!0}const pe=i.value;if(pe&&de>0){let q=-1;if(!l.value&&b>.4&&e.phrases.length){const he=(x.x+de)/(2*de),w=(ke-x.y)/(2*ke);if(he>=0&&he<1&&w>=0&&w<1){const M=Math.min(e.gridCols-1,Math.floor(he*e.gridCols)),Z=Math.min(e.gridRows-1,Math.floor(w*e.gridRows))*e.gridCols+M;Z<e.phrases.length&&e.phrases[Z]&&(q=Z)}}if(q!==r.value&&(r.value=q),q>=0){$.copy(x).project(_);const he=($.x*.5+.5)*Q,w=(-$.y*.5+.5)*U;pe.style.transform=`translate(${he}px, ${w}px) translate(-50%, -50%)`,pe.style.opacity=String(Math.min(1,b))}else pe.style.opacity="0"}g.render(m,_),P=requestAnimationFrame(oe)};oe();const be=()=>{const I=f.clientWidth,K=f.clientHeight;Q=I,U=K,_.aspect=I/K,_.updateProjectionMatrix(),g.setSize(I,K)};window.addEventListener("resize",be),Zr(()=>{F=!0,we.disconnect(),cancelAnimationFrame(P),window.removeEventListener("resize",be),g.domElement.removeEventListener("pointermove",R),g.domElement.removeEventListener("pointerleave",D),g.dispose(),z?.dispose(),O?.dispose(),N.texture.dispose(),V.dispose(),f.removeChild(g.domElement)})}),(f,h)=>(_t(),Xt("div",{ref_key:"wrapRef",ref:t,class:"stage"},[en("button",{class:"go",onClick:h[0]||(h[0]=p=>l.value=!l.value)},ys(l.value?"集合":"分散"),1),en("div",{ref_key:"eggRef",ref:i,class:"egg","aria-hidden":"true"},[uv(f.$slots,"phrase",{index:ut(r),text:ut(s)},()=>[ha(ys(ut(s)),1)])],512)],512))}}),TL=Object.assign(Ha(EL,[["__scopeId","data-v-1832d935"]]),{__name:"SymbolFace"}),wL=Tr({__name:"HeartMetaball",props:{bgColor:{default:"#ffffff"},maxBalls:{default:64},life:{default:1.6},cellSize:{default:14},color:{default:"#9FD6FF"},accentColor:{default:"#FF7F00"},accentRatio:{default:.3},accentBlock:{default:6},evenCells:{default:2},switchPeriod:{default:3},centerCells:{default:17},peripheryDensity:{default:.5},cornerExp:{default:4},edgeFeather:{default:.5},idleRoamRange:{default:.4},idleRoamSpeed:{default:1},idleBlobMin:{default:.05},idleBlobMax:{default:.09},autoRoam:{type:Boolean,default:!1}},setup(n){const e=n,t=vt(null),i=vt(null);return Kr(()=>{const r=t.value,s=i.value;if(!r||!s)return;const o=s.getContext("2d"),a=e.cellSize,l=e.maxBalls,c=e.color,u=e.accentColor,d=Math.max(1,Math.round(e.accentBlock)),f=Math.max(1,Math.round(e.evenCells)),h=Math.max(.1,e.switchPeriod),p=[1,2,3,6],m=[];p.forEach((we,Te)=>{for(let Be=0;Be<we;Be++)m.push(Te)});const _=m.length,g=(we,Te)=>{const Be=Math.sin(we*12.9898+Te*78.233)*43758.5453;return Be-Math.floor(Be)},y=(we,Te,Be)=>{const P=Math.sin(we*12.9898+Te*78.233+Be*37.719)*43758.5453;return P-Math.floor(P)},x=(we,Te,Be)=>{const P=Math.min(Math.max((Be-we)/(Te-we),0),1);return P*P*(3-2*P)};let v=-9999,b=-9999,T=0;const A=e.centerCells*a;let S=0,E=0,R=0,D=0,N=[];const V=()=>{S=r.clientWidth,E=r.clientHeight;const we=Math.min(window.devicePixelRatio,2);s.width=Math.max(S*we,1),s.height=Math.max(E*we,1),o.setTransform(we,0,0,we,0,0),R=Math.ceil(S/a),D=Math.ceil(E/a),N=new Array(R*D)};V();const z=Array.from({length:l},()=>({x:-9999,y:-9999,r0:0,born:-1/0}));let O=0;const F={x:-9999,y:-9999},k=26,H=()=>performance.now()/1e3,X=(we,Te,Be,P)=>{const B=Math.min(S,E),$=1+(Math.random()<.35?1:0);for(let Q=0;Q<$;Q++){const U=z[O];O=(O+1)%l;const oe=B*.05;U.x=we+(Math.random()-.5)*oe*2,U.y=Te+(Math.random()-.5)*oe*2,U.r0=B*(Be+Math.random()*(P-Be)),U.born=H()}},L=(we,Te)=>{const Be=we-F.x,P=Te-F.y;Be*Be+P*P<k*k||(F.x=we,F.y=Te,X(we,Te,.05,.12))},ue=1.2;let de=-1/0;const ke=we=>{const Te=s.getBoundingClientRect();de=H(),v=we.clientX-Te.left,b=we.clientY-Te.top,L(v,b)};e.autoRoam||window.matchMedia("(hover: none)").matches||(r.addEventListener("pointermove",ke),r.addEventListener("pointerdown",ke));let Ne=0,ne=!1;const xe=()=>{if(!ne)return;const we=H(),Te=we-de>ue;if(Te){const Y=Math.min(S,E)*e.idleRoamRange,pe=we*e.idleRoamSpeed;v=S*.5+(Math.sin(pe*.13)*.5+Math.sin(pe*.21+1.7)*.3+Math.sin(pe*.07+4.1)*.2)*Y,b=E*.5+(Math.cos(pe*.11)*.5+Math.cos(pe*.19+.7)*.3+Math.sin(pe*.05+2.3)*.2)*Y;const q=v-F.x,he=b-F.y;q*q+he*he>k*k&&(F.x=v,F.y=b,X(v,b,e.idleBlobMin,e.idleBlobMax))}T+=(A-T)*.12;const Be=[];let P=1/0,B=1/0,$=-1/0,Q=-1/0;for(let K=0;K<l;K++){const Y=z[K],pe=we-Y.born,q=Math.min(pe/.15,1),he=1-Math.min(Math.max((pe-.3)/(e.life-.3),0),1),w=Y.r0*q*he*he;w<=1||(Be.push({x:Y.x,y:Y.y,r:w}),P=Math.min(P,Y.x-w*2.5),$=Math.max($,Y.x+w*2.5),B=Math.min(B,Y.y-w*2.5),Q=Math.max(Q,Y.y+w*2.5))}if(Te&&S>0){const Y=Math.min(S,E)*(e.idleBlobMin+e.idleBlobMax)*.5;Be.push({x:v,y:b,r:Y}),P=Math.min(P,v-Y*2.5),$=Math.max($,v+Y*2.5),B=Math.min(B,b-Y*2.5),Q=Math.max(Q,b+Y*2.5)}const U=Math.max(Math.floor(P/a),0),oe=Math.min(Math.ceil($/a),R),be=Math.max(Math.floor(B/a),0),I=Math.min(Math.ceil(Q/a),D);o.clearRect(0,0,S,E);for(let K=0;K<D;K++){const Y=K>=be&&K<I;for(let pe=0;pe<R;pe++){const q=K*R+pe;if(!Y||pe<U||pe>=oe||Be.length===0){N[q]!==void 0&&(N[q]=void 0);continue}const he=(pe+.5)*a,w=(K+.5)*a;let M=0;for(const Z of Be){const ae=he-Z.x,ce=w-Z.y,fe=Z.r*Z.r/(ae*ae+ce*ce+1)-.16;fe>0&&(M+=fe)}let G=N[q];if(G===void 0&&(G=.6+Math.random(),N[q]=G),M>=G){const Z=Math.abs(he-v),ae=Math.abs(w-b),ce=Math.pow(Z,e.cornerExp)+Math.pow(ae,e.cornerExp),fe=Math.pow(ce,1/e.cornerExp)/Math.max(T,1e-4),ie=1-x(1-e.edgeFeather,1,fe),le=ie>0&&g(pe+31.4,K+17.2)<ie;let Ce=null;if(le){const ge=Math.floor(pe/d),ve=Math.floor(K/d),Me=g(ge*7.1+1.3,ve*7.1+2.7),Pe=Math.floor(we/h+Me);let Xe=0,Ke=c;if(y(ge,ve,Pe+.5)<e.accentRatio){const me=Math.floor(y(ge+.7,ve+.3,Pe+11.5)*3);me===0?Ke=u:me===1?Xe=1:(Xe=1,Ke=u)}let W;Xe===0?W=(m[(pe%_+_)%_]+K)%2===0:W=(Math.floor(pe/f)+Math.floor(K/f))%2===0,W&&(Ce=Ke)}else K%2===0&&g(pe,K)<e.peripheryDensity&&(Ce=c);Ce&&(o.fillStyle=Ce,o.fillRect(pe*a,K*a,a,a))}}}Ne=requestAnimationFrame(xe)},_e=new IntersectionObserver(([we])=>{const Te=we?.isIntersecting??!1;Te&&!ne?(ne=!0,xe()):!Te&&ne&&(ne=!1,cancelAnimationFrame(Ne))});_e.observe(r);const Le=new ResizeObserver(V);Le.observe(r),Zr(()=>{ne=!1,cancelAnimationFrame(Ne),_e.disconnect(),Le.disconnect(),r.removeEventListener("pointermove",ke),r.removeEventListener("pointerdown",ke)})}),(r,s)=>(_t(),Xt("section",{ref_key:"wrapRef",ref:t,class:"metaballs",style:yo({background:n.bgColor})},[en("canvas",{ref_key:"canvasRef",ref:i},null,512)],4))}}),AL=Object.assign(Ha(wL,[["__scopeId","data-v-8215348f"]]),{__name:"HeartMetaball"}),RL=["src","alt"],CL=Tr({__name:"GlitchImage",props:{images:{},alt:{default:()=>[]},caption:{default:""},layout:{default:()=>[{x:16,y:1,w:60,z:1},{x:0,y:8,w:22,z:2},{x:65,y:56,w:31,z:2}]},stagger:{default:.4},aspectRatio:{default:1.6},shadow:{default:"0 10px 30px rgba(0, 0, 0, 0.18)"},duration:{default:2},pieces:{default:24},bgColor:{default:void 0},bgRatio:{default:.35},floatAmp:{default:8},parallaxAmp:{default:14},active:{type:Boolean,default:!1}},setup(n,{expose:e}){const t=n,i=vt(null),r=[],s=[],o=[],a=(H,X)=>{r[X]=H},l=(H,X)=>{s[X]=H},c=(H,X)=>{o[X]=H},u=nc(()=>t.images.slice(0,t.layout.length||3).map((H,X)=>{const L=t.layout[X]??t.layout[t.layout.length-1];return{src:H,alt:t.alt[X]??"",x:L.x,y:L.y,w:L.w,z:L.z??1}})),d=vt(!1),f=vt(!1),h=(H,X)=>H+Math.random()*(X-H),p=(H,X)=>Math.floor(h(H,X+1)),m=H=>H[Math.floor(Math.random()*H.length)],_=(H,X=32)=>{const L=document.createElement("canvas");L.width=X,L.height=X;const ue=L.getContext("2d");ue.drawImage(H,0,0,X,X);const de=ue.getImageData(0,0,X,X).data;return(ke,ze)=>{const Ne=Math.min(X-1,Math.floor(ke/100*X)),xe=(Math.min(X-1,Math.floor(ze/100*X))*X+Ne)*4;return`rgb(${de[xe]}, ${de[xe+1]}, ${de[xe+2]})`}},g=H=>Array.from({length:H},()=>{const X=h(10,46),L=h(7,36);return{x:h(0,100-X),y:h(0,100-L),w:X,h:L}}),y=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,x=async(H,X,L,ue)=>{try{await H.decode()}catch{return _n.set(H,{autoAlpha:1}),null}const de=t.duration,ke=t.images.filter(Te=>Te!==L),ze=ke.length?ke:[L];let Ne;try{Ne=_(H)}catch{Ne=()=>"rgb(128, 128, 128)"}const ne=_n.timeline({delay:ue,onComplete:()=>X.replaceChildren()}),xe=.08,_e=.42,Le=.72,we=.9;for(const{x:Te,y:Be,w:P,h:B}of g(t.pieces)){const $=document.createElement("div");$.style.position="absolute",$.style.visibility="hidden",$.style.left=`${Te}%`,$.style.top=`${Be}%`,$.style.width=`${P}%`,$.style.height=`${B}%`,$.style.backgroundRepeat="no-repeat",$.style.backgroundSize=`${1e4/P}% ${1e4/B}%`,$.style.backgroundPosition=`${P>=100?0:Te/(100-P)*100}% ${B>=100?0:Be/(100-B)*100}%`,X.appendChild($);const Q=Ne(Te+P/2,Be+B/2),U=()=>t.bgColor&&Math.random()<t.bgRatio?t.bgColor:Q,oe=K=>ne.set($,{autoAlpha:0},K+h(.03,.09)*de),be=p(1,3);for(let K=0;K<be;K++){const Y=h(xe,_e-.05)*de;Math.random()<.5?ne.set($,{autoAlpha:1,backgroundImage:`url(${m(ze)})`,backgroundColor:"transparent",xPercent:h(-60,60),yPercent:h(-60,60),filter:Math.random()<.4?`brightness(${h(1.3,1.9).toFixed(2)})`:"none"},Y):ne.set($,{autoAlpha:1,backgroundImage:"none",backgroundColor:U(),xPercent:0,yPercent:0,filter:"none"},Y),oe(Y)}const I=p(1,3);for(let K=0;K<I;K++){const Y=h(_e,Le-.03)*de;if(Math.random()<.45)ne.set($,{autoAlpha:1,backgroundImage:"none",backgroundColor:U(),xPercent:0,yPercent:0,filter:"none"},Y);else{const pe=1-(Y/de-_e)/(Le-_e);ne.set($,{autoAlpha:1,backgroundImage:`url(${L})`,backgroundColor:"transparent",xPercent:h(-25,25)*pe,yPercent:h(-25,25)*pe,filter:Math.random()<.3?`saturate(${h(1.4,2.2).toFixed(2)})`:"none"},Y)}oe(Y)}ne.set($,{autoAlpha:1,backgroundImage:`url(${L})`,backgroundColor:"transparent",xPercent:0,yPercent:0,filter:"none"},h(Le,we)*de)}return ne.set(H,{autoAlpha:1},we*de),ne.set(X,{autoAlpha:0},we*de+.02*de),X.parentElement&&ne.set(X.parentElement,{boxShadow:t.shadow},we*de),ne.set({},{},de),ne};let v=[],b=null;const T=()=>{if(y()){u.value.forEach((X,L)=>{const ue=s[L];ue&&_n.set(ue,{autoAlpha:1}),r[L]&&(r[L].style.boxShadow=t.shadow)}),f.value=!0;return}u.value.forEach((X,L)=>{const ue=s[L];ue&&_n.set(ue,{autoAlpha:0})});let H=0;u.value.forEach((X,L)=>{const ue=s[L],de=o[L];if(!ue||!de)return;const ke=L*t.stagger;H=Math.max(H,ke+t.duration),x(ue,de,X.src,ke).then(ze=>{ze&&v.push(ze)})}),b=_n.delayedCall(H*.9,()=>{f.value=!0}),O()},A=async()=>{d.value||(d.value=!0,await Il()),S(),T()},S=()=>{v.forEach(H=>H.kill()),v=[],b?.kill(),b=null,f.value=!1,F(),u.value.forEach((H,X)=>{const L=s[X];L&&_n.set(L,{autoAlpha:0}),o[X]?.replaceChildren();const ue=r[X];ue&&(ue.style.boxShadow="none",ue.style.transform="")})};let E=0,R=0,D=0,N=0,V=!1;const z=H=>{const X=(H-R)/1e3;u.value.forEach((L,ue)=>{const de=r[ue];if(!de)return;const ke=ue*1.7,ze=Math.sin(X*.6+ke)*t.floatAmp,Ne=Math.cos(X*.5+ke)*t.floatAmp,ne=.6+ue*.3,xe=D*t.parallaxAmp*ne,_e=N*t.parallaxAmp*ne;de.style.transform=`translate(${(ze+xe).toFixed(2)}px, ${(Ne+_e).toFixed(2)}px)`}),E=requestAnimationFrame(z)},O=()=>{E||t.floatAmp<=0&&t.parallaxAmp<=0||(R=performance.now(),E=requestAnimationFrame(z))},F=()=>{cancelAnimationFrame(E),E=0},k=H=>{D=H.clientX/window.innerWidth*2-1,N=H.clientY/window.innerHeight*2-1};return Kr(()=>{V=window.matchMedia("(hover: hover)").matches,V&&window.addEventListener("pointermove",k),t.active&&A()}),ca(()=>t.active,H=>{H?A():S()}),Zr(()=>{window.removeEventListener("pointermove",k),F(),b?.kill(),v.forEach(H=>H.kill())}),e({start:A,reset:S}),(H,X)=>(_t(),Xt("div",{ref_key:"rootRef",ref:i,class:"glitch-stage",style:yo({aspectRatio:String(n.aspectRatio)})},[(_t(!0),Xt(Qt,null,ec(ut(u),(L,ue)=>(_t(),Xt("div",{key:ue,ref_for:!0,ref:de=>a(de,ue),class:"glitch-card",style:yo({left:`${L.x}%`,top:`${L.y}%`,width:`${L.w}%`,zIndex:L.z})},[en("img",{ref_for:!0,ref:de=>l(de,ue),class:"glitch-card__img",src:ut(d)?L.src:void 0,alt:L.alt},null,8,RL),en("div",{ref_for:!0,ref:de=>c(de,ue),class:"glitch-card__overlay","aria-hidden":"true"},null,512),n.caption&&ue===0?(_t(),Xt("div",{key:0,class:Jl(["glitch-caption",{"is-visible":ut(f)}])},ys(n.caption),3)):Pb("",!0)],4))),128))],4))}}),PL=Object.assign(Ha(CL,[["__scopeId","data-v-232bcd0f"]]),{__name:"GlitchImage"}),DL=""+new URL("einstein.DLD5Kbgp.png",import.meta.url).href,CS=""+new URL("glitch-01.BAf-_ovH.jpg",import.meta.url).href,PS=""+new URL("glitch-02.D4OjGplp.jpg",import.meta.url).href,DS=""+new URL("glitch-03.BDC7IEEU.jpg",import.meta.url).href,LL={class:"path-def",viewBox:"0 0 1000 1000","aria-hidden":"true"},IL=["src","alt"],NL="M 120,591 Q 240,538 270,506 Q 300,474 330,431 Q 360,388 390,345.5 Q 420,303 460,276.5 Q 500,250 540,276.5 Q 580,303 610,345.5 Q 640,388 670,431 Q 700,474 730,506 Q 760,538 820,564.5 L 880,591",UL=Tr({__name:"ShowcaseGallery",props:{images:{type:Array,default:()=>[RS,DL,CS,PS,DS]},count:{type:Number,default:12},pinDistance:{type:Number,default:2e3},minScale:{type:Number,default:.12},maxScale:{type:Number,default:1.1},cardWidthRatio:{type:Number,default:.22},widthRatio:{type:Number,default:.9},rotateXRange:{type:Number,default:180},scaleYMin:{type:Number,default:.6},scaleYMax:{type:Number,default:1.3}},setup(n){const e=n,t=vt(null),i=vt(null),r=vt(null),s=vt(null),o=vt([]),a=nc(()=>Array.from({length:e.count},(l,c)=>({src:e.images[c%e.images.length],alt:`showcase ${c+1}`})));return Kr(()=>{_n.registerPlugin(rt);const l=t.value,c=i.value,u=r.value;if(!l||!c||!u)return;const d=u.getTotalLength();let f=1/0,h=-1/0,p=1/0,m=-1/0;for(let V=0;V<=1;V+=.02){const z=u.getPointAtLength(V*d);z.y<f&&(f=z.y),z.y>h&&(h=z.y),z.x<p&&(p=z.x),z.x>m&&(m=z.x)}const _=h-f||1,g=(m-p)/1e3||1;let y=0,x=0;const v=()=>{const V=l.clientWidth;y=Math.min(V,l.clientHeight)*.95,x=e.widthRatio*V/g,c.style.setProperty("--card-w",`${y*e.cardWidthRatio}px`)};v();const b={p:0},T=e.count,A=Math.PI/180,S=[],E=[];for(let V=0;V<T;V++){const z=(Math.random()*2-1)*e.rotateXRange*A;S[V]=Math.cos(z),E[V]=e.scaleYMin+Math.random()*(e.scaleYMax-e.scaleYMin)}const R=()=>{const V=o.value;for(let z=0;z<T;z++){const O=V[z];if(!O)continue;const F=(z/T+b.p)%1,k=u.getPointAtLength(F*d),H=S[z],X=(k.x-500)/1e3,L=(k.y-500)/1e3*E[z]*H,ue=(h-k.y)/_,de=e.minScale+(e.maxScale-e.minScale)*ue;O.style.left=`calc(50% + ${X*x}px)`,O.style.top=`calc(50% + ${L*y}px)`,O.style.transform=`translate(-50%, -50%) scale(${de})`,O.style.zIndex=String(Math.round(de*100)),O.style.opacity=String(Math.min(1,ue*2.4))}s.value&&(s.value.textContent=`${Math.round(b.p*100)}%`)},D=_n.timeline({scrollTrigger:{trigger:l,start:"top top",end:`+=${e.pinDistance}`,pin:!0,scrub:!0,anticipatePin:1,invalidateOnRefresh:!0}});D.to(b,{p:1,ease:"none",onUpdate:R}),R();const N=()=>{v(),R()};rt.addEventListener("refreshInit",N),Zr(()=>{rt.removeEventListener("refreshInit",N),D.scrollTrigger?.kill(),D.kill()})}),(l,c)=>(_t(),Xt("section",{ref_key:"sectionRef",ref:t,class:"gallery"},[(_t(),Xt("svg",LL,[en("path",{ref_key:"pathRef",ref:r,d:NL,fill:"none"},null,512)])),en("div",{ref_key:"stageRef",ref:i,class:"stage"},[(_t(!0),Xt(Qt,null,ec(ut(a),(u,d)=>(_t(),Xt("img",{key:d,ref_for:!0,ref_key:"cardRefs",ref:o,class:"card",src:u.src,alt:u.alt,draggable:"false"},null,8,IL))),128))],512),en("div",{ref_key:"counterRef",ref:s,class:"counter"},"0%",512)],512))}}),FL=Object.assign(UL,{__name:"ShowcaseGallery"}),OL="專題標題 | 專題 | 聯合報",BL="專題的 SEO 描述文字，請替換為實際內容。",kL="用於社群（X / Facebook）分享的簡短描述，請替換為實際內容。",HL="聯合報,數位專題",zL="meta.jpg",ds={metaTitle:OL,metaDesc:BL,metaXDesc:kL,metaKeywords:HL,metaImage:zL},VL=[{title:"七十五年，與時代同行",titleHead:"七十五年，",titleTail:"與時代同行",body:"（佔位文案）從第一份報紙到數位浪潮，我們持續記錄這座島嶼的每一刻。"},{title:"在變動中尋找秩序",titleHead:"",titleTail:"",body:"（佔位文案）資訊的碎片在眼前閃現、聚合，最終收斂為清晰的觀點。"},{title:"邁向下一個篇章",titleHead:"",titleTail:"",body:"（佔位文案）橘色的能量蔓延成整片視野，承載我們對未來的想像。"}],GL={sections:VL},WL=aw(fw),XL={class:"main-content"},$L={class:"story-section__title"},qL={class:"story-section__body"},YL={class:"glitch-demo"},jL=Tr({__name:"app",setup(n){const e=wa(),t=e.public.APP_MODE,i=e.public.APP_ASSETS_PATH,r=vt(!1),s=vt(null),o=()=>s.value?.start(),a=["逼真 AI 詐騙究竟如何分辨？","AI 算力是否耗盡電力資源？","AI 可以協助翻轉人口老化外流嗎？","無法被 AI 取代的核心能力是什麼？","AI 讓老後生活更便利還是更孤單？","不學 AI 就會被時代淘汰嗎？"];return A1({title:ds.metaTitle,description:ds.metaDesc,"og:title":ds.metaTitle,"og:description":ds.metaXDesc,"og:image":`${i}/img/${ds.metaImage}`,"twitter:title":ds.metaTitle,"twitter:description":ds.metaXDesc,twitterCard:"summary_large_image",keywords:ds.metaKeywords,robots:t==="production"?"index, follow":"noindex, nofollow"}),(l,c)=>{const u=WL,d=pw,f=sR,h=TL,p=AL,m=PL,_=FL;return _t(),Xt("div",null,[Ct(u),en("main",XL,[Ct(d,{duration:3}),Ct(f,null,{default:Dp(()=>[(_t(!0),Xt(Qt,null,ec(ut(GL).sections,(g,y)=>(_t(),Xt("section",{key:y,class:"story-section"},[en("h2",$L,[g.titleHead?(_t(),Xt(Qt,{key:0},[ha(ys(g.titleHead),1),c[1]||(c[1]=en("span",{class:"orange-core-anchor","aria-hidden":"true"},null,-1)),ha(ys(g.titleTail),1)],64)):(_t(),Xt(Qt,{key:1},[ha(ys(g.title),1)],64))]),en("p",qL,ys(g.body),1)]))),128))]),_:1}),Ct(h,{dispersed:ut(r),"onUpdate:dispersed":c[0]||(c[0]=g=>rn(r)?r.value=g:null),phrases:a,"hole-radius":25,"max-particles":16e3,color:["#ffffff","#9fd6ff","#77c6e0","#3f8fb5"],"bg-color":"#000","sample-step":6,"size-min":14,"size-max":22,"min-density":.01,"density-gamma":4.2,"dark-boost":1.3},null,8,["dispersed"]),Ct(p,{idleBlobMin:.1,idleBlobMax:.2,idleRoamSpeed:3,life:3}),en("section",YL,[Ct(m,{ref_key:"glitchRef",ref:s,class:"glitch-demo__item",images:[ut(DS),ut(CS),ut(PS)],duration:1.2,pieces:12,"bg-color":"#ffffff",caption:"6 位中途少年的自白，訴說著觸法行為背後的困境與茫然。"},null,8,["images"]),en("button",{class:"glitch-start-btn",type:"button",onClick:o}," start ")]),Ct(_)])])}}}),KL=Ha(jL,[["__scopeId","data-v-62dbe501"]]),ZL="modulepreload",JL=function(n,e){return new URL(n,e).href},S0={},M0=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let c=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");r=c(t.map(u=>{if(u=JL(u,i),u in S0)return;S0[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(i)for(let p=o.length-1;p>=0;p--){const m=o[p];if(m.href===u&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":ZL,d||(h.as="script"),h.crossOrigin="",h.href=u,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((p,m)=>{h.addEventListener("load",p),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})},QL={__name:"nuxt-error-page",props:{error:Object},setup(n){const t=n.error,i=Number(t.statusCode||500),r=i===404,s=t.statusMessage??(r?"Page Not Found":"Internal Server Error"),o=t.message||t.toString(),a=void 0,u=r?Zm(()=>M0(()=>import("./ChJevI1W.js"),__vite__mapDeps([0,1]),import.meta.url)):Zm(()=>M0(()=>import("./duKS_qA-.js"),__vite__mapDeps([2,3]),import.meta.url));return(d,f)=>(_t(),Br(ut(u),VS(Ov({status:ut(i),statusText:ut(s),statusCode:ut(i),statusMessage:ut(s),description:ut(o),stack:ut(a)})),null,16))}},eI={key:0},b0={__name:"nuxt-root",setup(n){const e=()=>null,t=An(),i=t.deferHydration();if(t.isHydrating){const u=t.hooks.hookOnce("app:error",i),d=So().beforeEach(()=>{u(),d()})}const r=!1;ev(lx,Gp()),t.hooks.callHookWith(u=>u.map(d=>d()),"vue:setup",[]);const s=Wp(),o=!1,a=/bot\b|chrome-lighthouse|facebookexternalhit|google\b/i;function l(u,d,f){const h=t.vueApp.config.errorHandler;if(h&&!h.__nuxt_default)try{h(u,d,f)}catch(p){console.error("[nuxt] Error in `app.config.errorHandler`",p)}}ov((u,d,f)=>{if(t.hooks.callHook("vue:error",u,d,f)?.catch(h=>console.error("[nuxt] Error in `vue:error` hook",h)),a.test(navigator.userAgent))return t.hooks.callHook("app:error",u),console.error(`[nuxt] Not rendering error page for bot with user agent \`${navigator.userAgent}\`:`,u),!1;if(HT(u)&&(u.fatal||u.unhandled))return t.runWithContext(()=>BT(u)),l(u,d,f),!1});const c=!1;return(u,d)=>(_t(),Br(Mb,{onResolve:ut(i)},{default:Dp(()=>[ut(o)?(_t(),Xt("div",eI)):ut(s)?(_t(),Br(ut(QL),{key:1,error:ut(s)},null,8,["error"])):ut(c)?(_t(),Br(ut(e),{key:2,context:ut(c)},null,8,["context"])):ut(r)?(_t(),Br(jM(ut(r)),{key:3})):(_t(),Br(ut(KL),{key:4}))]),_:1},8,["onResolve"]))}};let E0;{let n;E0=async function(){if(n)return n;const t=!!(window.__NUXT__?.serverRendered??document.getElementById("__NUXT_DATA__")?.dataset.ssr==="true"),i=t?dE(b0):hE(b0),r=bT({vueApp:i});async function s(o){await r.callHook("app:error",o),r.payload.error||=Xp(o)}s.__nuxt_default=!0,i.config.errorHandler=s,r.hook("app:suspense:resolve",()=>{i.config.errorHandler===s&&(i.config.errorHandler=void 0)}),!t&&b_.id&&r.hook("app:suspense:resolve",()=>{document.getElementById(b_.id)?.remove()});try{await wT(r,ew)}catch(o){s(o)}try{await r.hooks.callHook("app:created",i),await r.hooks.callHook("app:beforeMount",i),i.mount(yT),await r.hooks.callHook("app:mounted",i),await Il()}catch(o){s(o)}return i},n=E0().catch(e=>{throw console.error("Error while mounting app:",e),e})}export{An as A,So as B,wa as C,Dp as D,Yh as E,Yv as F,Ha as _,nc as a,en as b,rI as c,Xt as d,ha as e,Ct as f,Tr as g,OT as h,Cs as i,ka as j,uf as k,nI as l,Kr as m,UT as n,Zr as o,Zp as p,_t as q,kp as r,vt as s,N_ as t,tI as u,FT as v,Ll as w,ys as x,ut as y,iI as z};
