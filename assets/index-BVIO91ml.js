(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const m=e=>`https://starwars-visualguide.com/assets/img/characters/${e}.jpg`,p=async()=>{try{const t=await fetch("https://swapi.dev/api/");if(!t.ok)throw new Error("Failed to get Star Wars info!");const n=await t.json();console.log("data:",n)}catch(e){return console.warn(e.message),null}},u=async e=>{try{const t=await fetch(`https://swapi.dev/api/people/${e}/`);if(!t.ok)throw new Error(`Failed to fetch character with ID ${e}`);return t.json()}catch(t){return console.error(`Error fetching character with ID ${e}:`,t),null}},f=async e=>{try{const t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch homeworld from ${e}`);return t.json()}catch(t){return console.error("Error fetching homeworld:",t),null}},g=async e=>{try{const t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch Starship from ${e}`);return t.json()}catch(t){return console.error("Error fetching Starship:",t),null}},w=async()=>{try{const e=[1,4,10],t=[];for(let n of e){const s=await u(n);if(s){const r=await f(s.homeworld);s.homeworld_name=r.name,s.starships_names=[];for(let o of s.starships){const a=await g(o);a&&s.starships_names.push(a.name)}t.push(s)}else console.error(`Failed to fetch character with ID ${n}`)}return t}catch(e){return console.error("Error fetching characters:",e),[]}},y=e=>{const t=document.getElementById("default-data-list");t.innerHTML="",e.forEach(n=>{const s=document.createElement("li"),r=document.createElement("img");r.src=m(n.url.split("/")[5]),r.alt=n.name,r.classList.add("character-image");const o=document.createElement("p");o.textContent=`Name: ${n.name}`;const a=document.createElement("p");a.textContent=`Height: ${n.height}`;const i=document.createElement("p");i.textContent=`Birth Year: ${n.birth_year}`;const l=document.createElement("p");l.textContent=`Gender: ${n.gender}`;const d=document.createElement("p");d.textContent=`Planet: ${n.homeworld_name}`;const h=document.createElement("p");h.textContent=`Starships:${n.starships_names}`;const c=document.createElement("button");c.setAttribute("id","delete-btn"),c.textContent="Delete this Card",s.append(r,o,a,i,l,d,h,c),t.appendChild(s)})},E=e=>{if(!e.target.matches("#delete-btn"))return;e.target.closest("li").remove()},C=async()=>{try{const e=await w();y(e)}catch(e){console.error("Failed to fetch and render characters:",e)}},$=async()=>{const e=await p();console.log("https://swapi.dev/api/people/"),console.log(e),C(),document.querySelector("#default-data-list").addEventListener("click",E)};$();