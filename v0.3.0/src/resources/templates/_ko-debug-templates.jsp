<script type="text/html" id="form-debug-validationdigest-template">
<fieldset class="TODO">
<legend onclick="$('#debug').toggle()">Debug</legend>
<div id="debug" style="display: none;">
<p>
Numéro de dossier: ${numDos}
</p>
<table id="debug-validationdigest" data-role="list" style="width: 100%;">
	<thead>
		<tr>
			<th>Nom</th>
			<th>Requis</th>
			<th>Visible</th>
			<th>Désactivé</th>
			<th>Modifié</th>
			<th>Valide</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Validité du formulaire</td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td class="strong" data-bind="text: isFormValid"></td>
		</tr>
	</tbody>
	<tbody>
		<tr>
			<td></td>
			<td class="strong" data-bind="text: isRequired"></td>
			<td class="strong" data-bind="text: isVisible"></td>
			<td class="strong" data-bind="text: isDisabled"></td>
			<td class="strong" data-bind="text: hasChanged"></td>
			<td class="strong" data-bind="text: isLastInputValid"></td>
		</tr>
	</tbody>
	<tbody data-bind="foreach: oListOfIUIField">
		<tr>
			<td data-bind="text: id"></td>
			<td data-bind="text: isRequired"></td>
			<td data-bind="text: isVisible"></td>
			<td data-bind="text: isDisabled"></td>
			<td data-bind="text: hasChanged"></td>
			<td data-bind="text: isLastInputValid"></td>
		</tr>
	</tbody>
</table>
</div>
</fieldset>
</script>