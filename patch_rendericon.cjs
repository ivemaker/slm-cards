const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `              if (link.platform === 'phone') {
                return (
                  <button
                    key={idx}`;
const replacement1 = `              if (link.platform === 'phone' && isLink) {
                return (
                  <button
                    key={idx}`;
code = code.replace(target1, replacement1);

const target2 = `              if (link.platform === 'map') {
                return (
                  <button
                    key={idx}`;
const replacement2 = `              if (link.platform === 'map' && isLink) {
                return (
                  <button
                    key={idx}`;
code = code.replace(target2, replacement2);

const target3 = `              if (link.isGrouped) {
                return (
                  <button
                    key={idx}`;
const replacement3 = `              if (link.isGrouped && isLink) {
                return (
                  <button
                    key={idx}`;
code = code.replace(target3, replacement3);

const target4 = `                    const sharedProps = {
                      key: idx,
                      className: \`flex items-center justify-between w-full p-2.5 transition-all duration-150 active:scale-[0.99] border hover:shadow-xs \${radiusClass} \${`;

const replacement4 = `                    const sharedProps = {
                      className: \`flex items-center justify-between w-full p-2.5 transition-all duration-150 active:scale-[0.99] border hover:shadow-xs \${radiusClass} \${`;
code = code.replace(target4, replacement4);

const target5 = `                    if (link.platform === 'phone') {
                      return (
                        <button
                          {...sharedProps}
                          onClick={(e) => {`;
const replacement5 = `                    if (link.platform === 'phone') {
                      return (
                        <button
                          key={idx}
                          {...sharedProps}
                          onClick={(e) => {`;
code = code.replace(target5, replacement5);

const target6 = `                    if (link.platform === 'map') {
                      return (
                        <button
                          {...sharedProps}
                          onClick={(e) => {`;
const replacement6 = `                    if (link.platform === 'map') {
                      return (
                        <button
                          key={idx}
                          {...sharedProps}
                          onClick={(e) => {`;
code = code.replace(target6, replacement6);

const target7 = `                    return (
                      <a
                        {...sharedProps}
                        href={isPreviewMockupMode ? undefined : link.url}`;
const replacement7 = `                    return (
                      <a
                        key={idx}
                        {...sharedProps}
                        href={isPreviewMockupMode ? undefined : link.url}`;
code = code.replace(target7, replacement7);

fs.writeFileSync('src/App.tsx', code);
console.log('Success');
