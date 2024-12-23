const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!text || text[0] !== "1") {
      throw new Error("Invalid response format from server.");
    }
    const [id, code, nickName, name] = text.split(";");
    return { id: parseInt(id), code, nickName, name };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

(function (history) {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("pushstate"));
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("replacestate"));
    return result;
  };
})(window.history);

const vm = new StoreinoApp({
  el: "#app_simulator",
  data: {
    data: __DATA__,
  },

});

