(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();const w=t=>`https://starwars-visualguide.com/assets/img/characters/${t}.jpg`,g=async()=>{try{const e=await fetch("https://swapi.dev/api/");if(!e.ok)throw new Error("Failed to get Star Wars info!");const s=await e.json();console.log("data:",s)}catch(t){return console.warn(t.message),null}},y=async t=>{try{const e=await fetch(`https://swapi.dev/api/people/${t}/`);if(!e.ok)throw new Error(`Failed to fetch character with ID ${t}`);return e.json()}catch(e){return console.error(`Error fetching character with ID ${t}:`,e),null}},p=async t=>{try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch homeworld from ${t}`);return e.json()}catch(e){return console.error("Error fetching homeworld:",e),null}},u=async t=>{try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch Starship from ${t}`);return e.json()}catch(e){return console.error("Error fetching Starship:",e),null}},f=async()=>{try{const t=[1,4,10],e=[];for(let s of t){const r=await y(s);if(r){const o=await p(r.homeworld);r.homeworld_name=o.name,r.starships_names=[];for(let n of r.starships){const a=await u(n);a&&r.starships_names.push(a.name)}e.push(r)}else console.error(`Failed to fetch character with ID ${s}`)}return e}catch(t){return console.error("Error fetching characters:",t),[]}},m=(t,e)=>{const s=document.createElement("li"),r=document.createElement("img");r.src=w(e.url.split("/")[5]),r.alt=e.name,r.classList.add("character-image");const o=document.createElement("p");o.textContent=`Name: ${e.name}`;const n=document.createElement("p");n.textContent=`Height: ${e.height}`;const a=document.createElement("p");a.textContent=`Birth Year: ${e.birth_year}`;const c=document.createElement("p");c.textContent=`Gender: ${e.gender.toUpperCase()}`;const l=document.createElement("p");l.textContent=`Planet: ${e.homeworld_name}`;const i=document.createElement("p");i.textContent=`Starships: ${e.starships_names}`;const h=document.createElement("button");h.textContent="Click here for more info",h.id="more-info-button",n.classList.toggle("hidden"),a.classList.toggle("hidden"),c.classList.toggle("hidden"),h.addEventListener("click",()=>{n.classList.toggle("hidden"),a.classList.toggle("hidden"),c.classList.toggle("hidden")});const d=document.createElement("button");d.setAttribute("id","delete-btn"),d.textContent="Delete this Card",s.append(r,o,l,i,d),s.append(h,c,n,a),t.appendChild(s)},E=t=>{const e=document.getElementById("default-data-list");e.innerHTML="";const s=document.createElement("button");s.textContent="Learn about a random Star Wars Character",s.id="random-button",s.addEventListener("click",async()=>{const r=await S();r&&m(e,r)}),e.append(s),t.forEach(r=>{m(e,r)})},C=t=>{if(!t.target.matches("#delete-btn"))return;t.target.closest("li").remove()},L=async()=>{try{const t=await f();E(t)}catch(t){console.error("Failed to fetch and render characters:",t)}},I=()=>Math.floor(Math.random()*83)+1,S=async()=>{const e=`https://swapi.dev/api/people/${I()}/`;try{const s=await fetch(e);if(!s.ok)throw new Error("Cannot fetch random ID from API");const r=await s.json();if(r.homeworld){const o=await p(r.homeworld);r.homeworld_name=o.name}else r.homeworld_name="Unknown";if(r.starships_names=[],r.starships.length>0)for(let o of r.starships){const n=await u(o);n&&r.starships_names.push(n.name)}else r.starships_names.push("None");return console.log(r),r}catch(s){return console.warn(s.message),null}},$=async t=>{t.preventDefault();const e=t.target,s=e.querySelector("#search-input").value;if(!s){console.error("Please enter a character name");return}try{const o=(await f()).filter(n=>n.name.toLowerCase().includes(s.toLowerCase()));if(o.length>0){const n=document.getElementById("search-results-list");n.innerHTML="",o.forEach(async a=>{const c=await p(a.homeworld);a.homeworld_name=c?c.name:"Unknown",a.starships_names=[];for(let l of a.starships){const i=await u(l);i&&a.starships_names.push(i.name)}m(n,a)})}else console.error(`No characters found with name '${s}'`)}catch(r){console.error("Error fetching characters:",r)}e.reset()},b=async()=>{const t=await g();console.log("https://swapi.dev/api/people/"),console.log(t),L(),document.querySelector("#search-form").addEventListener("submit",$),document.querySelector("#default-data-list").addEventListener("click",C)};b();