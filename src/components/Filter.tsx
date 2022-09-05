// Typing for props values from App 
interface Inherit {
   isOn: boolean,
   theme: Object,
   border: Object, 
   todos: Object[],
   setter: Function,
}

const Filter = (props: Inherit) => {
   const show = {visibility: 'hidden'};
   return (
      <div id="filters" style={props.todos ? props.theme : {...props.theme, ...show}}>
         <label>
            <input 
               type="radio" 
               name="sort" 
               id="all" 
               onClick={() => {
                  props.setter('all');
               }}
            />
            <span>All</span>
         </label>
         <label>
            <input 
               type="radio" 
               name="sort" 
               id="active" 
               onClick={() => {
                  props.setter('active');
               }}
            />
            <span>Active</span>
         </label>
         <label>
            <input 
               type="radio" 
               name="sort" 
               id="completed" 
               onClick={() => {
                  props.setter('completed');
               }}
            />
            <span>Completed</span>
         </label>
       </div>
   )
}

export default Filter; 